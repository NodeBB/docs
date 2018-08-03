Arch Linux
==========

First, we install our base software stack. Be sure to `pacman -Syu` first
to make sure you've synced with the repositories and all other packages
are up to date.

```
$ sudo pacman -S git nodejs npm redis imagemagick icu
```

If you want to use MongoDB, LevelDB, or another database instead of
Redis please look at the
[Configuring Databases](../../configuration/databases) section.

Next, clone this repository:

```
$ git clone -b v1.10.x https://github.com/NodeBB/NodeBB.git nodebb
$ cd nodebb
```

Initiate the setup script by running the app with the `setup` flag:

```
$ ./nodebb setup
```

The default settings are for a local server running on the default port,
with a redis store on the same machine/port.

Lastly, we run the forum.

```
$ ./nodebb start
```

NodeBB can also be started with helper programs, such as `supervisor`
and `forever`.
Take a look at the options [here](../../running/index).
