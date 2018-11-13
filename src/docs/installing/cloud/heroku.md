Heroku
======

**Note**: Installations to Heroku require a local machine with some
flavour of unix, as NodeBB does not run on Windows.

1.  Download and install [Heroku Toolbelt](https://toolbelt.heroku.com/)
    for your operating system
1.  Log into your Heroku account: `heroku login`
1.  Verify your Heroku account by adding a credit card (at
    <http://heroku.com/verify>). *Required for enabling mLab MongoDB Add-on.*
1.  Clone the repository:
    `git clone -b v1.10.x https://github.com/NodeBB/NodeBB.git /path/to/repo/clone`
1.  `cd /path/to/repo/clone`
1.  Create the heroku app: `heroku create`
1.  Enable [mLab MongoDB](https://elements.heroku.com/addons/mongolab) 
    for your heroku account ([Sandbox](https://elements.heroku.com/addons/mongolab#sandbox) 
    is a free plan): `heroku addons:create mongolab:sandbox`
1.  Run the NodeBB setup script: `./nodebb setup` (information for
    your Heroku server and mLab MongoDB instance can be found in your
    account page)

    > -   Your server name is found in your Heroku app's "settings"
    >     page, and looks something like
    >     `https://adjective-noun-wxyz.herokuapp.com`
    > -   Use any port number. It will be ignored.
    > -   Your MongoDB server can be found as part of the mongoDB url. For
    >     example, for the url:
    >     `mongodb://heroku_b5mwv5hk:8i0hd53a35qhd7bd2p8lm0m4do@ds151291.mlab.com:61391/heroku_b5mwv5hk`
    >     -   The host is `ds151291.mlab.com`
    >     -   The port is `61391`
    >     -   The username is `heroku_b5mwv5hk`
    >     -   The password is `8i0hd53a35qhd7bd2p8lm0m4do`

1. Create a Procfile for Heroku:
    `echo "web: node loader.js --no-daemon" > Procfile`
1. Commit the Procfile:

```
git add -f Procfile config.json package.json build && git commit -am "adding Procfile and configs for Heroku"
```

1. Push to heroku: `git push -u heroku v1.10.x:master`
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

