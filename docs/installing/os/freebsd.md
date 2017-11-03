FreeBSD
=======

This guide is for FreeBSD 10.1-RELEASE. It should work, with slight
modifications, for all other relatively modern versions.

Make sure you are up to date, by running:

```
freebsd-update fetch
freebsd-update install
```

Install Redis:

```
pkg install redis
```

Follow the regular steps to run Redis at the runlevel, and start it.

Install gcc5:

```
pkg install gcc5
```

Install Node:

```
pkg install node
```

Clone NodeBB repo (this assumes you have git installed, otherwise use
pkg to install it):

```
git clone -b v1.6.x https://github.com/NodeBB/NodeBB.git
```

Enter directory:

```
cd nodebb
```

Run interactive installation:

```
./nodebb setup
```

You may leave all of the options as default.

You are finished! After the installation, run:

```
./nodebb start
```

Visit your forum at `http://FQDN:4567/` to finish configuration and
setup. FQDN is the server fully qualified domain name.
