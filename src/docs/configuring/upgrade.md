Upgrading NodeBB
================

NodeBB's periodic releases are located in the
[Releases](https://github.com/NodeBB/NodeBB/releases). These releases
contain what is usually considered the most bug-free code, and is
designed to be used on production-level instances of NodeBB.

You can utilise git to install a specific version of NodeBB, and upgrade
periodically as new releases are made.

To obtain the latest fixes and features, you can also `git clone` the
latest version directly from the repository (`master` branch), although
its stability cannot be guaranteed. Core developers will attempt to
ensure that every commit results in a working client, even if individual
features may not be 100% complete.

***As always***, the NodeBB team is not responsible for any
misadventures, loss of data, data corruption, or any other bad things
that may arise due to a botched upgrade - so please **don't forget to
back up** before beginning!

## Upgrade Path

NodeBB's upgrade path is designed so that upgrading between versions is straightforward.

## Upgrade Steps

### 1. Shut down your forum

While it is possible to upgrade NodeBB while it is running, it is
definitely not recommended, particularly if it is an active forum:

``` bash
$ cd /path/to/nodebb
$ ./nodebb stop
```

### 2. Back up your data

#### Backing up Redis

As with all upgrades, the first step is to **back up your data**! Nobody
likes database corruption/misplacement.

All of the textual data stored in NodeBB is found in a `.rdb` file. On
typical installs of Redis, the main database is found at
`/var/lib/redis/dump.rdb`.

**Store this file somewhere safe.**

#### Backing up MongoDB

To run a backup of your complete MongoDB you can simply run

> mongodump

which will create a directory structure that can be restored with the
mongorestore command.

It is recommended that you first shut down your database. On Debian /
Ubuntu it's likely to be: sudo service mongodb stop

**Store this file somewhere safe.**

#### Uploads

Uploaded images and files are stored in /public/uploads. Feel free to
back up this folder too:

``` bash
cd /path/to/nodebb/public
tar -czf ~/nodebb_assets.tar.gz ./uploads
```

### 3. Grab the latest and greatest code

Before upgrading NodeBB make sure you have the required nodejs version. NodeBB supports the latest stable versions of nodejs. (v16, etc.) To upgrade nodejs run

``` bash
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Navigate to your NodeBB: `$ cd /path/to/nodebb`.

There are multiple ways NodeBB can be installed. You could either be on the main branch (`master`), a release branch (e.g. `v2.x`), or using archived downloads of NodeBB.

Don't know what branch you are on? Execute
`git rev-parse --abbrev-ref HEAD` to find out.

#### via main branch

``` bash
$ git fetch    # Grab the latest code from the NodeBB repository
$ git reset --hard v2.2.5    # Replace this with the version you want to upgrade to
```

This should retrieve the latest (and greatest) version of NodeBB from
the repository.

#### via release branches

If you are upgrading from a lower branch to a higher branch, switch
branches as necessary. ***Make sure you are completely up-to-date on
your current branch!***.

For example, if upgrading from `v1.19.8` to `v2.2.5`:

``` bash
$ git fetch    # Grab the latest code from the NodeBB repository
$ git checkout v2.x    # Switch to the v2.x branch since we are now upgrading to NodeBB version 2
$ git reset --hard origin/v2.x
```

If not upgrading between branches (e.g. `v2.2.4` to `v2.2.5`), just run
the following commands:

``` bash
$ git fetch
$ git reset --hard origin/v2.x
```

This should retrieve the latest (and greatest) version of NodeBB from the repository.

#### via archived release

Alternatively, download and extract the latest versioned copy of the code from [the Releases Page](https://github.com/NodeBB/NodeBB/releases).
Overwrite any files as necessary. This method is not supported.

### 4. Run the NodeBB upgrade script

This script will install any missing dependencies, upgrade any plugins or themes (if an upgrade is available), and migrate the database if necessary.

``` bash
$ ./nodebb upgrade
```

### 5. Start up NodeBB & Test!

``` bash
$ ./nodebb start -l
```

You should now be running the latest version of NodeBB.
