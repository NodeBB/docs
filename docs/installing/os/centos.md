CentOS 6/7
==========

First we should make sure that CentOS is up to date, we can do so using
this command:

```
yum -y update
```

\*\*If you're on CentOS 7, you will need to install the epel release, you
can do so using the following command:

```
yum -y install epel-release
```

Now, we install our base software stack:

```
yum -y groupinstall "Development Tools"
yum -y install git redis ImageMagick npm
```

Now we need install nodejs via npm as the repo package is too old.

```
curl https://raw.githubusercontent.com/creationix/nvm/v0.13.1/install.sh | bash
source ~/.bash_profile
nvm list-remote
nvm install v0.12.7 # as of this writing check the result of the list-remote to see all choices
```

Now start redis and set it to start on reboot

```
systemctl start redis
systemctl enable redis
```

If you want to use MongoDB, LevelDB, or another database instead of
Redis please look at the
[Configuring Databases](../../configuring/databases) section.

Next, clone the NodeBB repository:

```
cd /path/to/nodebb/install/location
git clone -b v1.7.x https://github.com/NodeBB/NodeBB nodebb
cd nodebb
```

\*\*Note: To clone the master branch you can use the same command with
out the "-b" option.

Initiate the setup script by running the app with the `setup` flag:

```
./nodebb setup
```

The default settings are for a local server running on the default port,
with a redis store on the same machine/port.

Assuming you kept the default port setting, you need to allow it through
the firewall.

```
firewall-cmd --zone=public --add-port=4567/tcp --permanent
firewall-cmd --reload
```

Lastly, we run the forum.

```
./nodebb start
```

NodeBB can also be started with helper programs, such as `forever`.
Take a look at the options [here](../../running/index).
