Running NodeBB
==============

The preferred way to start and stop NodeBB is by invoking its
executable:

* `./nodebb start` Starts the NodeBB server
* `./nodebb stop` Stops the NodeBB server
* Alternatively, you may use `npm start` and `npm stop` to do the same

However, NodeBB when started via `./nodebb start` will not automatically start up again when the system reboots. The methods listed below are alternatives to starting NodeBB via the
executable.

## systemd

Newer releases of Ubuntu use systemd to manage their services. The following is a systemd service example you can use:

```
[Unit]
Description=NodeBB
Documentation=https://docs.nodebb.org
After=system.slice multi-user.target

[Service]
Type=simple
User=myuser
WorkingDirectory=/path/to/nodebb
ExecStart=/path/to/nodebb/nodebb --no-silent --no-daemon
Restart=always

[Install]
WantedBy=multi-user.target
```

Replace your username (`myuser`) and the path to NodeBB as appropriate.

Save the file to `/etc/systemd/system/nodebb.service`. Start and stop NodeBB by doing the following:

```
$ systemctl start nodebb
$ systemctl stop nodebb
```

Note that we are passing `--no-silent` and `--no-daemon` to the executable. The former ensures that logging is sent to stdout (in which case you can view the log output by running `journalctl -u nodebb`), and the latter doesn't do any forking and runs in the main parent thread.

For more information on configuring systemd, please consult [the manpage for the systemd service](https://www.freedesktop.org/software/systemd/man/systemd.service.html).

## Upstart

Older versions of Ubuntu may utilise [Upstart](http://upstart.ubuntu.com/) to manage processes at boot. Upstart also handles restarts of scripts if/when they crash.

You can use Upstart to start/stop/restart your NodeBB.

Note: Prior to NodeBB v0.7.0, Upstart processes would not track the proper pid, meaning there was no way to stop the NodeBB process. NodeBB v0.7.0 includes some changes that allow Upstart to control NodeBB more effectively.

You can utilise this Upstart configuration as a template to manage your NodeBB:

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

## Supervisor Process

Using the [supervisor
package](https://github.com/isaacs/node-supervisor), you can have NodeBB
restart itself if it crashes:

``` bash
$ npm install -g supervisor
$ supervisor app
```

As `supervisor` by default continues to pipe output to `stdout`, it is
best suited to development builds.

## Forever Daemon

Another way to keep NodeBB up is to use the [forever
package](https://github.com/nodejitsu/forever) via the command line
interface, which can monitor NodeBB and re-launch it if necessary:

``` bash
$ npm install -g forever
$ forever start app.js
```
