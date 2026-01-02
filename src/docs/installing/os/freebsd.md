FreeBSD
=======

This guide is for FreeBSD 15.x-RELEASE.   
It should work, with slight modifications, for all other relatively modern versions.  
This setup has been verified using a clean jail without any modifications.

For this example we are using:
- `Redis` for the database
- `/user/home/nodebb` for the home directoy of the new `nodebb` user
- `/user/local/www/nodebb` for the new public directoy of NodeBB

The rest is fairly straight forwarded:
- This user needs to be created prior the installation with:  
```
pw user add -n nodebb -m -s /bin/sh -d /usr/home/nodebb -c "NodeBB User"
chown -R nodebb:nodebb /usr/home/nodebb
```
- The directory needs to be created prior the installation with:  
```
mkdir -p /usr/local/www/nodebb/
chown -R nodebb:nodebb /usr/local/www/nodebb/
```
- Make sure your system is up to date and fetching from the "latest" PKG repository by running:
```
mkdir -p /usr/local/etc/pkg/repos
sed -e 's|quarterly|latest|g' /etc/pkg/FreeBSD.conf > /usr/local/etc/pkg/repos/FreeBSD.conf
freebsd-update fetch
freebsd-update install
pkg upgrade
```
- Install the needed packages with `pkg install redis gcc npm git vips node vips`
- Activate Redis and start the service: `service redis enable && service redis start`
- Switch to the user `nodebb` with `su nodebb`
- Get the latest code (check out the [releases](https://github.com/NodeBB/NodeBB/releases)):
```
cd /usr/local/www/nodebb/
git clone -b v4.x.x https://github.com/NodeBB/NodeBB.git
cd NodeBB
```
> Version prior including 4.7.2:  
> Please be aware the the usage of sass-embedded is not (!) working on FreeBSD.  
> [There might be a modification](https://github.com/NodeBB/NodeBB/issues/13867) for the file `src/utils.js` needed.  
> `cp src/utils.js src/utils.js.bak`  
> `sed -i '' "s|const sass = require('sass-embedded');|const sass = require('sass');|g" src/utils.jsc`  
> Otherwiese you get stuck in the message `sass --embedded is unavailable in pure JS mode`  

- Install the needed NPM packages
```
npm install node-addon-api node-gyp libvips tslib sharp lodash
```
> If you experience any problems while adding the npm packages,  
> just start from scratch by user `npm cache clean --force && rm -rf node_modules`

- Run interactive installation:
```
.\nodebb setup
```
You may leave all of the options as default, but choose `redis` for the database.  
After the installation has finished (it takes a while), finally run:
```
.\nodebb start
```
Visit your forum at `http://FQDN:4567/` to finish configuration and setup.  
> **FQDN** is the server fully qualified domain name.
