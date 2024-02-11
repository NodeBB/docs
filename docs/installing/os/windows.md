Windows
=========
> This article supports windows 7 / 8.1 / 10 and windows server 2012/2016.Because the old version of the system may be a security risk, we do not recommend in less than these versions of the system in the following operations.

Preparation
-----------------

First,We install `chocolatey`.(It's a good packages manager for Windows.)
**Before installing, you should check:**
* system : Windows 7+ / Windows Server 2003+
* PowerShell v2+
* .NET Framework 4+ (the installation will attempt to install .NET 4.0 if you do not have it installed)
> If your Powershell version is less than 2, please [click here](https://www.microsoft.com/en-US/download/details.aspx?id=40855) to update your version.
Running NodeBB

Then,open an PowerShell window(administrative),run the scripts behind:
```
Set-ExecutionPolicy AllSigned; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```
If you don't see any errors, you are ready to use Chocolatey! Type `choco` or `choco -?` now. 

Installation
--------------

First,open a PowerShell window(administrative).Run the scripts behind to install **Required Softwares**:
```
#Use administrative shell
choco install -y imagemagick git github python2 nodejs-lts
choco install -y mongodb #use Mongodb as database?
choco install -y redis-64 #use redis as database? 
#if you use a x86 os,please use `cinst -y redis` instead. 
choco install nginx #need use nginx as proxy?
```
> Depending on your needs, execute different scripts.
If you do not see anything wrong, then we start configuring the database section.

Configure your databases
------------

> **Sorry, I am here in the test to redis configured for windows service error, so I can only provide you with the guidance of Mongodb.**
1. Find Mongodb bin directory, and then add it to the system environment variable path. (Maybe your mongodb will be here: `C:\Program Files\MongoDB\Server\3.4\bin`)

2. Whether the test is effective: `mongo --version`
3. Create two new folders in the Mongodb directory（e.g `C:\Program Files\MongoDB\Server\3.4\data` and `C:\Program Files\MongoDB\Server\3.4\logs`,）
4. Type these in shell:
```
mongod --dbpath 'C:\Program Files\MongoDB\Server\3.4\data' --logpath 'C:\Program Files\MongoDB\Server\3.4\logs\mongodb.log' --install
```
5. Press `CTRL`+ `R` and type `services.msc`. Find Mongodb in the open window and start it
6. Add a user for NodeBB.
General MongoDB administration is done through the MongoDB Shell mongo. A default installation of MongoDB listens on port 27017 and is accessible locally. Access the shell:
```
#use PowerShell
mongo
```
Switch to the built-in `admin` database:
```
> use admin
```
Create an administrative user (**not** the `nodebb` user). Replace the placeholders `<Enter a username>` and `<Enter a secure password>` with your own selected username and password. Be sure that the < and > are also not left behind.
```
> db.createUser( { user: "<Enter a username>", pwd: "<Enter a secure password>", roles: [ { role: "readWriteAnyDatabase", db: "admin" }, { role: "userAdminAnyDatabase", db: "admin" } ] } )
```
This user is scoped to the `admin` database to manage MongoDB once authorization has been enabled.

To initially create a database that doesn't exist simply `use` it. Add a new database called `nodebb`:
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
6. Let Mongodb enable authentication
Press Ctrl + R and type regedit. After that, press Enter.

Find `ImagePath` in `[HKEY_LOCAL_MACHINE -> SYSTEM -> CurrentControlSet -> Services -> MongoDB]`, after its key value is added `--auth`.

Press `CTRL`+ `R` and type `services.msc`.Restart your MongoDB.
Verify the administrative user created earlier can connect:
```
mongo -u your_username -p your_password --authenticationDatabase=admin
```
If everything is configured correctly the Mongo Shell will connect. Exit the shell.

Install NodeBB
----------------

Open Git Shell, and type the following commands. Clone NodeBB repo:

```
git clone -b v1.5.x https://github.com/NodeBB/NodeBB.git
```

Enter directory:

```
cd NodeBB
```

Install dependencies:

```
npm install
```

Run interactive installation:

```
node app.js --setup
```

You may leave all of the options as default.

And you're done! After the installation, run

```
node app.js
```

and leave the window open.

You can visit your forum at `http://127.0.0.1:4567/`

Developing on Windows
---------------------

It's a bit of a pain to shutdown and restart NodeBB everytime you make
changes. First install supervisor:

```
npm install -g supervisor
```

Open up bash:

```
bash
```

And run NodeBB on "watch" mode:

```
./nodebb watch
```

It will launch NodeBB in development mode, and watch files that change
and automatically restart your forum.
