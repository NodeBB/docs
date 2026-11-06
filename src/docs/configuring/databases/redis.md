# Using Redis as a data store

NodeBB defaults to using MongoDB as its primary data store, although we also support Redis. Both Redis and MongoDB are considered data stores with first-class support in NodeBB, so if you experience bugs using the Redis as your data store instead of MongoDB, we still encourage you to [file an issue](https://github.com/NodeBB/NodeBB/issues/new).

Redis may be useful in some high-scalability scenarios due to its design which keeps the entirety of the database in active memory. This strategy allows lookups to be very very fast, and compared to MongoDB, you may see some non-insignificant increase in speed.

However, this advantage is a double-edged sword. As Redis keeps the entire database in active memory, it means that your system memory needs to be twice as large (if not more) than your dataset (i.e. 2gb of data will require a system with at least 4gb). Redis requires twice the memory (compared to its data set) as its backup strategy consists of cloning the in-memory data before persisting it to disk.

Consider your hardware options carefully and see whether the trade-off is worth it for your installation. Keep in mind that the NodeBB team maintains a Redis-to-MongoDB migration service for those that need it. For more information, reach out to sales@nodebb.org.

## Step 1: Install Redis

Install Redis according to the instructions of whatever package manager you use. In Ubuntu/Debian, you can use `apt`:

```
// as root user
add-apt-repository ppa:chris-lea/redis-server
apt-get update
apt-get install -y redis-server
```

## Step 2: NodeBB Installation

During the setup phase of NodeBB, you will be asked a series of questions related to your database. When asked which data store to use, enter `redis`.

* Host IP or address of your Redis instance
	* `127.0.0.1` or `localhost` will work for local installations
* Host port of your Redis instance
	* By default, Redis listens on port `6379`. If you changed it in `/etc/redis.conf`, adjust it here as well
* Password of your Redis database
	* Enter the password you set up in `/etc/redis.conf`. If you didn't change that file, chances are there is no password, and you can leave it blank. We do suggest you set up a password.
* Which database to use (0..n)
	* Redis defaults to 16 databases, numbered from 0 to 15. You can choose any of those numbers.

## Sentinel

NodeBB can connect to a Redis deployment managed by Redis Sentinel. The sentinel
nodes are listed in `redis.sentinels`, and the master name and any other
connection settings go in `redis.options`, which is passed to the
`createSentinel()` function of the Redis client:

```json
"redis": {
    "sentinels": [
        { "host": "10.0.0.1", "port": 26379 },
        { "host": "10.0.0.2", "port": 26379 },
        { "host": "10.0.0.3", "port": 26379 }
    ],
    "options": {
        "name": "my-master",
        "nodeClientOptions": {
            "password": "redis-password"
        }
    }
}
```

* `sentinels` — an array of `{ host, port }` of the sentinel nodes. NodeBB uses
    these nodes to discover which Redis node is the current master. Three
    sentinels is enough to reliably obtain the topology.
* `options.name` — the master name, exactly as it is defined in your sentinel
    configuration (e.g. `sentinel monitor my-master 10.0.0.1 6379 2`). It is
    required.
* `host`, `port` and `password` in the `redis` block are **not** used in
    sentinel mode. Credentials for the Redis nodes belong in
    `options.nodeClientOptions`, and credentials for the sentinel nodes
    themselves in `options.sentinelClientOptions` (sentinels can require
    `AUTH` — see `requirepass` in `sentinel.conf`).
* `database` is still read in sentinel mode: it is an integer, and it names the
    pub/sub channel NodeBB uses (`db:<database>:pubsub_channel`), so all NodeBB
    processes must be given the same value.

Everything inside `options` is spread verbatim into `createSentinel()`, so any
option the Redis client supports can be set there, including:

* `nodeClientOptions` — settings applied to the clients connected to the master
    and the replicas (password, username, `clientName`, TLS via
    `nodeClientOptions.socket.tls`, etc.)
* `sentinelClientOptions` — settings applied to the sentinel connections
* `masterPoolSize` / `replicaPoolSize` — the number of clients connected to the
    master and to each replica. `replicaPoolSize` distributes read-only
    commands across the replicas.
* `scanInterval` — how often the client re-queries the sentinels for topology
    changes (default: 10000 ms)
* `nodeAddressMap` — a mapping between the addresses the sentinels report and
    the addresses NodeBB should connect to, useful when the sentinels run on
    another network

Failover is handled by the client: when the master changes, the client
re-discovers the topology and reconnects.

> **Note**
>
> The `isCluster` option in `config.json` is unrelated to Redis Cluster (see
> below). It refers to a fleet of NodeBB processes, and it is required for
> pub/sub to work between them. See [Scaling](./scaling.md).

## Cluster

NodeBB can connect to a Redis Cluster. The seed nodes are listed in
`redis.cluster`, and the per-node settings go in `redis.options`, which is
passed to the `createCluster()` function of the Redis client:

```json
"redis": {
    "cluster": [
        { "host": "10.0.0.1", "port": 7000 },
        { "host": "10.0.0.2", "port": 7001 },
        { "host": "10.0.0.3", "port": 7002 }
    ],
    "options": {
        "defaults": {
            "password": "redis-password",
            "socket": { "tls": true }
        }
    }
}
```

* `cluster` — an array of `{ host, port }` of the cluster nodes. Each entry is
    turned into a `redis://host:port` URL, and used as a root node to fetch the
    cluster topology. The full topology (shards, slots, replicas) is fetched
    from the cluster itself, so a few nodes are enough.
* `options.defaults` — settings applied to the client of every node in the
    cluster. In cluster mode, `password`, `username`, and `socket` options must
    be set here; the `password` in the `redis` block is **not** passed to the
    cluster client.
* `database` must be an integer, and it names the pub/sub channel, as above.
    Redis Cluster has one database only, so use `0`.

Everything inside `options` is spread verbatim into `createCluster()`, so
options such as `minClusterSize`, `relocate`, `skipInit`, and
`silentConnection` are available.

### Limitations

NodeBB does not hash-tag its keys, and Redis Cluster requires every key of a
multi-key command to be in the same hash slot:

* NodeBB batches writes with `MULTI`/`EXEC`, using the first key's slot. When
    the other keys of the batch live in a different slot, Redis rejects the
    command with `CROSSSLOT`.
* `SCAN` (used by a few admin and upgrade tasks) and `FLUSHDB` are sent to a
    single node, so in a multi-shard cluster they cover only that shard.

In practice this means NodeBB works with a **single shard** (one master, plus
replicas for read scaling), where all keys land on the same node. Sharding the
keyspace across multiple shards is not supported.

> **Note**
>
> Sentinel and cluster are both supported for the data store, for the
> `session_store`, and for the socket.io adapter, since all three use the same
> connection code.