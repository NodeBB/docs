# Plugin Settings

`Availability: >=4.0.0`

Most plugins need a handful of administrator-configurable options. NodeBB ships a
settings system that persists a plugin's options and a client-side `settings` module
that binds an ACP form to that store, so you rarely need to write any save/load logic
yourself. This page walks through a complete round-trip: a form in the ACP, the client
module that reads and writes it, and reading the saved values on the server.

## 1. The ACP page and form

First, register an [ACP page route](./routes.md) and create its template. Each form
control's `name` attribute becomes a key in the saved settings object.

**templates/admin/plugins/myplugin.tpl**

```html
<form role="form" class="myplugin-settings">
    <div class="form-check form-switch">
        <input type="checkbox" class="form-check-input" id="allowGuests" name="allowGuests" />
        <label class="form-check-label" for="allowGuests">Allow guests</label>
    </div>

    <div class="mb-3">
        <label class="form-label" for="greeting">Greeting</label>
        <input type="text" class="form-control" id="greeting" name="greeting" />
    </div>
</form>

<button id="save" class="btn btn-primary">Save</button>
```

## 2. The client-side settings module

The ACP module is wired through the `modules` property of `plugin.json`, mapping the
virtual admin path to your script:

```json
{
    "acpScripts": ["public/lib/acp.js"],
    "modules": {
        "../admin/plugins/myplugin.js": "./public/lib/admin.js"
    }
}
```

ACP modules are authored as ES modules (`import`/`export`). Import `save` and `load`
from the built-in `settings` module to wire the form to the settings store:

**public/lib/admin.js**

```js
'use strict';

import { save, load } from 'settings';

export function init() {
    // Populate the form from the stored settings for plugin id "myplugin"
    load('myplugin', $('.myplugin-settings'));

    $('#save').on('click', () => {
        // Persist the form values back under the same id
        save('myplugin', $('.myplugin-settings'));
    });
}
```

`load(id, formEl)` reads the saved object and fills the matching form fields;
`save(id, formEl[, callback])` serialises the form back into the store. The `id` is
your plugin's settings namespace — keep it consistent across the client and server.

## 3. Reading settings on the server

Read the stored values anywhere in your library through `meta.settings`:

```js
const meta = require.main.require('./src/meta');

const settings = await meta.settings.get('myplugin');
```

You can also write them programmatically with `meta.settings.set('myplugin', obj)`.

### Checkbox values are the strings `'on'` / `'off'`

This is the most common surprise. A checkbox saved through the `settings` module is
stored as the **string** `'on'` when checked and `'off'` (or absent) when not — it is
**not** a boolean. Compare explicitly:

```js
if (settings.allowGuests === 'on') {
    // enabled
}
```

A truthiness check (`if (settings.allowGuests)`) is wrong, because the string
`'off'` is itself truthy.

Text and textarea fields come back as their raw string values, so parse as needed:

```js
const lines = (settings.greeting || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
```
