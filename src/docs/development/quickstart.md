# Quickstart plugin

The [Quickstart plugin](https://github.com/nodebb/nodebb-plugin-quickstart) is a plugin skeleton that was created by the NodeBB team to serve as a fully-featured base to launch off from when creating custom plugins.

It contains a minimal set of functionality, along with all of the necessary boiletplate to allow NodeBB to recognize it as a plugin.

# Breakdown

Cloning the repository and inspecing the files themselves can be overwhelming, so this guide has been created to guide you through the various aspects of the plugin.

## `plugin.json`

&rarr; [View this file in GitHub](https://github.com/NodeBB/nodebb-plugin-quickstart/blob/master/plugin.json)

Our first stop is is the `plugin.json` file, this plugin's main configuration area. NodeBB looks at this file to determine the plugin's name, hook listeners, and files.

[Click here for a more detailed look at the file format and options](../plugins/plugin.json)

`plugin.json` has an option called `library`, which is defined as `library.js`, let's look at that next.

## `library.js`

&rarr; [View this file in GitHub](https://github.com/NodeBB/nodebb-plugin-quickstart/blob/master/library.js)

The main bulk of the code is contained here, although additional logic is separated out into additional files in `lib/` (e.g. `lib/controllers.js`.)

Each hook that is defined in `plugin.json` is mapped to an exported method in this file.

For example, the `static:app.load` hook defined in `plugin.json` points to the `init` method. Whenever NodeBB starts, that hook is called, and by extension, this listener is called as well.

In this particular hook, we set up some routes and mount them to the express router.

You can discover additional hooks by inspecting the NodeBB database, or by [viewing the continually updated list of hooks](https://github.com/NodeBB/NodeBB/wiki/Hooks).

For more information on [plugin hooks, click here](../plugins/hooks).

## Client-side logic

The previous section detailed how a new route is created and mounted to the express router, but how would we define custom client-side logic?

NodeBB uses [require.js](https://requirejs.org) to dynamically load modules on a page-by-page basis.

The quickstart plugin mounted a route for the admin settings page, at `/admin/plugins/quickstart`. Inspecting the controller (found in `lib/controllers.js`) tells us that it attempts to load the template "`admin/plugins/quickstart`". This designation is important, as it tells us how NodeBB will look for the associated client-side module.

No matter the mount point, NodeBB will attempt to `require` a client-side library based on the template name. In this case, navigating to the admin settings page will cause NodeBB to call `require('admin/plugins/quickstart')` and execute the `.init()` method, if one is available. Otherwise, it will do nothing.

**Note**: Mounted pages that are **not** in the admin namespace are prefixed `forum/`. For example, if you have a mounted page `/foobar` that loads template `views/foobar`, NodeBB will attempt to call `require('forum/views/foobar')`.

We can define a require.js module to NodeBB and specify its name, so that it is loaded when called directly.

&rarr; [View this file in GitHub](https://github.com/NodeBB/nodebb-plugin-quickstart/blob/master/static/lib/admin.js) (`static/lib/admin.js`)

This file starts off with a call to `define` with the module name (as discussed earlier) passed-in as the first argument.

NodeBB looks for an exported `.init()` method, and executes it if found.

There are two ways this file can be exposed to NodeBB:

1. It can be added to the `scripts` or `acpScripts` array in `plugin.json`, or
1. It can be defined as a custom module in the `modules` section of `plugin.json`

## Styling

Styling is defined as a set of LESS files exposed to NodeBB via the `less` array property in `plugin.json`. You can define and organize your LESS files as you wish.