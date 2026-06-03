# Using Core Libraries

`Availability: >=4.0.0`

As shown in [Writing Plugins](./index.md#using-nodebb-libraries-to-enhance-your-plugin),
a plugin reaches NodeBB's internals through `require.main.require('./src/...')`. This
page is a practical tour of the libraries plugins use most, plus a couple of common
recipes that combine them.

!!! note
    This is a curated starting point, **not** an exhaustive API reference. NodeBB's
    modules expose many more methods than are listed here, and signatures may change
    between major versions. When you need something that isn't covered, read the
    relevant file under
    [`src/`](https://github.com/NodeBB/NodeBB/tree/v4.x/src) in the NodeBB source —
    that is the authoritative reference. Almost all of these methods are `async` and
    return Promises.

## Commonly used modules

```js
const db            = require.main.require('./src/database');
const user          = require.main.require('./src/user');
const groups        = require.main.require('./src/groups');
const topics        = require.main.require('./src/topics');
const privileges    = require.main.require('./src/privileges');
const notifications = require.main.require('./src/notifications');
const meta          = require.main.require('./src/meta');
const translator    = require.main.require('./src/translator');
const pagination    = require.main.require('./src/pagination');
const helpers       = require.main.require('./src/controllers/helpers');
const routeHelpers  = require.main.require('./src/routes/helpers');
```

### `database`

The database module is an abstraction over the configured backend (Redis, MongoDB, or
Postgres), exposing a single API so your plugin works on any of them. It deals in
**objects** (hashes) and **sorted sets**, among other structures.

> This is distinct from the [Database Structure](../database-structure.md) page, which
> documents the keys NodeBB core itself stores. The methods below are the API you call
> to read and write your own keys.

```js
getObject(key) / getObjects([keys])         // read hash(es)
getObjectFields(key, [fields])              // read selected fields of a hash
setObject(key, obj)                         // write a hash
deleteObjectFields(key, [fields])           // remove fields from a hash
delete(key) / deleteAll([keys])             // delete key(s)
incrObjectField(key, field)                 // atomic increment (e.g. an id counter)
sortedSetAdd(key, score, member)            // add to a sorted set
sortedSetRemove(key, member)                // remove from a sorted set
sortedSetCard(key)                          // count members
getSortedSetRange(key, start, stop)         // members ascending by score
getSortedSetRevRange(key, start, stop)      // members descending by score
getSortedSetRevRangeWithScores(key, start, stop)  // [{ value, score }]
```

A common pattern is a per-entity hash plus a sorted set used as an ordered index:

```js
const id = await db.incrObjectField('global', 'nextThingId');
await db.setObject(`thing:${id}`, { id, uid, content, timestamp: Date.now() });
await db.sortedSetAdd(`thing:byTopic:${tid}`, Date.now(), id);
```

### `user`

```js
getUserFields(uid, [fields])                // one user
getUsersFields([uids], [fields])            // many users
getSettings(uid)                            // per-user settings (e.g. topicsPerPage)
exists(uid)                                 // boolean
isAdministrator(uid)                        // boolean
isGlobalModerator(uid)                      // boolean
isModeratorOfAnyCategory(uid)               // boolean
```

Frequently requested fields: `['uid', 'username', 'userslug', 'picture']`.

### `groups`

```js
search(query, { sort, filterHidden })       // search groups by name
getMembers(name, start, stop)               // member uids
getUserGroups([uids])                       // groups each uid belongs to
getGroupFields(name, [fields])              // group metadata
exists(name)                                // boolean
isPrivilegeGroup(name)                      // boolean — filter these out of UI lists
```

### `topics`

```js
getTopicFields(tid, [fields])               // selected fields of one topic
getTopicsByTids([tids], uid)                // full, render-ready topic objects
getFollowers(tid)                           // uids watching the topic
follow(tid, uid)                            // make a user watch a topic
```

### `privileges`

Always filter content by the viewer's privileges before returning or rendering it:

```js
const visibleTids = await privileges.topics.filterTids('read', tids, uid);
```

## Recipe: sending a notification

```js
const notifications = require.main.require('./src/notifications');

const notifObj = await notifications.create({
    type: 'myplugin-event',                          // an identifier for the event
    bodyShort: '[[myplugin:notif-text, ' + title + ']]',  // a translation key (see i18n)
    nid: 'myplugin:thing:' + tid + ':' + id,         // MUST be unique — it is the dedupe key
    from: fromUid,                                   // who triggered it
    path: '/topic/' + slug,                          // where the notification links to
});

// create() can return a falsy value (e.g. when there is nothing to send),
// so always check before pushing.
if (notifObj) {
    await notifications.push(notifObj, recipientUids);
}
```

The `bodyShort` is a [language string](../i18n.md) and may include positional
arguments. Define a matching key in your language file, e.g.
`"notif-text": "New activity in %1"`.

## Recipe: a custom list page

[Page routes](./routes.md) can render your own template, or reuse a core one by
supplying the data that template expects. For a list of topics, the `recent`
template is convenient. The helpers below assemble that data:

```js
const user       = require.main.require('./src/user');
const topics     = require.main.require('./src/topics');
const privileges = require.main.require('./src/privileges');
const pagination = require.main.require('./src/pagination');
const helpers    = require.main.require('./src/controllers/helpers');

async function renderMyList(req, res) {
    const uid = req.uid;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const settings = await user.getSettings(uid);                 // settings.topicsPerPage
    let tids = await getMyTids(uid);                              // your own data source
    tids = await privileges.topics.filterTids('read', tids, uid); // respect read access

    const start = (page - 1) * settings.topicsPerPage;
    const stop = start + settings.topicsPerPage - 1;
    const topicsData = await topics.getTopicsByTids(tids.slice(start, stop + 1), uid);

    const pageCount = Math.max(1, Math.ceil(tids.length / settings.topicsPerPage));
    res.render('recent', {
        topics: topicsData,
        title: '[[myplugin:list.title]]',
        breadcrumbs: helpers.buildBreadcrumbs([{ text: '[[myplugin:list.title]]' }]),
        pagination: pagination.create(page, pageCount),
    });
}
```
