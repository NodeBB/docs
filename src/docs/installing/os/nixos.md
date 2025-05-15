NixOS
=====

MySQL
-----

Create file `shell.nix` with the following content (adjust the variables as needed):
```nix
{pkgs ? import <nixpkgs> {}}: let
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
in
  pkgs.mkShell {
    name = "nodebb-dev-env";

    buildInputs = with pkgs; [
      nodejs_22 # NodeBB recommends Node.js 20 or higher
      git # For cloning NodeBB
      mysql80 # MySQL 8.0 instead of MariaDB
      gnused
    ];

    shellHook = ''
      # Set up environment variables
      export MYSQL_HOME="$PWD/mysql"
      export MYSQL_DATADIR="$MYSQL_HOME/data"
      export MYSQL_UNIX_PORT="$MYSQL_HOME/mysql.sock"
      export MYSQL_PID_FILE="$MYSQL_HOME/mysql.pid"
      alias mysql='mysql -u root'

      # Set up MySQL 8.0
      if [ ! -d "$MYSQL_HOME" ]; then
        echo "Initializing MySQL 8.0..."
        mkdir -p "$MYSQL_HOME"
        mysqld --initialize-insecure --datadir="$MYSQL_DATADIR" --basedir="${pkgs.mysql80}" \
          --pid-file="$MYSQL_PID_FILE"
      fi

      # Start MySQL daemon
      echo "Starting MySQL 8.0..."
      mysqld --no-defaults --skip-networking --datadir="$MYSQL_DATADIR" \
        --pid-file="$MYSQL_PID_FILE" --socket="$MYSQL_UNIX_PORT" \
        2> "$MYSQL_HOME/mysql.log" &
      MYSQL_PID=$!

      # Wait for MySQL to start
      echo "Waiting for MySQL to be ready..."
      while ! mysqladmin ping --socket="$MYSQL_UNIX_PORT" --silent; do
        sleep 1
      done

      # Create NodeBB database and user
      echo "Setting up NodeBB database..."
      mysql --socket="$MYSQL_UNIX_PORT" -u root <<EOF
      CREATE DATABASE IF NOT EXISTS ${mysqlDatabase};
      CREATE USER IF NOT EXISTS '${mysqlUsername}'@'localhost' IDENTIFIED BY '${mysqlPassword}';
      GRANT ALL PRIVILEGES ON ${mysqlDatabase}.* TO '${mysqlUsername}'@'localhost';
      FLUSH PRIVILEGES;
      EOF

      # Clean up MySQL on shell exit
      finish() {
        echo "Shutting down MySQL..."
        mysqladmin -u root --socket="$MYSQL_UNIX_PORT" shutdown
        kill $MYSQL_PID
        wait $MYSQL_PID 2>/dev/null
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

        # Generate UUID for secret
        UUID_SECRET=$(uuidgen)
        # after successful installation, you can change the secret in the config.json file

        JSON_CONFIG='{
          "url": "http://localhost:4567",
          "secret": "'"$UUID_SECRET"'",
          "database": "mysql",
          "mysql:host": "127.0.0.1",
          "mysql:port": "3306",
          "mysql:socketPath": "'"$MYSQL_UNIX_PORT"'",
          "mysql:username": "${mysqlUsername}",
          "mysql:password": "${mysqlPassword}",
          "mysql:database": "${mysqlDatabase}",
          "port": "4567",
          "admin:username": "${nodebbAdminUsername}",
          "admin:password": "${nodebbAdminPassword}",
          "admin:password:confirm": "${nodebbAdminPassword}",
          "admin:email": "${nodebbAdminEmail}"
        }'
        node ./nodebb setup "$JSON_CONFIG"
      fi

      # Instructions for running NodeBB
      echo "NodeBB environment is set up!"
      echo "To start NodeBB, run: ./nodebb start"
      echo "Database: ${mysqlDatabase}, User: ${mysqlUsername}, Password: ${mysqlPassword}, Socket: $MYSQL_UNIX_PORT"
    '';
  }
```
Run
```
nix-shell
```
in the directory where `shell.nix` is located.
Leave the nix shell open or else everything closes.
