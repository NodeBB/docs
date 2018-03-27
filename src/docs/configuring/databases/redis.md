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