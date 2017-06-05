Openshift PaaS
===========

Notice

A quickstart has been made to handle much of the below by using
openshift's environment variables. If you're just getting started please
take a look at [ahwayakchih's openshift
repo](https://github.com/ahwayakchih/openshift-nodebb)

The following are installation instructions for the
[Openshift](http://openshift.com) PaaS. Before starting, you need to
install Red Hat's rhc command line at
[<https://developers.openshift.com/en/managing-client-tools.html>](https://developers.openshift.com/en/managing-client-tools.html)

### **Step 1:** Create an application:

You may do this through [your web
console](https://openshift.redhat.com/app/console/applications) or by
using rhc:

```
rhc app create nodebb nodejs-0.10
```

If you're using the web console:

Scroll down and choose Node.js 0.10 in "Other types". Then click 'Next'.
Type nodebb in application name or replace (name) to whatever you like.

You may see a note indicating you need to specify a namespace. Namespace
can be anything as long you do not change the application name. If you
do add a namespace make sure to use them in your RHC commands with -n
and use -a to target you application by name.

```
rhc app create -a nodebb -n mynamespace nodejs-0.10
```

Scroll all the way down and click 'Create Application'. Then you need to
wait for it to finish creating your first NodeBB application.

You will be asked if you want to code your application. Simply click
'Not now, contiune'. Then you will be redirected to an application page.
It will tell you that it is created without any errors and it is
started.

### **Step 2:** Add a Database:

NodeBB works with eaither Redis or MongoDB, we'll use MongoDB.

```
rhc cartridge add mongodb-2.4 -a nodebb
```

In the web console:

Click 'see the list of cartridges you can add'. Choose the MongoDB
cartridge. Then click 'Next'. You should see if you want to confirm.
Click 'Add Cartridge'.

### **Step 3:** Note your Database Credentials.

After installing the cartridge you'll get a notification of your
username and password. Write it down somewhere, as you will need it
later.

Open terminal (or Git Bash) and paste the following command to access
SSH.

```
rhc app ssh -a nodebb
```

Note: If you got an error that it does not exist or similar, you need to
do the following command and then try again.

```
rhc setup
```

Get your Database's Host, IP and Port

Save this for later as well...

```
echo $OPENSHIFT_NODEJS_IP && echo $OPENSHIFT_MONGODB_DB_HOST && echo $OPENSHIFT_MONGODB_DB_PORT
```

In order: First line: NodeJS IP address - You should save it. Second
line: Mongodb IP address - Write it down. Third line: Mongodb Port -
Write it down.

Now exit SSH by pasting the following command.

```
exit
```

Note: You might have to type 'exit' once, and then again to exit SSH
completely.

### **Step 4:** Add NodeBB's Source Code on Openshift:

Go back to [your web
console](https://openshift.redhat.com/app/console/applications) and then
click NodeBB application. Copy the URL address from "Scoure Code."

A similar scoure code URL address should be this:
<ssh://%5Bcode%5D@nodebb-%5Bnamespace%5D.rhcloud.com/~/git/nodebb.git/>

Go back to terminal. Paste the following command and then paste the URL
address.

```
git clone ssh://[code]@nodebb-[namespace].rhcloud.com/~/git/nodebb.git/
```

Note: If it exists, check to make sure you do not have more than four
files. If it is, delete it and rerun the command. Otherwise continue on.

Note: This will create NodeBB folder on your computer, usually
\~/users/\[name\]/NodeBB

Then cd to NodeBB folder on your computer. And you will need to clone
NodeBB from Github to your application by using this command. The
default command git clone will not work with Openshift, unless you're in
SSH. You may split up this command into two parts if you needed to clone
your repository to another part of your computer start git bash from
there.

```
cd nodebb && git remote add upstream -m master https://github.com/NodeBB/NodeBB.git
```

or

```
cd nodebb
git remote add upstream -m master https://github.com/NodeBB/NodeBB.git
```

Then pull files from NodeBB's repository.

```
git pull -s recursive -X theirs upstream v0.9.x
```

Openshift does not yet support version 1.0.0 or later, see [this issue
on github](https://github.com/ahwayakchih/openshift-nodebb/issues/17).

### **Step 5:** Upload the source code to Openshift

Now you will need to commit and push files to your application's
repository. Replace message with your message. It will take a while to
finish.

```
git commit -a -m 'message' && git push
```

### **Step 6:** Configure and Install NodeBB.

SSH back into your application:

```
rhc app ssh -a nodebb
```

Start the installation of NodeBB using interactive installer. You're
going to fill in your application's details.

```
cd ~/app-root/repo && ./nodebb setup
```

Note: Web installer (npm start) will not work because the application
has not been configured to bind to Openshift's allowed ports. We're
about to do this right now.

\*URL used to access this NodeBB
([http://localhost:4567)\*](http://localhost:4567)*) - Copy and paste
your application's URL address and then add port 8080 like so:
<http://nodebb-%5Bnamespace%5D.rhcloud.com:8080>

*Please enter a NodeBB secret (code)* - Just press enter.

*Which database to use (redis)* - enter mongo.

*Host IP or address of your Mongo instance (127.0.0.1)* - Copy & paste
Mongo's IP address.

*Host port of your Mongo instance (6379)* - Copy & paste Mongo's port.

*Password of your Mongo database* - Enter your Mongo password.

*Which database to use (0)* - Enter the database name.

### **Step 7:** Now you will need to edit config.json NodeBB had created.
Paste the following command.

```
nano config.json
```

Add a line below "url" and then add the following. Repleace NodeJS IP
Address to IP address of your application. Then exit the editor using
CTRL+X.

`` ` "bind_address": "NodeJS IP Address", ``\`

### **Step 8:** Now start your NodeBB on Openshift!
And you're done! Then visit your website: <http://nodebb-%5Bnamespace%5D.rhcloud.com/>

```
cd ~/app-root/repo && ./nodebb start
```

----

**Note**

Starting, stopping, reloading, or restarting NodeBB now works on
Openshift. Be sure you always do this before doing it. (Replace
\[string\] with a nodeBB command of your choice). You can recover your
application from critical plugin failures for example by running
./nodebb stop followed by ./nodebb reset -p nodebb-plugin-name

```
rhc app ssh -a nodebb
cd ~/app-root/repo
./nodebb [string]
```

If your application fails to start after a git push due to an error like
EADDRINUSE openshift's application has critically failed and you may
want to consider moving your NodeBB install to a new instance. Look up
backing up and exporting databases. You can still resolve the error by
first force stopping your application before making a push, but you will
have to do this every single git push from now on.

```
rhc app-force-stop -a nodebb
git push origin master
```
