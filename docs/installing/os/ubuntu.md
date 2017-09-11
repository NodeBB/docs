# Ubuntu

This installation guide is optimized for **Ubuntu 16.04 LTS** and will install NodeBB with MongoDB as the database. Fully patched LTS and equivalent **production** versions of software are assumed and used throughout.

------------------------------------------------------------------------

## Install Node.js

Naturally, NodeBB is driven by Node.js, and so it needs to be installed. Node.js is a rapidly evolving platform and so installation of an LTS version of Node.js is recommended to avoid unexpected breaking changes in the future as part of system updates. The [Node.js LTS Plan](https://github.com/nodejs/LTS) details the LTS release schedule including projected end-of-life.

To start, add the nodesource repository per the [Node.js Ubuntu instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) and install Node.js:

```
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

Verify installation of Node.js and npm:

```
$ node -v
$ npm -v
```

You should have version 6 of Node.js installed, and version 3 of npm installed:

```
$ node -v
v6.9.5
$ npm -v
3.10.10
```

## Install MongoDB

MongoDB is the default database for NodeBB. As noted in the [MongoDB Support Policy](https://www.mongodb.com/support-policy) versions older than **3.x** are officially **End of Life** as of October 2016. This guide assumes installation of **3.2.x**. If [Redis](https://redis.io) or another database instead of MongoDB the [Configuring Databases](../../configuring/databases) section has more information.

Up to date detailed installation instructions can be found in the [MongoDB manual](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-ubuntu/). Although out of scope for this guide, some MongoDB production deployments leverage clustering, sharding and replication for high availibility and performance reasons. Please refer to the MongoDB [Replication](https://docs.mongodb.com/v3.2/replication/) and [Sharding](https://docs.mongodb.com/v3.2/sharding/) topics for further reading. Keep in mind that NodeBB does not require any of these advanced configurations, and doing so may complicate your installation. Keeping it simple is best.

Abbreviated instructions for installing MongoDB:

```
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
$ echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
$ sudo apt-get update && sudo apt-get install -y mongodb-org
```

Start the service and verify service status:

```
$ sudo service mongod start
$ sudo service mongod status
```

If everything has been installed correctly the service status should
show as `active (running)`.

## Configure MongoDB

General MongoDB administration is done through the MongoDB Shell `mongo`. A default installation of MongoDB listens on port `27017` and is accessible locally. Access the shell:

```
$ mongo
```

Switch to the built-in `admin` database:

```
> use admin
```

Create an administrative user (**not** the `nodebb` user). Replace the placeholders `<Enter a username>` and `<Enter a secure password>` with your own selected username and password. Be sure that the `<` and `>` are also not left behind.

```
> db.createUser( { user: "<Enter a username>", pwd: "<Enter a secure password>", roles: [ { role: "readWriteAnyDatabase", db: "admin" }, { role: "userAdminAnyDatabase", db: "admin" } ] } )
```

This user is scoped to the `admin` database to manage MongoDB once authorization has been enabled.

To initially create a database that doesn't exist simply `use` it. Add a
new database called `nodebb`:

```
> use nodebb
```

The database will be created and context switched to `nodebb`. Next create the nodebb user and add the appropriate privileges:

```
> db.createUser( { user: "nodebb", pwd: "<Enter a secure password>", roles: [ { role: "readWrite", db: "nodebb" }, { role: "clusterMonitor", db: "admin" } ] } )
```

The `readWrite` permission allows NodeBB to store and retrieve data from the `nodebb` database. The `clusterMonitor` permission provides NodeBB read-only access to query database server statistics which are then exposed in the NodeBB Administrative Control Panel (ACP).

Exit the Mongo Shell:

```
> quit()
```

Enable database authorization in the MongoDB configuration file `/etc/mongod.conf` by uncommenting the line `security` and enabling authorization:

```
security:
  authorization: enabled
```

Restart MongoDB and verify the administrative user created earlier can connect:

```
$ sudo service mongod restart
$ mongo -u your_username -p your_password --authenticationDatabase=admin
```

If everything is configured correctly the Mongo Shell will connect. Exit the shell.

## Install NodeBB

First, the remaining dependencies should be installed if not already
present:

```
$ sudo apt-get install -y git build-essential
```

Next, clone NodeBB into an appropriate location. Here the home directory is used, though any destination is fine:

```
$ git clone -b v1.5.x https://github.com/NodeBB/NodeBB.git $HOME/nodebb
```

This clones the NodeBB repository from the `v1.5.x` branch to your home directory. A list of alternative branches are available in the [NodeBB Branches](https://github.com/NodeBB/NodeBB/branches) GitHub page.

Obtain all of the dependencies required by NodeBB and initiate the setup script:

```
$ cd nodebb
$ npm install --production
$ ./nodebb setup
```

A series of questions will be prompt with defaults in parentheses. The default settings are for a local server listening on the default port `4567` with a MongoDB instance listening on port `27017`. When prompted be sure to configure the MongoDB username and password that was configured earlier for NodeBB. Once connectivity to the database is confirmed the setup will prompt that initial user setup is running. Since this is a fresh NodeBB install a forum administrator must be configured. Enter the desired administrator information. This will culminate in a `NodeBB Setup Completed.` message.

A configuration file [config.json](../../configuring/config) will be created in the root of the nodebb directory. This file can be modified should you need to make changes such as changing the database location or credentials used to access the database.

Finally, start NodeBB:

```
$ ./nodebb start
```

You can opt to set up NodeBB so that it starts up automatically on system boot. To do so, please see the options outlined in [Running NodeBB](../../configuring/running).