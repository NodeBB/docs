# macOS

## Required Software

First, install the following programs:

-   <http://nodejs.org/>
-   <http://brew.sh/>

## Installing NodeBB

### With mongoDB

The following is an abbreviation of [the official MongoDB installation guide for macOS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/#using-the-mongodb-database-tools). If you're having issues, fall back to using that guide instead.

Homebrew requires the Xcode command-line tools from Apple's Xcode.

Install the Xcode command-line tools by running the following command in your macOS Terminal:
```
xcode-select --install
```

Install mongoDB with homebrew by entering the following commands into terminal:

```
brew tap mongodb/brew
```

```
brew update
```

```
brew install mongodb-community@7.0
```

Verify installation of MongoDB. You should have version 7.0:
```
mongod --version
```
Start mongodb server, in your terminal enter:

```
brew services start mongodb-community@7.0
```

### Configure MongoDB

General MongoDB administration is done through the MongoDB Shell `mongo`. A default installation of MongoDB listens on port `27017` and is accessible locally. Access the shell:

```
mongosh
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
(Hint: To find that file, navigate to root folder in Finder and enter `shift` + `cmd` + `.`. This reveals, hidden system folders and `/usr` should appear.)

Restart MongoDB and verify the administrative user created earlier can connect:

```
brew services restart mongodb/brew/mongodb-community@7.0
mongosh "mongodb://localhost:27017" --username admin --authenticationDatabase admin

```

If everything is configured correctly the Mongo Shell will connect. Exit the shell.


### Or with redis server 

Install redis with homebrew:

```
brew install redis
```

Start redis server, in your terminal enter:

```
redis-server
```

### Installing NodeBB
After you've installed MongoDB, we can continue with NodeBB. Clone NodeBB into an appropriate location.
Here the local nodebb directory is used, though any destination is fine:

```sh
git clone -b v3.x https://github.com/NodeBB/NodeBB.git nodebb
cd nodebb
```

This clones the NodeBB repository from the v3.x branch to the nodebb directory. A list of alternative branches are
available in the [NodeBB Branches](https://github.com/NodeBB/NodeBB/branches) GitHub page, but only the versioned branches are stable.

NodeBB ships with a command line utility which allows for several functions. We'll first use it to setup NodeBB.
This will install modules from npm and then enter the setup utilty.

```sh
./nodebb setup
```
**If you setup with mongodb:**

A series of questions will be prompted with defaults in parentheses. The default settings are for a local server listening
on the default port `4567` with a MongoDB instance listening on port `27017`. When prompted for the mongodb username and password,
enter `nodebb`, and the password that you configured earlier. Once connectivity to the database is confirmed the setup will prompt
that initial user setup is running. Since this is a fresh NodeBB install a forum administrator must be configured.
Enter the desired administrator information. This will culminate in a _NodeBB Setup Completed_ message.

**If you setup with redis server:**

You may leave all of the options as default, except "Which database to
use (mongo)", which you should answer with "redis". Once connectivity to the database is confirmed the setup will prompt
that initial user setup is running. Since this is a fresh NodeBB install a forum administrator must be configured.
Enter the desired administrator information. This will culminate in a _NodeBB Setup Completed_ message.

Finally, you can use the cli utility to start NodeBB:

```sh
./nodebb start
```

You can visit your forum at `http://localhost:4567/`
