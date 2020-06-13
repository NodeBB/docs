Writing Plugins for NodeBB
==========================

So you want to write a plugin for NodeBB, that's fantastic! There are a
couple of things you need to know before starting that will help you
out.

Like WordPress, NodeBB's plugins are built on top of a hook system in
NodeBB. This system exposes parts of NodeBB to plugin creators in a
controlled way, and allows them to alter content while it passes
through, or execute certain behaviours when triggered.

See the full [list of
hooks](https://github.com/NodeBB/NodeBB/wiki/Hooks/) for more
information.

## Plugin Hooks

There are four types of hooks: **filters**, **actions**, **static**, and **response** hooks.

* Filters take an input (provided as a single argument), parse it in some way, and return the changed value.
* Actions take multiple inputs, and execute actions based on the inputs received. Actions do not return anything.
* Static hooks are similar to action hooks, except NodeBB will wait for the hook to complete (by calling its passed-in callback) before continuing.
* Response hooks are similar to action hooks, except that listeners are called one at a time, and ends prematurely if a response is sent to the client.

When you are writing your plugin, make sure a hook exists where you'd
like something to happen. If a hook isn't present, [file an
issue](https://github.com/NodeBB/NodeBB/issues) and we'll include it in
the next version of NodeBB.

For more information on hooks, please consult [the hooks page](./hooks).

## Configuration

Each plugin package contains a configuration file called `plugin.json`.
Here is a sample, keeping in mind that *not all options are required*:

``` json
{
    "id": "nodebb-plugin-myplugin",
    "url": "Absolute URL to your plugin or a Github repository",
    "library": "./my-plugin.js",
    "staticDirs": {
        "images": "public/images"
    },
    "less": [
        "assets/style.less"
    ],
    "hooks": [
        { "hook": "filter:post.save", "method": "filter" },
        { "hook": "action:post.save", "method": "emailme" }
    ],
    "scripts": [
        "public/src/client.js"
    ],
    "acpScripts": [
        "public/src/admin.js"
    ],
    "languages": "path/to/languages",
    "templates": "path/to/templates"
}
```

`id` is a unique identifier for your plugin. NodeBB will refer to your plugin by this id, and if published to npm, NodeBB will try to download the package with the same name as this id.

The `library` property is a relative path to the library in your
package. It is automatically loaded by NodeBB (if the plugin is
activated).

The `staticDirs` property is an object hash that maps out paths
(relative to your plugin's root) to a directory that NodeBB will expose
to the public at the route `/plugins/{YOUR-PLUGIN-ID}`.

* e.g. The `staticDirs` hash in the sample configuration maps `/path/to/your/plugin/public/images` to `/plugins/my-plugin/images`

The `less` property contains an array of paths (relative to your
plugin's directory), that will be precompiled into the CSS served by
NodeBB.

The `hooks` property is an array containing objects that tell NodeBB
which hooks are used by your plugin, and what method in your library to
invoke when that hook is called. Each object contains the following
properties (those with a \* are required):

* `hook`, the name of the NodeBB hook
* `method`, the method called in your plugin
* `priority`, the relative priority of the method when it is
    eventually called (default: 10)

The `scripts` property is an array containing files that will be
compiled into the minified javascript payload served to users.

The `acpScripts` property is similar to `scripts`, except these files
are compiled into the minified payload served in the Admin Control Panel
(ACP)

The `modules` property allows you to embed third-party AMD-style scripts into your plugin. For more information, see
[Using Third-Party Libraries](./libraries).

The `languages` property is optional, which allows you to set up your
own internationalization for your plugin (or theme). Set up a similar
directory structure as core, for example:
`language/en-GB/myplugin.json`.

The `templates` property is optional, and allows you to define a folder
that contains template files to be loaded into NodeBB. Set up a similar
directory structure as core, for example: `partials/topic/post.tpl`.

## Writing the plugin library

The core of your plugin is your library file, which gets automatically
included by NodeBB if your plugin is activated.

Each method you write into your library takes a certain number of
arguments, depending on how it is called:

* Filters send a single argument through to your method, while
    asynchronous methods can also accept a callback.
* Actions send a number of arguments (the exact number depends how the
    hook is implemented). These arguments are listed in
    the list of hooks &lt;hooks&gt;.

### Example library method

If we were to write method that listened for the `action:post.save`
hook, we'd add the following line to the `hooks` portion of our
`plugin.json` file:

``` json
{ "hook": "action:post.save", "method": "myMethod" }
```

Our library would be written like so:

``` js
var MyPlugin = {
        myMethod: function(postData) {
            // do something with postData here
        }
    };

module.exports = MyPlugin;
```

### Using NodeBB libraries to enhance your plugin

Occasionally, you may need to use NodeBB's libraries. For example, to
verify that a user exists, you would need to call the `exists` method in
the `User` class. To allow your plugin to access these NodeBB classes,
use `require.main.require`:

``` js
var User = require.main.require('./src/user');
User.exists('foobar', function(err, exists) {
    // ...
});
```

## Installing the plugin

In almost all cases, your plugin should be published in
[npm](https://npmjs.org/), and your package's name should be prefixed
"nodebb-plugin-". This will allow users to install plugins directly into
their instances by running `npm install`.

When installed via npm, your plugin **must** be prefixed with
"nodebb-plugin-", or else it will not be found by NodeBB.

### Listing your plugin in the NodeBB Package Manager (nbbpm)

All NodeBB's grab a list of downloadable plugins from the NodeBB Package
Manager, or nbbpm for short.

When you create your plugin and publish it to npm, it will be picked up
by nbbpm, although it will not show up in installs until you specify a
compatibility string in your plugin's `package.json`.

To add this data to `package.json`, create an object called `nbbpm`,
with a property called `compatibility`. This property's value is a
semver range of NodeBB versions that your plugin is compatible with.

You may not know which versions your plugin is compatible with, so it is
best to stick with the version range that your NodeBB is using. For
example, if you are developing a plugin against NodeBB v0.8.0, the
simplest compatibility string would be:

```
{
    ...
    "nbbpm": {
        "compatibility": "^0.8.0"
    }
}
```

To allow your plugin to be installed in multiple versions of NodeBB, use
this type of string:

```
{
    ...
    "nbbpm": {
        "compatibility": "^0.7.0 || ^0.8.0"
    }
}
```

Any valid semver string will work. You can confirm the validity of your
semver string at this website:
<http://jubianchi.github.io/semver-check/>

### Linking the plugin

To test the plugin before going through the process of publishing, try
linking the plugin into the node\_module folder of your instance.
<https://docs.npmjs.com/cli/link>

Using the terminal in the folder were you created your plugin,
`/plugins/my-plugin`.

```
npm link
```

Then in the source folder were nodebb is installed.

```
npm link my-plugin
```
You will then need to build nodebb:
```
./nodebb build
```

Your plugin should now be available in admin to be activated.

## Adding Custom Hooks

You can use the same hooks sytem that NodeBB uses for plugins to create
your own hooks that other plugins can hook into require the plugin
librray in your code var plugins = module.parent.require('./plugins');
and then use the plugins.fireHook command where ever you want them to
be.

With this code any plugins can do things to the postData variable by
hooking into the filter:myplugin.mymethod as they would a normall
function. Once the plugins are done you can continue to work on the
variable just as you normally would.

``` js
var Plugins = module.parent.require('./plugins');
var MyPlugin = {
        myMethod: function(postData) {
            // do something with postData here
            plugins.fireHook('filter:myplugin.mymethod', {postData : postData });
            // do more things with postData here
        }
    };
```

## Testing

Run NodeBB in development mode:

```
./nodebb dev
```

This will expose the plugin debug logs, allowing you to see if your
plugin is loaded, and its hooks registered. Activate your plugin from
the administration panel, and test it out.

## Disabling Plugins

You can disable plugins from the ACP, but if your forum is crashing due
to a broken plugin you can reset all plugins by executing

```
./nodebb reset -p
```

Alternatively, you can disable a single plugin by running

```
./nodebb reset -p nodebb-plugin-im-broken
```

or

```
./nodebb reset -p broken-plugin
```
