# `plugin.json`

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
    "upgrades": [
        "upgrades/your_upgrade_script.js"
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

The `upgrades` array is optional, useful for seamlessly updating your plugin's database
schema via NodeBB's upgrade system. Have a look at this example in NodeBB's [dbsearch plugin](https://github.com/barisusakli/nodebb-plugin-dbsearch/blob/master/upgrades/dbsearch_change_mongodb_schema.js) for further details.

The `languages` property is optional, which allows you to set up your
own internationalization for your plugin (or theme). Set up a similar
directory structure as core, for example:
`language/en-GB/myplugin.json`.

The `templates` property is optional, and allows you to define a folder
that contains template files to be loaded into NodeBB. Set up a similar
directory structure as core, for example: `partials/topic/post.tpl`.