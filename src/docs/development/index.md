# Getting Started

We try to make working with NodeBB as seamless and open-ended as possible.

NodeBB uses [benchpress](https://github.com/benchpressjs/benchpressjs) as its templating engine, [express](https://expressjs.org) on the backend to serve pages, and [webpack](https://webpack.js.org/) to bundle client side javascript. Of course, there are other dependencies, but these are the main ones that concern plugin developers.

The easiest way to get started is by looking at the [Quickstart plugin](https://github.com/nodebb/nodebb-plugin-quickstart). This is a template repository, meaning you are not meant to install it on a NodeBB installation, but rather should fork it to serve as a base for your own plugin.

Take a look at our [Quickstart plugin breakdown](./quickstart) for more details.

## Accessing page data

Each page in NodeBB is rendered using json data. You can view this data by prepending `/api` to the url. For example if you are on the `/recent` page you can navigate to `/api/recent` to see the corresponding json data. When NodeBB is started in production mode the json output will not have any formatting so it will be hard to read, to prettify it you can add ?pretty=1 to the url.

## Asset building

NodeBB requires a build step before it can run and serve pages to end users. This build process can be
manually invoked by running `./nodebb build`. However, as the build process itself can take a long time
depending on your particular computer specifications, there are other strategies to optimize the
development process. The same strategies can be used if you are developing plugins and themes.

## Selective building of assets

If you only need to build a specific part of NodeBB, `./nodebb build` can take space-separated arguments
to limit its scope.

For example, if you are making changes to your plugin's administrative pages, you can elect to build:

    ./nodebb build adminjs admincss tpl

... which would build only the ACP javascript, ACP stylesheets, and templates.

The full list is can be found [in the codebase itself](https://github.com/nodebb/nodebb-theme-persona).

## grunt

For optimized development, the NodeBB team (and many of the plugin authors) use [Grunt](https://gruntjs.com/)
as part of their workflow. The pre-requisite dependencies are installed with NodeBB during the `npm install`
step, although you may need to install `grunt-cli` (or your distribution's appropriate package for grunt)
to allow `grunt` to be called via the command line.

Once installed, you can simply run `grunt` to build all assets and run NodeBB. Grunt will also watch for
file changes and selectively build a subset of NodeBB's assets so there is no need to hop back to the
console to stop NodeBB, build, and restart NodeBB.

Alternatively, you can run `grunt --skip`, which skips the build step and simply runs NodeBB with file
watching enabled.

## Testing

In order to run tests on NodeBB, add the following block to your `config.json` file:

```
"test_database": {
    "host": "127.0.0.1",
    "port": "27017",
    "username": "",
    "password": "",
    "database": "test"
}
```

Run the whole suite of tests via `npm test` or an individual file via `npx mocha test/your_test_file.js`.

If you need to activate a certain plugin for testing as well, add the following block to your `config.json` file:

```
"test_plugins": [
   "nodebb-plugin-xyz"
]
```

