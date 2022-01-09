# macOS BigSur (Intel)

This guide was tested on macOS 11.6 BigSur on an Intel based Mac.
Even though it was not tested, it should also work on other macOS Versions and Apple Silicon Macs.

We're going to install everything you need to run NodeBB on your Mac.

## Preparing your Mac

For the installtion of NodeBB we need Brew, the Xcode Command-Line Tools and a user with administrator privileges.
Brew is a package manager for macOS and makes it easy to install additional software.
Check out the [official brew.sh page](https://brew.sh) for installation instructions.
The Xcode Command-Line Tools install commonly used tools which we need for the installation of MongoDB.
You can install them via

```sh
xcode-select --install
```

## Installing Node.js

Naturally, NodeBB is driven by Node.js, and so it needs to be installed.
Node.js is a rapidly evolving platform and so installation of the current LTS version of Node.js is recommended to make
future updates seemless. The [Node.js LTS Plan](https://github.com/nodejs/LTS) details the LTS release schedule including projected end-of-life.

As time of writing this instruction, Node.js 14 is the Active LTS so we are going to install it:

```sh
brew install node@14
brew link node@14 # since we are installing an alternative version, we have to manually link it
```

Verify installation of Node.js and npm. You should have version 14 of Node.js installed, and version 6 of npm installed:

```sh
node -v # v14.x.x
npm -v # 6.x.x
```

### Database

## Installing MongoDB

Check out the [official MongoDB Docs](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition), if you want an in-depth explanation, what the following commands do.

```sh
brew tap mongodb/brew
brew install mongodb-community@4.0
brew link mongodb-community@4.0
```

Verify installation of MongoDB. You should have version 4.0:

Example Output:

```sh
db version v4.0.27
git version: d47b151b55f286546e7c7c98888ae0577856ca20
allocator: system
modules: none
build environment:
    distarch: x86_64
    target_arch: x86_64
```

Start the MongoDB service and set it to autostart:

```sh
brew services start mongodb/brew/mongodb-community@4.0
```

## Configure MongoDB

General MongoDB administration is done through the MongoDB Shell `mongo`. A default installation of MongoDB listens on port `27017` and is accessible locally. Access the shell:

```bash
mongo
```

Switch to the built-in `admin` database:

```
use admin
```

Create an administrative user (the is different from the `nodebb` user we'll create later). Replace the placeholder `<Enter a secure password>` with your own selected password. Be sure that the `<` and `>` are also not left behind.

```
db.createUser( { user: "admin", pwd: "<Enter a secure password>", roles: [ { role: "root", db: "admin" } ] } )
```

This user is scoped to the `admin` database to manage MongoDB once authorization has been enabled.

To initially create a database that doesn't exist simply `use` it. Add a new database called `nodebb`:

```
use nodebb
```

The database will be created and context switched to `nodebb`. Next create the `nodebb` user with the appropriate privileges:

```
db.createUser( { user: "nodebb", pwd: "<Enter a secure password>", roles: [ { role: "readWrite", db: "nodebb" }, { role: "clusterMonitor", db: "admin" } ] } )
```

The `readWrite` permission allows NodeBB to store and retrieve data from the `nodebb` database. The `clusterMonitor` permission provides NodeBB read-only access to query database server statistics which are then exposed in the NodeBB Administrative Control Panel (ACP).

Exit the Mongo Shell:

```
quit()
```

Enable database authorization in the MongoDB configuration file ` /usr/local/etc/mongod.conf` by appending the following lines:

```
security:
  authorization: enabled
```

Restart MongoDB and verify the administrative user created earlier can connect:

```
brew services restart mongodb/brew/mongodb-community@4.0
mongo -u admin -p your_password --authenticationDatabase=admin
```

If everything is configured correctly the Mongo Shell will connect. Exit the shell.

## Installing NodeBB

After you've installed MongoDB, we can continue with NodeBB. Clone NodeBB into an appropriate location.
Here the local nodebb directory is used, though any destination is fine:

```sh
git clone -b v1.18.x https://github.com/NodeBB/NodeBB.git nodebb
cd nodebb
```

This clones the NodeBB repository from the v1.18.x branch to the nodebb directory. A list of alternative branches are
available in the [NodeBB Branches](https://github.com/NodeBB/NodeBB/branches) GitHub page, but only the versioned branches are stable.

NodeBB ships with a command line utility which allows for several functions. We'll first use it to setup NodeBB.
This will install modules from npm and then enter the setup utilty.

```sh
./nodebb setup
```

A series of questions will be prompted with defaults in parentheses. The default settings are for a local server listening
on the default port `4567` with a MongoDB instance listening on port `27017`. When prompted for the mongodb username and password,
enter `nodebb`, and the password that you configured earlier. Once connectivity to the database is confirmed the setup will prompt
that initial user setup is running. Since this is a fresh NodeBB install a forum administrator must be configured.
Enter the desired administrator information. This will culminate in a _NodeBB Setup Completed_ message.

**Note:** When entering your site URL, make sure it is exactly what you plan on accessing your site at.
If you plan on visiting `http://example.org` to open your forum, then enter exactly `http://example.org`.

A configuration file [config.json](https://docs.nodebb.org/installing/configuring/config) will be created in the root of the nodebb directory.
This file can be modified should you need to make changes such as changing the database location or credentials used to access the database.

Finally, you can use the cli utility to start NodeBB:

```sh
./nodebb start
```

## Setting up NGINX as reverse proxy

NodeBB by default runs on port `4567`, meaning that by default you must access it using a port number in addition to the hostname (e.g. `http://example.org:4567`).

In order to allow NodeBB to be served without a port, nginx can be set up to proxy all requests to a particular hostname (or subdomain) to an upstream NodeBB server running on any port.
Additionally, you can setup SSL with NGINX and other awesome things like caching.

Installing NGINX is pretty straight forward:

```sh
brew install nginx
brew services start nginx # Set it up so it starts on system reboot
```

Check the version:

```sh
nginx -v # ~> nginx version: nginx/1.21.3 (or similiar)
```

### Editing the NGINX Config

By default, NGINX listens on Port 8080 but we want NGINX to run on Port 80. Let's change the config:

```sh
nano /usr/local/etc/nginx/nginx.conf
```

This will open a Texteditor in your terminal. You can navigate with the Arrow Keys on your keyboard. Scroll down all the way to this line:

```
listen 8080;
```

and change the `8080` to `80`. Now restart nginx via brew:

```sh
brew services restart nginx
```

Open your web browser and head to [http://localhost](http://localhost), you should see NGINX's default welcome page.

Let's continue with setting up NGINX to proxy NodeBB.

NGINX-served sites are contained in a `server` block which are normally stored in separate files from the main nginx config (which is very rarely edited).

When installing via brew, the best way to add new nginx configs is to add new files in /usr/local/etc/nginx/servers (like /usr/local/etc/nginx/servers/forum.example.org.conf).

Let us create a new config file and edit it via `nano`:

```sh
nano /usr/local/etc/nginx/servers/forum.example.com.conf # Change the forum.example.com to your domain or something else
```

Simply copy the following config file which provides you with a basic proxying setup.

```conf
server {
    listen 80;

    server_name forum.example.com; # Set this to your domain.

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://127.0.0.1:4567; # Change this Port if NodeBB listens on another port
        proxy_redirect off;

        # Socket.IO Support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Add this if you want to redirect from www.forum.example.com to forum.example.com

server {
    server_name www.forum.example.com;
    listen 80;
    return 301 https://forum.example.com$request_uri;
}
```

Restart NGINX again...

```sh
brew services restart nginx
```

...and reload the browser window. You should see your NodeBB Instance. If you want to dig deeper into NGINX check out the [configuring NGINX](https://docs.nodebb.org/installing/os/configuring/nginx) page.

### You are done!

Awesome, you've got NodeBB installed and running. You should be able to access http://forum.example.com and interact with your forum.
If you've set it up you can also test your redirect from http://www.forum.example.com.

As an additional step you can also reboot your machine (or log out and log in again) and check if everything starts correctly.
