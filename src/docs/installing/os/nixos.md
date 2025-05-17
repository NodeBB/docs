NixOS
=====

MySQL
-----

Create file `shell.nix` with the following content (adjust the variables as needed):
```nix
{
  pkgs ? import <nixpkgs> { },
}:
let
  # adjust the following variables as needed
  # Define NodeBB version and repository
  nodebbRepo = "https://github.com/MBanucu/NodeBB.git";
  nodebbBranch = "mysql-backup2"; # MySQL branch

  # Define NodeBB admin credentials
  nodebbAdminUsername = "admin"; # Set your admin username
  nodebbAdminPassword = "admin_password"; # Set your admin password
  nodebbAdminEmail = "your_nodebb_admin_email_here@gmail.com"; # Set your admin email

  # Define MySQL database credentials
  mysqlUsername = "nodebb_user"; # MySQL username for NodeBB
  mysqlPassword = "nodebb_user_password"; # MySQL password for NodeBB
  mysqlDatabase = "nodebb"; # MySQL database for NodeBB

  development = true; # Set to false for non-development mode

  MYSQL_HOME = "${builtins.getEnv "PWD"}/mysql";
  MYSQL_DATADIR = "${MYSQL_HOME}/data";
  MYSQL_UNIX_PORT = "${MYSQL_HOME}/mysql.sock";
  MYSQL_PID_FILE = "${MYSQL_HOME}/mysql.pid";

  JSON_CONFIG_TEST = ''
    {
      "test_database": {
        "socketPath": "${MYSQL_UNIX_PORT}",
        "username": "${mysqlUsername}_test",
        "password": "${mysqlPassword}",
        "database": "${mysqlDatabase}_test"
      }
    }
  '';

  UUID_SECRET = builtins.replaceStrings [ "\n" ] [ "" ] (
    builtins.readFile (
      pkgs.runCommand "generate-uuid" { } ''
        ${pkgs.util-linux}/bin/uuidgen > $out
      ''
    )
  );

  JSON_CONFIG = ''
    {
      "url": "http://localhost:4567",
      "port": "4567",
      "secret": "${UUID_SECRET}",
      "database": "mysql",
      "mysql:host": "127.0.0.1",
      "mysql:port": "3306",
      "mysql:socketPath": "${MYSQL_UNIX_PORT}",
      "mysql:username": "${mysqlUsername}",
      "mysql:password": "${mysqlPassword}",
      "mysql:database": "${mysqlDatabase}",
      "admin:username": "${nodebbAdminUsername}",
      "admin:password": "${nodebbAdminPassword}",
      "admin:password:confirm": "${nodebbAdminPassword}",
      "admin:email": "${nodebbAdminEmail}"
    }
  '';

  JSON_VSCODE_TASKS = ''
    {
      "version": "2.0.0",
      "tasks": [
        {
          "label": "Run grunt",
          "type": "shell",
          "command": "node ./node_modules/.bin/grunt",
          "runOptions": {
            "runOn": "folderOpen"
          }
        }
      ]
    }
  '';

  JSON_VSCODE_SETTINGS = ''
    {
      "mochaExplorer.env": {
        "CI": "true"
      }
    }
  '';

  masterOverlays = [
    (
      self: super:
      let
        nix-vscode-extensions = import (
          fetchTarball "https://github.com/nix-community/nix-vscode-extensions/archive/master.tar.gz"
        );
        nixpkgsMaster =
          import
            (builtins.fetchTarball {
              url = "https://github.com/NixOS/nixpkgs/archive/master.tar.gz";
            })
            {
              config.allowUnfree = true;
              overlays = [
                nix-vscode-extensions.overlays.default
              ];
            };
      in
      {
        # nodejs_20 version is 20.18 of NixOS 24.11 but we need 20.19 for require(ESM)
        nodejs_20 = nixpkgsMaster.nodejs_20;
        vscode = (
          nixpkgsMaster.vscode-with-extensions.override {
            vscode = nixpkgsMaster.vscode;
            vscodeExtensions = with nixpkgsMaster.vscode-marketplace; [
              ms-vscode.test-adapter-converter
              hbenl.vscode-test-explorer
              hbenl.vscode-mocha-test-adapter

              jnoortheen.nix-ide
            ];
          }
        );
      }
    )
  ];
  pkgsMaster = import <nixpkgs> { overlays = masterOverlays; };
in
pkgs.mkShell {
  name = "nodebb-env";

  buildInputs =
    with pkgs;
    [
      pkgsMaster.nodejs_20 # NodeBB recommends Node.js 20.19 or higher
      git # For cloning NodeBB
      mysql80 # MySQL 8.0, because MariaDB doesn't work right now
      jq # For JSON manipulation
    ]
    ++ (
      if development then
        [
          nodePackages.grunt-cli
          nixfmt-rfc-style
          pkgsMaster.vscode
        ]
      else
        [ ]
    );

  shellHook = ''
    # Set up environment variables
    export MYSQL_HOME="${MYSQL_HOME}"
    export MYSQL_DATADIR="${MYSQL_DATADIR}"
    export MYSQL_UNIX_PORT="${MYSQL_UNIX_PORT}"
    export MYSQL_PID_FILE="${MYSQL_PID_FILE}"
    alias mysql='mysql -u root'

    # Set up MySQL 8.0
    if [ ! -d "${MYSQL_HOME}" ]; then
      echo "Initializing MySQL 8.0..."
      mkdir -p "${MYSQL_HOME}"
      mysqld --initialize-insecure --datadir="${MYSQL_DATADIR}" --basedir="${pkgs.mysql80}" \
        --pid-file="${MYSQL_PID_FILE}"
    fi

    # Start MySQL daemon
    echo "Starting MySQL 8.0..."
    mysqld --no-defaults --skip-networking --datadir="${MYSQL_DATADIR}" \
      --pid-file="${MYSQL_PID_FILE}" --socket="${MYSQL_UNIX_PORT}" \
      2> "${MYSQL_HOME}/mysql.log" &
    MYSQL_PID=$!

    # Wait for MySQL to start
    echo "Waiting for MySQL to be ready..."
    while ! mysqladmin ping --socket="${MYSQL_UNIX_PORT}" --silent; do
      sleep 1
    done

    # Create NodeBB database and user
    echo "Setting up NodeBB database..."
    mysql --socket="${MYSQL_UNIX_PORT}" -u root <<EOF
    CREATE DATABASE IF NOT EXISTS ${mysqlDatabase};
    CREATE USER IF NOT EXISTS '${mysqlUsername}'@'localhost' IDENTIFIED BY '${mysqlPassword}';
    GRANT ALL PRIVILEGES ON ${mysqlDatabase}.* TO '${mysqlUsername}'@'localhost';
    FLUSH PRIVILEGES;
    EOF

    if [ ${toString development} ]; then
      echo "setting up test database..."
      mysql --socket="${MYSQL_UNIX_PORT}" -u root <<EOF
      CREATE DATABASE IF NOT EXISTS ${mysqlDatabase}_test;
      CREATE USER IF NOT EXISTS '${mysqlUsername}_test'@'localhost' IDENTIFIED BY '${mysqlPassword}';
      GRANT ALL PRIVILEGES ON ${mysqlDatabase}_test.* TO '${mysqlUsername}_test'@'localhost';
      FLUSH PRIVILEGES;
    EOF

      echo "setting up test database done"
    fi

    # Clean up MySQL on shell exit
    finish() {
      echo "Shutting down MySQL..."
      mysqladmin -u root --socket="${MYSQL_UNIX_PORT}" shutdown
    }
    trap finish EXIT

    # Clone NodeBB if not already present
    if [ ! -d "NodeBB" ]; then
      echo "Cloning NodeBB repository..."
      git clone -b ${nodebbBranch} ${nodebbRepo} NodeBB
    fi

    # Navigate to NodeBB directory
    cd NodeBB

    if [ ! -d "node_modules" ]; then

      if [ ${toString development} ]; then
        echo "Writing config.json for test_database for development mode..."
        echo '${JSON_CONFIG_TEST}' | jq . --indent 4 > config.json

        echo "setting up grunt task for VSCode for development mode..."
        mkdir -p .vscode
        echo '${JSON_VSCODE_TASKS}' | jq . --indent 4 > .vscode/tasks.json

        echo "setting up Mocha Test Explorer plugin for VSCode for development mode..."
        echo '${JSON_VSCODE_SETTINGS}' | jq . --indent 4 > .vscode/settings.json
      fi

      node ./nodebb setup '${JSON_CONFIG}'

      if [ ${toString development} ]; then
        echo "Running npm install for development mode..."
        npm install
      fi
    fi

    if [ ${toString development} ]; then
      code .
    fi

    echo "NodeBB environment is set up!"
  '';
}
```
Run
```
nix-shell
```
in the directory where `shell.nix` is located.
Leave the nix shell open or else everything closes.
