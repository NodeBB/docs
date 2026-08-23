# Using PostgreSQL as a data store

NodeBB supports PostgreSQL as its primary data store. The database and login
role must exist before you run NodeBB's setup; NodeBB creates its own tables
and other database objects during setup.

## Step 1: Install and prepare PostgreSQL

Install PostgreSQL using the instructions for your operating system on the
[official PostgreSQL download page](https://www.postgresql.org/download/).

Create a login role for NodeBB and a database owned by that role. For example,
from a local installation where the `postgres` operating-system user can open
`psql`:

```bash
sudo -u postgres psql
```

Then run:

```text
CREATE ROLE nodebb WITH LOGIN;
\password nodebb
CREATE DATABASE nodebb OWNER nodebb;
\q
```

When `\password` prompts you, enter a unique, strong password. This avoids
putting the password directly in the SQL command, where it may be exposed in
command history or server logs. Keep the password out of source control. How
you open `psql` depends on your operating system and PostgreSQL installation.
See the official documentation for [`psql`](https://www.postgresql.org/docs/current/app-psql.html),
[`CREATE ROLE`](https://www.postgresql.org/docs/current/sql-createrole.html), and
[`CREATE DATABASE`](https://www.postgresql.org/docs/current/sql-createdatabase.html)
for other environments and options.

## Step 2: Configure NodeBB

Run NodeBB's setup command:

```bash
./nodebb setup
```

When prompted, select `postgres` as the data store and enter:

- the PostgreSQL host (default: `127.0.0.1`);
- the PostgreSQL port (default: `5432`);
- the login role name and password;
- the database name (default: `nodebb`); and
- whether the connection requires SSL.

The resulting database section in `config.json` can look like this:

```json
{
  "database": "postgres",
  "postgres": {
    "host": "127.0.0.1",
    "port": 5432,
    "username": "nodebb",
    "password": "replace-with-a-strong-password",
    "database": "nodebb",
    "ssl": false
  }
}
```

Adjust the host, port, credentials, database name, and SSL setting to match
your PostgreSQL server.
