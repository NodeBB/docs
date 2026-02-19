NodeBB includes a [bundled Dockerfile](https://github.com/NodeBB/NodeBB/blob/master/Dockerfile) and configuration for use with Docker-compatible container systems.

The configuration (and this documentation) is community-maintained, and those looking for support should create a new topic
[on the community forum](https://community.nodebb.org/category/16/technical-support).

### Docker Compose usage

An example instance of NodeBB can also be rapidly started using Docker Compose provided in this repo.
At least Docker Compose version 3.8 is required.

### Choosing your database

You will need to choose the type of database first. In this repo you can choose the following three profiles

- mongo
- postgres
- redis

For MongoDB, PostgreSQL, Redis support respectively.
This will be supplied along with the main Docker Compose launch command as extra file source.
Let's call this `{DATABASE}` shall we?

### Starting NodeBB

To start the example, you just need to run the command in the following style
```bash
$ docker-compose --profile {DATABASE} up
```
After few minutes or so you should be able to see (console output may be clobbered):
```bash
nodebb_1  | Config file not found at /opt/config/config.json
nodebb_1  | Starting installer
nodebb_1  | 2022-07-10T15:05:35.085Z [23] - info: Launching web installer on port 4567
nodebb_1  | 2022-07-10T15:05:47.697Z [23] - info: Web installer listening on http://0.0.0.0:4567
```
Now open your browser and access to http://localhost:4567.

**The default database host is the name of your database, so type in `redis` if you used Redis, `mongo` using MongoDB, etc.**

Your stateful files (build artifacts, node_modules, database data) will be stored at `.docker` at the current working directory,
but you are adviced to not rely on the default Docker Compose setup and instead make up your own.

#### Additional information for MongoDB

For MongoDB, please notice that you need to use **admin** as database at the moment, since for some reason the latest version of the official
MongoDB docker did not take in account for `MONGO_INITDB_DATABASE`, so the default `admin` database is still used.
