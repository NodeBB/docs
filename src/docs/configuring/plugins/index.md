# Plugins

NodeBB itself is designed to be lean, with a minimal feature set of core functionality that most (if not all) users will find useful. Additional esoteric features and behavioural changes may be added via the use of third-party plugins.

Plugins themselves are hosted on npm, and are created by third-party developers and in some cases, the NodeBB developers themselves.

## Installing Plugins

You are encouraged to install plugins that appear in the admin control panel, as those are plugins that have been cleared for installation with the current version of NodeBB you have installed. You can access this menu by navigating to "Extend -> Plugins" from the Administrative Control Panel, in order to browse the list of supported plugins.

Plugins that are publicly hosted but do not appear in this list may not be compatible, but can still be installed via the command line:

```
$ npm install nodebb-plugin-someplugin
```

However, we do not recommend doing so as incompatiblities may result in the crashing of your NodeBB forum. If this occurs, you'll want to deactivate the plugin:

```
$ ./nodebb reset -p nodebb-plugin-someplugin
```