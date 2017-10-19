# OSX Mavericks

## Required Software

First, install the following programs:

-   <http://nodejs.org/>
-   <http://brew.sh/>

## Installing NodeBB

Install redis with homebrew:

```
brew install redis
```

Start redis server, in your terminal enter:

```
redis-server
```

Clone NodeBB repo:

```
git clone -b v1.6.x https://github.com/NodeBB/NodeBB.git
```

Enter directory:

```
cd NodeBB
```

Install dependencies:

```
npm install
```

Run interactive installation:

```
./nodebb setup
```

You may leave all of the options as default, except "Which database to
use (mongo)", which you should answer with "redis"

And you're done! After the installation, run

```
./nodebb start
```

You can visit your forum at `http://localhost:4567/`
