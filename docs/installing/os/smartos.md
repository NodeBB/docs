SmartOS
=======

Requirements
------------

NodeBB requires the following software to be installed:

-   Node.js (version 0.10 or greater, instructions below).
-   Redis (version 2.6 or greater, instructions below) or MongoDB
    (version 2.6 or greater).
-   nginx (version 1.3.13 or greater, **only if** intending to use nginx
    to proxy requests to a NodeBB server).

Server Access
-------------

1.  Sign in your Joyent account: [Joyent.com](http://joyent.com)
1.  Select: `Create Instance`
1.  Create the newest `smartos nodejs` image.

    > **Note:** The following steps have been tested with images:
    > `smartos nodejs 13.1.0` `smartos nodejs 13.2.3`

1.  Wait for your instance to show `Running` then click on its name.
1.  Find your `Login` and admin password. If the `Credentials` section
    is missing, refresh the webpage.

    > **Example:** `ssh root@0.0.0.0` `A#Ca{c1@3`

1.  SSH into your server as the admin not root: `ssh admin@0.0.0.0`

    > **Note:** For Windows users that do not have ssh installed, here
    > is an option: [Cygwin.com](http://cygwin.com)

Installation
------------

1.  Install NodeBB's software dependencies:

    > ```
    > $ sudo pkgin update
    > $ sudo pkgin install scmgit nodejs build-essential ImageMagick redis
    > ```
    >
    > If any of those failed to install then:
    >
    > ```
    > $ pkgin search *failed-name*
    > $ sudo pkgin install *available-name*
    > ```

1.  **If needed** setup a redis-server with default settings as a
    service (automatically starts and restarts):

    > If you want to use MongoDB, LevelDB, or another database instead
    > of Redis please look at the
    > [Configuring Databases](../../configuring/databases) section.
    >
    > **Note:** These steps quickly setup a redis server but do not
    > fine-tuned it for production.
    >
    > **Note:** If you manually ran `redis-server` then exit out of
    > it now.
    >
    > ```
    > $ svcadm enable redis
    > $ svcs svc:/pkgsrc/redis:default
    > ```
    >
    > **Note:** If the STATE is maintenance then:
    >
    > ```
    > $ scvadm clear redis
    > ```
    >
    > *-* To shut down your redis-server and keep it from restarting:
    >
    > ```
    > $ scvadm disable redis
    > ```
    >
    > *-* To start up your redis-server and have it always running:
    >
    > ```
    > $ scvadm enable redis
    > ```

1.  Move to where you want to create the nodebb folder:

    > ```
    > $ cd /parent/directory/of/nodebb/
    > ```

1.  Clone NodeBB's repository (you may replace the ending nodebb with a
    different folder name):

    > ```
    > $ git clone -b v1.7.x https://github.com/NodeBB/NodeBB.git nodebb
    > $ cd nodebb
    > ```

1.  Run NodeBB's setup script:

    > ```
    > $ ./nodebb setup
    > ```
    >
    > a.  `URL used to access this NodeBB` is either your public ip
    >     address from your ssh `Login` or your domain name pointing to
    >     that ip address.
    >
    >     > **Example:** `http://0.0.0.0` or `http://example.org`
    >
    > b.  `Port number of your NodeBB` is the port needed to access your
    >     site:
    >
    >     > **Note:** If you do not proxy your port with something like
    >     > nginx then port 80 is recommended for production.
    >
    > c.  `Please enter a NodeBB secret` - Do not email this or
    >     post publicly.
    > d.  `IP or Hostname to bind to` - Use default unless your server
    >     requires otherwise.
    > e.  If you used the above steps to setup your redis-server then
    >     use the default redis settings.

1.  Start NodeBB process manually:

    > **Note:** This should not be used for production but instead create a deamon manually, use Forever, or use Supervisor. Take a look at the options [here])../../running/index).

    > ```
    > $ node app
    > ```

1.  Visit your app!

    > **Example:** With a port of 4567: `http://0.0.0.0:4567` or `http://example.org:4567`
    >
    > **Note:** With port 80 the `:80` does not need to be entered.

----

**Note:** If these instructions are unclear or if you run into trouble,
please let us know by [filing an
issue](https://github.com/NodeBB/NodeBB/issues).

Upgrading NodeBB
----------------

**Note:** Detailed upgrade instructions are listed in [Upgrading NodeBB](../../configuring/upgrade).
