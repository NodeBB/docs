# Installing on {{name}}

This installation guide is optimized for 
**{{name}} {{version}}** and will install NodeBB with MongoDB as the database. Fully patched LTS and equivalent **production** versions of software are assumed and used throughout.

**Confused?** &ndash; A simpler guide for Ubuntu 18.04 with lots of screenshots can be found [on the NodeBB Blog](https://blog.nodebb.org/how-to-install-nodebb-on-digitalocean-ubuntu-18-04/).

### System Requirements

- **Memory**: Installing NodeBB's dependencies may require more than 512 megabytes of system memory. It is recommended to [enable a swap partition](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04) to compensate if your Linux system has insufficient memory.

## Installing Node.js

Naturally, NodeBB is driven by Node.js, and so it needs to be installed. Node.js is a rapidly evolving platform and so installation of the current LTS version of Node.js is recommended to make future updates seemless. The [Node.js LTS Plan](https://github.com/nodejs/LTS) details the LTS release schedule including projected end-of-life.

{{node.install}}

Verify installation of Node.js and npm. You should have version {{versions.major.node}} of Node.js installed, and version {{versions.major.npm}} of npm installed:

```bash
{{commandPrefix}} node -v
v{{versions.recommended.node}}
{{commandPrefix}} npm -v
{{versions.recommended.npm}}
```

### Database

## Installing MongoDB

MongoDB is the default database for NodeBB. As noted in the [MongoDB Support Policy](https://www.mongodb.com/support-policy) versions older than **3.4** are officially **End of Life** as of December 2018.
This guide assumes installation of **{{versions.recommended.mongo}}**. If you wish to use another database instead of MongoDB the [Configuring Databases](../../configuring/databases) section has more information.

Official detailed installation instructions can be found in the [MongoDB manual](https://docs.mongodb.com/manual/administration/install-community/). Although out of scope for this guide, some MongoDB production deployments leverage clustering, sharding and replication for high availibility and performance reasons. Please refer to the MongoDB [Replication](https://docs.mongodb.com/v{{versions.recommended.mongo}}/replication/) and [Sharding](https://docs.mongodb.com/v{{versions.recommended.mongo}}/sharding/) topics for further reading. Keep in mind that NodeBB does not require any of these advanced configurations, and doing so may complicate your installation. Keeping it simple often can be best.

{{mongo.install}}

Verify installation of MongoDB. You should have version {{versions.recommended.mongo}}:

```bash
{{commandPrefix}} mongod --version
db version v{{versions.recommended.mongo}}
```

Start the `mongod` service and verify service status:

```
{{mongo.service.start}}
{{mongo.service.status}}
```

## Configure MongoDB

General MongoDB administration is done through the MongoDB Shell `mongo`. A default installation of MongoDB listens on port `27017` and is accessible locally. Access the shell:

```bash
{{commandPrefix}} mongo
```

Switch to the built-in `admin` database:

```
> use admin
```

Create an administrative user (the is different from the `nodebb` user we'll create later). Replace the placeholder `<Enter a secure password>` with your own selected password. Be sure that the `<` and `>` are also not left behind.

```
> db.createUser( { user: "admin", pwd: "<Enter a secure password>", roles: [ { role: "root", db: "admin" } ] } )
```

This user is scoped to the `admin` database to manage MongoDB once authorization has been enabled.

To initially create a database that doesn't exist simply `use` it. Add a new database called `nodebb`:

```
> use nodebb
```

The database will be created and context switched to `nodebb`. Next create the `nodebb` user with the appropriate privileges:

```
> db.createUser( { user: "nodebb", pwd: "<Enter a secure password>", roles: [ { role: "readWrite", db: "nodebb" }, { role: "clusterMonitor", db: "admin" } ] } )
```

The `readWrite` permission allows NodeBB to store and retrieve data from the `nodebb` database. The `clusterMonitor` permission provides NodeBB read-only access to query database server statistics which are then exposed in the NodeBB Administrative Control Panel (ACP).

Exit the Mongo Shell:

```
> quit()
```

Enable database authorization in the MongoDB configuration file `{{mongo.config}}` by appending the following lines:

```
security:
  authorization: enabled
```

Restart MongoDB and verify the administrative user created earlier can connect:

```
{{mongo.service.restart}}
{{commandPrefix}} mongo -u admin -p your_password --authenticationDatabase=admin
```

If everything is configured correctly the Mongo Shell will connect. Exit the shell.

## Installing NodeBB

First, we must install `git` as it is used to distribute NodeBB:

{{git.install}}

**Note**: commands like `git` and `./nodebb` should _not_ be used with root access (`sudo` or elevated privileges). It will cause problems with different ownership of files NodeBB needs access to

Next, clone NodeBB into an appropriate location. Here the local `nodebb` directory is used, though any destination is fine:

```
{{commandPrefix}} git clone -b v{{versions.recommended.nodebb}} https://github.com/NodeBB/NodeBB.git nodebb
{{commandPrefix}} cd nodebb
```

This clones the NodeBB repository from the 
`v{{versions.recommended.nodebb}}` branch to the `nodebb` directory. A list of alternative branches are available in the [NodeBB Branches](https://github.com/NodeBB/NodeBB/branches) GitHub page, but only the versioned branches are stable.

NodeBB ships with a command line utility which allows for several functions. We'll first use it to setup NodeBB. This will install modules from _npm_ and then enter the setup utilty.

```bash
{{nodebb.setup}}
```

A series of questions will be prompted with defaults in parentheses. The default settings are for a local server listening on the default port `4567` with a MongoDB instance listening on port `27017`. When prompted be sure to configure the MongoDB username and password that was configured earlier for NodeBB. Once connectivity to the database is confirmed the setup will prompt that initial user setup is running. Since this is a fresh NodeBB install a forum administrator must be configured. Enter the desired administrator information. This will culminate in a `NodeBB Setup Completed` message.

**Note**: When entering your site URL, make sure it is _exactly_ what you plan on accessing your site at. If you plan on visiting `http://example.org` to open your forum, then enter exactly `http://example.org`.

A configuration file [config.json](../../configuring/config) will be created in the root of the nodebb directory. This file can be modified should you need to make changes such as changing the database location or credentials used to access the database.

Finally, you can use the cli utility to start NodeBB:

```bash
{{nodebb.start}}
```

## Installing nginx

NodeBB by default runs on port `4567`, meaning that by default you mustaccess it using a port number in addition to the hostname (e.g. `http://example.org:4567`)

In order to allow NodeBB to be served without a port, nginx can be set up to proxy all requests to a particular hostname (or subdomain) to an upstream NodeBB server running on any port.

{{nginx.install}}

Verify the installation of nginx

```bash
{{commandPrefix}} nginx -v
```

and that the service will run

```bash
{{nginx.service.start}}
{{nginx.service.status}}
```

You should now be able to go to your site's address in your browser and see the default **Welcome to nginx!** message.

## Configuring nginx

NGINX-served sites are contained in a `server` block which are normally stored in separate files from the main nginx config (which is very rarely edited).

{{nginx.configs}}

Below is an example configuration for NodeBB running on port `4567`.

```
server {
    listen 80;

    server_name forum.example.com;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://127.0.0.1:4567;
        proxy_redirect off;

        # Socket.IO Support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

After making changes to nginx configs, you have to reload the service for changes to take effect:

```bash
{{nginx.service.reload}}
```

For more information, go to the [configuring nginx](../configuring/nginx) page.

## After Installation

Great, you have NodeBB installed and running. You should be able to access `http://forum.example.com` and interact with your forum. 
