MongoDB
=======

If you're afraid of running out of memory by using Redis, or want your
forum to be more easily scalable, you can install NodeBB with MongoDB.
This tutorial assumes you know how to SSH into your server and have root
access.

**These instructions are for Ubuntu. Adjust them accordingly for your
distro.**

**Note:** If you have to add `sudo` to any command, do so. No one is
going to hold it against you ;)

Step 1: Install MongoDB
-----------------------

The latest and greatest MongoDB is required (or at least greater than
the package manager). The instructions to install it can be found on the
[MongoDB
manual](http://docs.mongodb.org/manual/administration/install-on-linux/)).

Step 2: Install node.js
-----------------------

Like MongoDB, the latest and greatest node.js is required (or at least
greater than the package manager), so I'm leaving this to the official
wiki. The instructions to install can be found on
[Joyent](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

**Note: NPM is installed along with node.js, so there is no need to
install it separately**

Step 3: Install the Base Software Stack
-------------------------

Enter the following into the terminal to install the base software
required to run NodeBB:

``` bash
# apt-get install git build-essential imagemagick
```

Step 4: Clone the Repository
-------------------------

Enter the following into the terminal, replacing
/path/to/nodebb/install/location to where you would like NodeBB to be
installed.

``` bash
$ cd /path/to/nodebb/install/location
$ git clone git://github.com/NodeBB/NodeBB.git nodebb
```

Step 5: Install The Required NodeBB Dependencies
-------------------------

Go into the newly created nodebb directory and install the required
dependencies by entering the following.

``` bash
$ cd nodebb
$ npm install
```

Step 6: Adding a New Database With Users
-------------------------

To go into the MongoDB command line, type:

``` bash
$ mongo
```

To add a new database called nodebb, type:

```
> use nodebb
```

To add a user to access the nodebb database, type:

For MongoDB 2.6.x and 3.2.x

```
> db.createUser( { user: "nodebb", pwd: "<Enter in a secure password>", roles: [ "readWrite" ] } )
```

If you want to be able to view database statistics in NodeBB's admin
control panel (Advanced → Database) type also this command:

```
> db.grantRolesToUser("nodebb",[{ role: "clusterMonitor", db: "admin" }]);
```

If you don't type the last command you will get this error message when
trying to see database statistics:

```
Internal Error.

Oops! Looks like something went wrong!

/api/admin/advanced/database

not authorized on nodebb to execute command { serverStatus: 1 }
```

For earlier versions of MongoDB (if the above throws an error)

```
> db.addUser( { user: "nodebb", pwd: "<Enter in a secure password>", roles: [ "readWrite" ] } )
```

**Note**: NodeBB requires MongoDB 2.6.0 or higher. The role `readWrite`
provides read or write any collection within a specific database to
user.

Step 7: Configure MongoDB
-------------------------

Modify `/etc/mongodb.conf`.

```
# nano /etc/mongodb.conf
```

To enable authentication, type:

For MongoDB 2.6.x

Uncomment `auth = true`.

For MongoDB 3.2.x

Uncomment `security:` and add `authorization: enabled` below it (and
don't forget to put two spaces before the second line). It should look
like this:

```
security:
  authorization: enabled
```

Restart MongoDB.

```
# service mongodb restart
```

Step 8: Configuring NodeBB 
-------------------------

Make sure you are in your NodeBB root folder. If not, just type:

```
$ cd /path/to/nodebb
```

To setup the app, type:

```
$ node app --setup
```

-   Change the hostname to your domain name.
-   Accept the defaults by pressing enter until it asks you what
    database you want to use. Type `mongo` in that field.
-   Accept the default port, unless you changed it in the
    previous steps.
-   Change your username to `nodebb`, unless you set it to
    another username.
-   Enter in the password you made in step 5.
-   Change the database to `nodebb`, unless you named it something else.

Continue with the installation, following the instructions the installer
provides you.

Step 9: Starting the App
------------------------

To start the app, run:

```
$ ./nodebb start
```

Now visit `yourdomainorip.com:4567` and your NodeBB installation should
be running.

NodeBB can also be started with helper programs, such as [supervisor or forever](../../running/index). You can also [use `nginx` as a reverse proxy](../../configuring/proxies).

Advanced Settings
===========

The mongodb nodejs driver has a default connection pool size of 5, if
you need to increase this just add a poolSize setting into your
config.json file under the mongo block.
