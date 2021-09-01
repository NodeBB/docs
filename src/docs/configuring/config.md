The NodeBB Config (`config.json`)
=================================

The majority of NodeBB's configuration is handled by the Administrator
Control Panel (ACP), although a handful of server-related options are
defined in the configuration file (`config.json`) located at NodeBB's
root folder.

Some of these values are saved via the setup script:

* `url` is the full web-accessible address that points to your NodeBB.
    If you don't have a domain, an IP address will work fine (e.g.
    `http://127.0.0.1:4567`). Subfolder installations also define their
    folder here as well (e.g. `http://127.0.0.1:4567/forum`)
* `secret` is a text string used to hash cookie sessions. If the
    secret is changed, all existing sessons will no longer validate and
    users will need to log in again.
* `database` defines the primary database used by NodeBB. (e.g.
    `redis`, `mongo` or `postgres`) -- for more information, see
    Configuring Databases &lt;databases&gt;
* `redis`, `mongo` and `postgres` are objects that contain database-related
    connection information, they contain some or all of the following:
    * `host`
    * `port`
    * `uri` (MongoDB only connection string)
    * `username` (MongoDB only)
    * `password`
    * `database`

The following values are optional, and override the defaults set by
NodeBB:

* `port` (Default: `4567`) Specifies the port number that NodeBB will
    bind to. You can specify an array of ports and NodeBB will spawn
    port.length processes. If you use multiple ports you need to
    configure a load balancer to proxy requests to the different ports.
* `bcrypt_rounds` (Default: 12) Specifies the number of rounds to hash
    a password. Slower machines may elect to reduce the number of rounds
    to speed up the login process, but you'd more likely want to
    *increase* the number of rounds at some point if computer processing
    power gets so fast that the default \# of rounds isn't high enough
    of a barrier to password cracking.
* `upload_path` (Default: `/public/uploads`) Specifies the path,
    relative to the NodeBB root install, that uploaded files will be
    saved in.
* `jobsDisabled` This can be added to disable jobs that are run on a certain interval.
    - For example "jobsDisabled":true will disable daily digest emails and notification pruning. This option is useful for installations that run multiple NodeBB backends in order to scale. In such a setup, only one backend should handle jobs, and the other backends would set `jobsDisabled` to `true`.

* `socket.io` A hash with socket.io settings :
    * `transports` (Default: `["polling", "websocket"]`) Can be used to configure socket.io transports.
    * `address` (Default: `""`) Address of socket.io server can be empty
    * `origins` (Defaults to `url` in `config.json` on all ports) Defined a different url for socket.io connections, in the format `domain.tld:port` (e.g. `example.org:*`)
        * If you need to enter enable origins, separate them using commas (e.g. `https://example.org:*,https://example.net:*`)

* `bind_address` (Default: `0.0.0.0`, or all interfaces) Specifies the local address that NodeBB should bind to.
    - By default, NodeBB will listen to requests on all interfaces, but when set, NodeBB will only accept connections from that interface.

* `sessionKey` (Default: `express.sid`) Specifies the session key to use.

* `isCluster` Set this to true if you have multiple machines each running a single NodeBB process. This setting is not required if you have multiple NodeBB processes running either on a single or multiple machines.

* `session_store` This is an object similar to the `redis`, `mongo` or `postgres` block. It defines a database to use for sessions. For example by setting this to a different redis instance you can separate your data and sessions into two different redis instances.
    * `name` (Name of database to use `redis`, `mongo` or `postgres`)
    * other settings are identical to the database block for the datastore.

* `logFile` (Default: `logs/output.log`) Specifies the path, relative to the NodeBB root install, that the log file will be stored. If this doesn't exist it will be created. Log files will be rotated to the same directory when the current log file gets above 1 Megabyte, to a maximum of 3 archived.