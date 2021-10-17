The following is an abbreviation of the official [MongoDB installation guide for Debian](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/). If you're having issues, fall back to using that guide instead.

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-{{versions.recommended.mongo}}.asc | sudo apt-key add -
echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/{{versions.recommended.mongo}} main" | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```
