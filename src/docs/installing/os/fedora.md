Fedora 33+
==========

*This was tested on Fedora 33. It will likely work on slightly older or newer verisons, with zero changes.*

Fedora does not natively support MongoDB because of the license. Therefore, this guide will use PostgreSQL.


First you need to make sure that Fedora is up to date, you can do so using
this command:

```
dnf upgrade -y --refresh
```

Now, you install the base software stack:

```
dnf install -y git nodejs postgresql-server policycoreutils-python-utils
```

Initialize the PostgreSQL database

```
/usr/bin/postgresql-setup initdb
```

Enable and start the database

```
systemctl enable --now postgresql
```

Update the firewall to allow the needed connections

```
firewall-cmd --add-port=4567/tcp --permanent
firewall-cmd --reload
```

Tell SELinux to allow the webserver to connect to the local network

```
setsebool -P httpd_can_network_connect on
```

Create user and database to be used by NodeBB
   * This spews an error about changing directories, but still creates.

```
sudo -u postgres psql -c "create user nbbuser with encrypted password 'SomeLongPasswordForTheUser'"
sudo -u postgres psql -c "create database nodebbdb"
sudo -u postgres psql -c "grant all privileges on database nodebbdb to nbbuser"
```

Set a password for the admin user (postgres)

```
sudo -u postgres psql -c "alter user postgres with password 'SomeLongPasswordForTheRootUser'"
```

Update PostgreSQL to use database user login information.

```
sed -i 's/ident$/md5/g' /var/lib/pgsql/data/pg_hba.conf
```

Restart PostgreSQL

```
systemctl restart postgresql
```

Create application directory.

```
mkdir -p /opt/nodebb
```

Next, clone the NodeBB repository:
   * As of the creation of this guide, the current branch is v1.18.x
   * Update accordingly

```
git clone -b v1.18.x https://github.com/NodeBB/NodeBB /opt/nodebb
```

\*\*Note: To clone the master branch you can use the same command with
out the "-b v1.18.x" option.


It is bad practice to run NodeBB as a privileged user, so create a user 

```
adduser nodebb --system --create-home
```

Set ownership of the NodeBB folder to the user that will be running the application

```
chown -R nodebb:nodebb /opt/nodebb
```

Change directory and then initiate the setup script by running the app as the nodebb user with the `setup` flag:

```
cd /opt/nodebb
sudo -u nodebb ./nodebb setup
```

The wizards will ask what database to use, make sure you specify `postgresql` and then use the same information as used above when the database was created.

Lastly, we run the forum, again as the nodebb user.

```
sudo -u nodebb ./nodebb start
```

NodeBB can also be started with helper programs, such as `forever`.
Take a look at the options [here](../../running/index).
