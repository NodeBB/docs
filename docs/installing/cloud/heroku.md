Heroku
======

**Note**: Installations to Heroku require a local machine with some
flavour of unix, as NodeBB does not run on Windows.

1.  Download and install [Heroku Toolbelt](https://toolbelt.heroku.com/)
    for your operating system
1.  Log into your Heroku account: `heroku login`
1.  Verify your Heroku account by adding a credit card (at
    <http://heroku.com/verify>). *Required for enabling Redis To
    Go Add-on.*
1.  Clone the repository:
    `git clone -b v1.6.x https://github.com/NodeBB/NodeBB.git /path/to/repo/clone`
1.  `cd /path/to/repo/clone`
1.  Create the heroku app: `heroku create`
1.  Enable [Redis To Go](https://addons.heroku.com/redistogo) for your
    heroku account ([Nano](https://addons.heroku.com/redistogo#nano) is
    a free plan): `heroku addons:create redistogo:nano`
1.  Run the NodeBB setup script: `node app --setup` (information for
    your Heroku server and Redis to Go instance can be found in your
    account page)

    > -   Your server name is found in your Heroku app's "settings"
    >     page, and looks something like
    >     `https://adjective-noun-wxyz.herokuapp.com`
    > -   Use any port number. It will be ignored.
    > -   Your redis server can be found as part of the redis url. For
    >     example, for the url:
    >     `redis://redistogo:h28h3wgh37fns7@fishyfish.redistogo.com:12345/`
    >     -   The server is `fishyfish.redistogo.com`
    >     -   The port is `12345`
    >     -   The password is `h28h3wgh37fns7`

1. Create a Procfile for Heroku:
    `echo "web: node loader.js --no-daemon" > Procfile`
1. Commit the Procfile:

```
git add -f Procfile config.json package.json build && git commit -am "adding Procfile and configs for Heroku"
```

1. Push to heroku: `git push -u heroku v1.6.x:master`
    * Ensure that a proper SSH key was added to your account, otherwise the push will not succeed!
1. Initialise a single dyno: `heroku ps:scale web=1`
1. Visit your app!

If these instructions are unclear or if you run into trouble, please let
us know by creating a topic on the [Community Support
Forum](https://community.nodebb.org).

Keeping it up to date
---------------------

If you wish to pull the latest changes from the git repository to your
Heroku app:

1.  Navigate to your repository at `/path/to/nodebb`
1.  `git pull`
1.  `npm install`
1.  `node app --upgrade`
1.  `git commit -am "upgrading to latest nodebb"`
1.  `git push`

