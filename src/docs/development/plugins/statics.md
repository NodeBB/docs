# Static Directories

NodeBB allows plugins to configure static directories, which will allow the direct access of files from the browser. This can be useful for serving up assets as part of your plugin; e.g.

> A NodeBB plugin allows users to earn trophies based on forum participation. These trophies are represented as PNG images that can be seen in their profile page.
>
> A static directory needs to be set up so that they can be linked to directly in a browser `<img>` tag.

## Security Considerations

A static directory when configured per below is not secured from public access. That lack of authentication means that any user (guest, bot, or otherwise) will be able to access files within the mounted directory, thus potentially exposing them to search engines, etc.

Be sure not to place private items in static directories unless they are protected behind another authentication mechanism (e.g. [Basic/Digest authentication via nginx](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/)).

Alternatively, instead of using a static directory, you can mount a controller to a route via the `static:api.routes` hook, do any checks and validation as necessary, and [use `res.sendFile`](http://expressjs.com/en/api.html#res.sendFile).

## Mounting a static directory

### In core

In core itself, NodeBB exposes two directories:

1. **`/build/public`** which is cleared and generated whenever `./nodebb build` is executed (do not use this)
1. **`/public`** which contains various assets used by NodeBB (default images, language files, etc.)
    * **`/public/uploads`** is the only directory here that is **not** version tracked, so it is recommended to add items here.

Both of these directories are served under the common prefix `/assets` (the former takes precedence over the latter.) For example, to load the default favicon located at `/public/favicon.ico`, you can browse to `/assets/favicon.ico` via the browser.

### via plugins

Plugins can define a static directory using the `staticDirs` property of [the `plugin.json` file](./plugin.json.md).

You can define an object literal containing a key-value map of directory names and their paths (relative to the plugin directory).

When plugins define static directories, they are all mounted behind the prefix `plugins/{YOUR-PLUGIN-ID}`.

Given the following:

* If NodeBB is installed at `/var/www/nodebb`, and
* It is reachable at `https://example.org`, and
* A plugin when installed would be found at `/var/www/nodebb/node_modules/nodebb-plugin-example`

You can define a static directory thusly:

``` json
{
	...
	"staticDirs": {
		"images": "images"
	}
	...
}
```

This configuration will instruct NodeBB to mount the path `/var/www/nodebb/node_modules/nodebb-plugin-example/images` onto `https://example.org/plugins/nodebb-plugin-example/images`, and all files inside can be directly accessed.