Environment Variables
=====================

NodeBB reads a small number of environment variables directly, and — through
[`nconf`](https://github.com/flatiron/nconf) — can read *any* value of
[`config.json`](./config.md) from the environment as well.

Precedence is (highest first):

1.  command-line arguments
2.  environment variables
3.  `config.json`
4.  NodeBB defaults

The environment is a convenient way to override a single setting in a
container image, on a PaaS host, or in a systemd unit, without editing
`config.json`.

Reading config values from the environment
-----------------------------------------

`config.json` keys are matched against environment variables **by name,
case-sensitively**. To override a nested key, use `__` (two underscores) as the
path separator:

| `config.json` key | Environment variable | Example value |
|-------------------|--------------------|---------------|
| `url` | `url` | `https://example.org` |
| `port` | `port` (lowercase) or `PORT` | `4567` |
| `secret` | `secret` | `a3f5...` |
| `database` | `database` | `redis` |
| `isCluster` | `isCluster` | `true` |
| `redis` → `redis.host` | `redis__host` | `10.0.0.5` |
| `redis` → `redis.port` | `redis__port` | `6379` |
| `socket.io` → `socket.io.origins` | `socket.io__origins` | `example.org:*` |

```bash
# Start NodeBB with a redis host and port taken from the environment
redis__host=10.0.0.5 redis__port=6379 ./nodebb start
```

> **Note**
>
> `URL` (uppercase) is *not* read as `url`. `PORT` is read in addition to
> `port`, because the loader explicitly checks both.

> **Caution**
>
> A handful of values are consumed by the loader process (`loader.js`), which
> reads the environment without the `__` separator. Nested keys such as
> `redis__host` are only visible to the NodeBB process itself, not to the
> loader. Top-level keys like `url`, `PORT` and `logFile` are read by both.

Environment values are plain strings, and are not parsed, so nested keys whose
value is a scalar work (`redis__host`, `redis__port`, `redis__password`,
`redis__database`, `session_store__host`), while keys whose value is an
array or object do not — `redis__sentinels` arrives as a string and fails.

> **Note**
>
> `PORT_ENV_VAR` is a `config.json` key that names *another* environment
> variable to read the port from (`src/prestart.js:114`): with
> `PORT_ENV_VAR=MY_PORT`, NodeBB uses `$MY_PORT` as its port.

`NODE_ENV`
----------

`NODE_ENV` is the mode NodeBB runs in. It defaults to `production`, and is set
by the NodeBB CLI itself: `./nodebb dev` and `./nodebb -d` (or `--dev`) set it
to `development`.

Setting it in the environment before starting NodeBB also works, e.g.
`NODE_ENV=development ./nodebb start`.

| Value | Effect |
|-------|--------|
| `production` (default) | Templates, CSS, and language files are minified. Asset builds use the production webpack config. The posts cache is enabled. The event-loop "too busy" check (503 responses) is active. Plugin usage reporting is enabled. |
| `development` | Templates, CSS, and language files are left un-minified, verbose logging is enabled, JSON API responses are pretty-printed, the posts cache is disabled, the "too busy" check is skipped, hook names are logged, and `./nodebb` installs dev dependencies. |

> **Note**
>
> The log level is derived from `NODE_ENV` when `log-level` is not set in
> `config.json`: `info` in production, `verbose` in development.

`CONFIG`
--------

Path to the configuration file, relative to the NodeBB root directory
(default: `config.json`).

```bash
CONFIG=/etc/nodebb/production.json ./nodebb start
```

The same key is honoured during setup as well. It is passed to child processes
by `./nodebb start`, so a single `CONFIG` value applies to the loader and all
workers.

`PORT`
------

Uppercase `PORT` overrides `port` when the loader decides how many processes to
spawn (see [Scaling](./scaling.md)). An integer is accepted from the
environment; a JSON array of ports is accepted only from `config.json`, since
environment values are not parsed.

Headless setup
--------------

The setup script (`./nodebb setup`) accepts the following variables. They are
only read at setup time; the values are written into `config.json`, and are not
used by a running NodeBB.

| Variable | Maps to `config.json` key | Notes |
|----------|---------------------------|-------|
| `NODEBB_URL` | `url` | Must start with `http://` or `https://` |
| `NODEBB_PORT` | `port` | Defaults to `4567` |
| `NODEBB_ADMIN_USERNAME` | `admin:username` | **Required** for unattended setup |
| `NODEBB_ADMIN_PASSWORD` | `admin:password` | **Required** for unattended setup |
| `NODEBB_ADMIN_EMAIL` | `admin:email` | **Required** for unattended setup |
| `NODEBB_DB` | `database` | `redis`, `mongo`, or `postgres` |
| `NODEBB_DB_HOST` | `<db>:host` | e.g. `127.0.0.1` |
| `NODEBB_DB_PORT` | `<db>:port` | e.g. `6379` |
| `NODEBB_DB_USER` | `<db>:username` | MongoDB and PostgreSQL |
| `NODEBB_DB_PASSWORD` | `<db>:password` | |
| `NODEBB_DB_NAME` | `<db>:database` | Redis database index, or database name for MongoDB/PostgreSQL |
| `NODEBB_DB_SSL` | `<db>:ssl` | PostgreSQL only |

`NODEBB_DB` is the prefix used for the `NODEBB_DB_*` keys, so `NODEBB_DB=redis`
means `NODEBB_DB_HOST` is written to `redis:host`.

A setup that answers all prompts can be run unattended:

```bash
NODEBB_URL=https://forum.example.org \
NODEBB_DB=redis \
NODEBB_DB_HOST=redis.example.org \
NODEBB_DB_PORT=6379 \
NODEBB_ADMIN_USERNAME=admin \
NODEBB_ADMIN_PASSWORD=changeme \
NODEBB_ADMIN_EMAIL=admin@example.org \
./nodebb setup
```

The same values can be passed as a JSON argument instead: `./nodebb setup
'{"url": "https://forum.example.org", "admin:username": "admin", ...}'`. The
`--unattended` (`-y`) option of `./nodebb` belongs to `upgrade` and
`upgrade-plugins`; it is not a `setup` option.

`setup` and `ci`
----------------

Lowercase `setup` is a JSON string with the same keys as the interactive setup
(`url`, `secret`, `database`, `admin:username`, ...). It triggers setup and
supplies the values, which override the `NODEBB_*` variables described above.
Uppercase `SETUP` is **not** read by NodeBB; the Docker entrypoint uses it as a
flag to decide whether to run `nodebb setup`.

Lowercase `ci` is a JSON string containing `host`, `port`, and `database`. When
all three are present, the object is written to `config.json` as
`test_database` — the database used by the test suite — e.g.
`ci='{"host": "10.0.0.5", "port": 6379, "database": "redis"}'`. If any of the
three is missing, `ci` is ignored and setup prompts for the missing values.
Uppercase `CI` is not read here.

> **Note**
>
> These variables are intended for automated (CI, container) setups. The
> `secret` is generated automatically if not provided, and the admin password
> is printed to the console at the end of setup.

Variables set by NodeBB itself
------------------------------

These are **not** meant to be set by the administrator. NodeBB sets them in its
own environment when spawning child processes, and other code reads them:

| Variable | Set by | Read by |
|----------|--------|---------|
| `url` | `loader.js` (on restart, from `config.json`) | loader |
| `port` | `loader.js` | child worker, to know which port it owns |
| `isPrimary` | `loader.js` | code that must run in one process only (jobs, plugin install, session pruning) |
| `isCluster` | `loader.js` | socket.io adapter, pub/sub, cluster detection |
| `minifier_child` | `src/meta/minifier.js` | the minifier child process, to distinguish parent from child |

NodeBB does not set `database` in the environment. A few upgrade scripts
(`src/upgrades/1.4.6/delete_sessions.js`, `src/upgrades/1.7.3/key_value_schema_change.js`)
read `process.env.database` as a fallback when `config.json` cannot be loaded,
so it must be set manually in that case.

Variables used by the Docker image
----------------------------------

The container entrypoint (`install/docker/entrypoint.sh`) reads these shell
variables; they are consumed by the entrypoint script, not by NodeBB itself:

| Variable | Purpose | Default |
|----------|---------|---------|
| `CONFIG_DIR` | Directory that holds `config.json` (and the lockfile), created and made writable on start; the entrypoint exports `CONFIG=$CONFIG_DIR/config.json` | `/opt/config` |
| `SETUP` | Presence of any value triggers `nodebb setup --config=$CONFIG` before starting | empty |
| `NODEBB_INIT_VERB` | Verb run when no `config.json` exists: `install` launches the web installer, `setup` runs the command-line setup | `install` |
| `NODEBB_BUILD_VERB` | Verb run when `package.json` changed: `build` compiles assets, `upgrade` runs database migrations | `build` |
| `START_BUILD` | Build before starting, even when `package.json` is unchanged; forced to `true` when plugins are added | `false` (`FORCE_BUILD_BEFORE_START` is read as a fallback) |
| `PACKAGE_MANAGER` | `npm`, `yarn`, or `pnpm`; selects the lockfile, the install command, and the start command (any other value exits with "Unknown package manager") | `npm` |
| `OVERRIDE_UPDATE_LOCK` | Replace existing `package.json`/lockfile in `CONFIG_DIR` with the ones shipped in the image | `false` |
| `NODEBB_ADDITIONAL_PLUGINS` | Space-separated (or bash array) list of plugin packages to install and enable before start | empty |
| `USER` | User the entrypoint chowns `CONFIG_DIR` with, and runs as | `nodebb` |

> **Note**
>
> The image also sets `NODE_ENV=production`, `DAEMON=false`, `SILENT=false`,
> `UID`, and `GID` (`Dockerfile`). `UID`/`GID` are used at build time to create
> the `USER` account, so they cannot be changed at run time.

Variables used by the test suite
--------------------------------

These are read by NodeBB's own test suite, not by a running forum. They are
listed here so they can be set in CI environments:

| Variable | Purpose |
|----------|---------|
| `CI` | Set to `true` by `test/mocks/databasemock.js`. Relaxes ActivityPub checks: `http://` URIs are accepted, remote actors are cached in the local database, outgoing payloads are recorded in `ActivityPub._sent` instead of delivered, and the `checkHeader()` probe in `notes.assert()` is skipped — so tests can run without a live web of forks. HTTP signatures are verified as usual |
| `ci` | Supplies `test_database` at setup time (see above), i.e. the database the test suite connects to |
| `TEST_ENV` | Overrides `NODE_ENV` for tests (default: `production`) |
| `GITHUB_REF` | The i18n suite is skipped entirely when this is set to anything other than `refs/heads/develop` |
| `GITHUB_EVENT_NAME` | Same suite: skipped when the value is `pull_request` |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` by the socket.io tests, which connect over TLS to a self-signed local certificate |
