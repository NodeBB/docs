The following is an abbreviation of the official [MongoDB installation guide for Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/). If you're having issues, fall back to using that guide instead.

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-{{versions.recommended.mongo}}.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/{{versions.recommended.mongo}} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-{{versions.recommended.mongo}}.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```
