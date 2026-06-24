# Adding Routes

Beyond hooking into existing pages, a plugin can register its own routes: HTML
**pages** rendered with a template, and JSON **REST API** endpoints consumed by
client-side scripts. NodeBB provides a small set of route helpers so that your
routes pick up the same middleware, CSRF protection, and response formatting that
core uses.

```js
const routeHelpers = require.main.require('./src/routes/helpers');
```

## Page routes

Register page routes from a method attached to the `static:app.load` hook. The hook
payload exposes the application `router` and the `middleware` object.

**plugin.json**

```json
{ "hook": "static:app.load", "method": "init" }
```

**library.js**

```js
plugin.init = async ({ router, middleware }) => {
    // A public-facing forum page, rendered from templates/myplugin/page.tpl
    routeHelpers.setupPageRoute(router, '/myplugin/page', [middleware.ensureLoggedIn], (req, res) => {
        res.render('myplugin/page', { title: '[[myplugin:page.title]]' });
    });

    // An Admin Control Panel page, rendered from templates/admin/plugins/myplugin.tpl
    routeHelpers.setupAdminPageRoute(router, '/admin/plugins/myplugin', (req, res) => {
        res.render('admin/plugins/myplugin', { title: 'My Plugin' });
    });
};
```

* `setupPageRoute(router, path, middlewares, controller)` mounts a forum page. The
  `middlewares` array is optional; common entries are `middleware.ensureLoggedIn`
  and `middleware.admin.buildHeader`.
* `setupAdminPageRoute(router, path, controller)` mounts an ACP page. The admin
  header is built for you, so no middleware array is required.

To add a link to your ACP page in the admin sidebar, listen to
`filter:admin.header.build`:

```js
plugin.addAdminNavigation = (header) => {
    header.plugins.push({ route: '/plugins/myplugin', icon: 'fa-cog', name: 'My Plugin' });
    return header;
};
```

## REST API routes

Register API routes from a method attached to the `static:api.routes` hook. The
payload exposes `{ router, middleware, helpers }`.

**plugin.json**

```json
{ "hook": "static:api.routes", "method": "addRoutes" }
```

**library.js**

```js
plugin.addRoutes = async ({ router, middleware, helpers }) => {
    routeHelpers.setupApiRoute(router, 'get', '/myplugin/:id', [middleware.ensureLoggedIn], async (req, res) => {
        const data = await getThing(req.params.id);
        helpers.formatApiResponse(200, res, { data });
    });

    routeHelpers.setupApiRoute(router, 'post', '/myplugin/:id', [middleware.ensureLoggedIn], async (req, res) => {
        if (!req.body.content) {
            return helpers.formatApiResponse(400, res, new Error('[[error:invalid-data]]'));
        }
        const thing = await createThing(req.params.id, req.body.content);
        helpers.formatApiResponse(200, res, { thing });
    });
};
```

`setupApiRoute(router, method, path, middlewares, controller)` registers a route
where `method` is one of `get`, `post`, `put`, or `delete`.

### The public URL of an API route

This is the detail most often misunderstood. The `router` you receive in
`static:api.routes` is mounted under **`/api/v3/plugins`**. So a route you register
as `/myplugin/:id` is served at:

```
/api/v3/plugins/myplugin/:id
```

You register paths **relative to `/api/v3/plugins`** (i.e. starting with your own
route segment), not relative to the site root.

### Calling the route from a client script

Use the `api` client library. Its `get`/`post`/`put`/`del` methods automatically
prefix `/api/v3`, so you call your route as `/plugins/myplugin/:id`:

```js
require(['api'], function (api) {
    // GET  /api/v3/plugins/myplugin/42
    api.get('/plugins/myplugin/42', {}, function (err, data) { /* ... */ });

    // POST /api/v3/plugins/myplugin/42
    api.post('/plugins/myplugin/42', { content: 'hello' }, function (err, data) { /* ... */ });

    // DELETE is api.del(...)
    api.del('/plugins/myplugin/42', {}, function (err) { /* ... */ });
});
```

In short: a server route `'/myplugin/:id'` ⇄ a client call `'/plugins/myplugin/:id'`.

### Formatting responses

Always respond through `helpers.formatApiResponse` (from
`require.main.require('./src/controllers/helpers')`, also passed into the hook). It
emits the envelope NodeBB's client expects and handles errors consistently. Pass an
`Error` whose message is a [translation key](../i18n.md) to return a failure:

```js
helpers.formatApiResponse(200, res, { ok: true });
helpers.formatApiResponse(400, res, new Error('[[error:invalid-data]]'));
helpers.formatApiResponse(403, res, new Error('[[error:no-privileges]]'));
```

### Route ordering

Routes are matched in the order they are registered, so register **specific** and
**static** paths before **parameterised** ones. Otherwise a parameter route will
capture requests intended for the more specific route:

```js
// Correct: specific and static routes first…
routeHelpers.setupApiRoute(router, 'get', '/myplugin/:id/children', mw, childrenHandler);
routeHelpers.setupApiRoute(router, 'get', '/myplugin/search', mw, searchHandler);
// …parameterised route last
routeHelpers.setupApiRoute(router, 'get', '/myplugin/:id', mw, getHandler);
```

If `/myplugin/:id` were registered first, a request to `/myplugin/search` would match
it with `id = "search"`.

### Guarding routes with custom middleware

`middlewares` accepts any Express-style middleware, including your own async
function. A common pattern is an authorization gate that responds via
`formatApiResponse` when access is denied:

```js
const ensurePrivileged = async (req, res, next) => {
    if (!(await canAccess(req.uid))) {
        return helpers.formatApiResponse(403, res, new Error('[[error:no-privileges]]'));
    }
    next();
};

routeHelpers.setupApiRoute(router, 'post', '/myplugin/:id', [middleware.ensureLoggedIn, ensurePrivileged], handler);
```

## Serving a file instead of JSON

If you need to stream a file from a route (for access-controlled downloads, for
example) rather than expose it through a [static directory](./statics.md), mount a
controller as above and use [`res.sendFile`](http://expressjs.com/en/api.html#res.sendFile)
after performing your own validation.
