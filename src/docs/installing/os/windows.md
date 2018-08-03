Windows 8
=========

Required Software
-----------------

First, install the following programs:

-   <https://windows.github.com/>
-   <https://nodejs.org/en/download/>
-   <http://imagemagick.org/script/binary-releases.php#windows/>
-   <https://www.python.org/ftp/python/2.7.8/python-2.7.8.msi>
-   <https://github.com/MSOpenTech/redis/releases>
-   <https://www.microsoft.com/en-us/download/details.aspx?id=44914>

You may have to restart your computer.

Running NodeBB
--------------

Start Redis Server and leave the command window that it starts in open

> **note**
>
> The default location of Redis Server is
>
> **C:\\Program Files\\Redis\\StartRedisServer.cmd**

Open Git Shell, and type the following commands. Clone NodeBB repo:

```
git clone -b v1.10.x https://github.com/NodeBB/NodeBB.git
```

Enter directory:

```
cd NodeBB
```

Run interactive installation:

```
node app.js --setup
```

You may leave all of the options as default.

And you're done! After the installation, run

```
node app.js
```

and leave the window open.

You can visit your forum at `http://127.0.0.1:4567/`

Developing on Windows
---------------------

It's a bit of a pain to shutdown and restart NodeBB everytime you make
changes. First install supervisor:

```
npm install -g supervisor
```

Open up bash:

```
bash
```

And run NodeBB on "watch" mode:

```
./nodebb watch
```

It will launch NodeBB in development mode, and watch files that change
and automatically restart your forum.
