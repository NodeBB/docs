Running NodeBB
==============

The preferred way to start and stop NodeBB is by invoking its
executable:

* `./nodebb start` Starts the NodeBB server
* `./nodebb stop` Stops the NodeBB server
* Alternatively, you may use `npm start` and `npm stop` to do the same

The methods listed below are alternatives to starting NodeBB via the
executable.

Upstart
-------

Later version of Ubuntu may utilise
[Upstart](http://upstart.ubuntu.com/) to manage processes at boot.
Upstart also handles restarts of scripts if/when they crash.

You can use Upstart to start/stop/restart your NodeBB.

Note: Prior to NodeBB v0.7.0, Upstart processes would not track the
proper pid, meaning there was no way to stop the NodeBB process. NodeBB
v0.7.0 includes some changes that allow Upstart to control NodeBB more
effectively.

You can utilise this Upstart configuration as a template to manage your
NodeBB:

```
start on startup
stop on runlevel [016]
respawn
setuid someuser
setgid someuser
script
    cd /path/to/nodebb
    node loader.js --no-silent --no-daemon
end script
```

From there, you can start stop and restart NodeBB as the root user:
`start nodebb`, `stop nodebb`, `restart nodebb`, assuming `nodebb.conf`
is the name of the Upstart config file.

Simple Node.js Process
----------------------

To start NodeBB, run it with `node` (some distributions use the
executable `nodejs`, please adjust accordingly):

``` bash
$ cd /path/to/nodebb/install
$ node app
```

However, bear in mind that crashes will cause the NodeBB process to
halt, bringing down your forum. Consider some of the more reliable
options, below:

Supervisor Process
------------------

Using the [supervisor
package](https://github.com/isaacs/node-supervisor), you can have NodeBB
restart itself if it crashes:

``` bash
$ npm install -g supervisor
$ supervisor app
```

As `supervisor` by default continues to pipe output to `stdout`, it is
best suited to development builds.

Forever Daemon
--------------

Another way to keep NodeBB up is to use the [forever
package](https://github.com/nodejitsu/forever) via the command line
interface, which can monitor NodeBB and re-launch it if necessary:

``` bash
$ npm install -g forever
$ forever start app.js
```

Grunt Development
-----------------

We can utilize grunt to launch NodeBB and re-compile assets when files
are changed. Start up speed is increased because we don't compile assets
that weren't modified.

Installing Grunt

``` bash
$ npm install -g grunt-cli
```

Run grunt to start up NodeBB and watch for code changes.

``` bash
$ grunt
```
