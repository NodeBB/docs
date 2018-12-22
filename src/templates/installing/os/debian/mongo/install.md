The following is an abbreviation of the official [MongoDB installation guide for Debian](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/). If you're having issues, fall back to using that guide instead.

```bash
{{commandPrefix}} sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
{{commandPrefix}} echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main" | sudo tee /etc/apt/sources.list.d/mongodb.list
{{commandPrefix}} sudo apt-get update
{{commandPrefix}} sudo apt-get install -y mongodb-org
```
