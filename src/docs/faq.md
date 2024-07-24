Need Help?
==========

Frequently Asked Questions
--------------------------

If you experience difficulties setting up a NodeBB instance, perhaps one
of the following may help.

### How do I start/stop/restart NodeBB?

You can call the `./nodebb` executable to start and stop NodeBB:

``` bash
$ ./nodebb
Usage: ./nodebb [options] [command]

Welcome to NodeBB

Options:
  -V, --version                                       output the version number
  --json-logging                                      Output to logs in JSON format (default: false)
  --log-level <level>                                 Default logging level to use (default: "info")
  --config <value>                                    Specify a config file (default: "config.json")
  -d, --dev                                           Development mode, including verbose logging (default: false)
  -l, --log                                           Log subprocess output to console (default: false)
  -h, --help                                          display help for command

Commands:
  start                           Start the NodeBB server
  stop                            Stop the NodeBB server
  restart                         Restart the NodeBB server
  status                          Check the running status of the NodeBB server
  log                             Open the output log (useful for debugging)
  setup [options] [config]        Run the NodeBB setup script, or setup with an initial config
  install                         Launch the NodeBB web installer for configuration setup
  build [options] [targets...]    Compile static assets (JS, CSS, templates, languages)
  activate [plugin]               Activate a plugin for the next startup of NodeBB (nodebb-plugin- prefix is optional)
  plugins                         List all installed plugins
  events [count]                  Outputs the most recent administrative events recorded by NodeBB
  info                            Outputs various system info
  reset [options]                 Reset plugins, themes, settings, etc
  user [command]                  Manage users
  upgrade [options] [scripts...]  Run NodeBB upgrade scripts and ensure packages are up-to-date, or run a particular upgrade script
  help [command]                  Display help for [command]
```

### How do I upgrade my NodeBB to a newer version?

Please consult [Upgrading NodeBB](../configuring/upgrade)

### I upgraded NodeBB and now X isn't working properly!

Please consult [Upgrading NodeBB](../configuring/upgrade)

### I installed an incompatible plugin, and now my forum won't start!

If you know which plugin caused problems, disable it by running:
`./nodebb reset -p nodebb-plugin-pluginName`

Otherwise, disable all plugins by running: `./nodebb reset -p`

### I'm getting an "npm ERR!" error

For the most part, errors involving `npm` are due to Node.js being
outdated. If you see an error similar to this one while running
`npm install`:

``` bash
npm ERR! Unsupported
npm ERR! Not compatible with your version of node/npm: connect@2.7.11
```

You'll need to update your Node.js version to 4 or higher.

To do this on Ubuntu:

``` bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_4.x | bash -
apt-get install -y nodejs
```

If successful, running the following command should show a version
higher than 0.8

``` bash
# apt-cache policy nodejs
```

### URLs on my NodeBB (or emails) still have the port number in them!

If you are using [nginx](../configuring/proxies/nginx) or
[Apache](../configuring/proxies/apache) as a reverse proxy, you
don't need the port to be shown. Simply run ./nodebb setup and specify
the base URL without a port number.

Alternatively, edit the `config.json` file using your favourite text
editor and change `use_port` to `false`.

### The "Recently Logged In IPs" section only shows 127.0.0.1

NodeBBs running behind a proxy may have difficulties determining the
original IP address that requests come from. It is important that the
proxy server provides the referral IP header.

In nginx, ensure that the following line is present in your `server`
block:

``` nginx
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

In addition, ensure that the `use_port` option is set to `false` in your
NodeBB's `config.json`

Submit Bugs on our Issue Tracker
--------------------------------

Before reporting bugs, please ensure that the issue has not already been
filed on our
[tracker](https://github.com/NodeBB/NodeBB/issues?state=closed), or has
already been resolved on our [support
forum](http://community.nodebb.org/category/6/bug-reports). If it has
not been filed, feel free to create an account on GitHub and [create a
new issue](https://github.com/NodeBB/NodeBB/issues).

Ask the NodeBB Community
------------------------

Having trouble installing NodeBB? Or did something break? Don't hesitate
to [join our forum](https://community.nodebb.org/register) and ask for help.
Hopefully one day you'll be able to help others too :)
