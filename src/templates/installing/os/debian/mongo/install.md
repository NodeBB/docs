The following is an abbreviation of the official [MongoDB installation guide for Debian](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/). If you're having issues, fall back to using that guide instead.

```bash
sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-{{versions.recommended.mongo}}.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-{{versions.recommended.mongo}}.gpg \
   --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-{{versions.recommended.mongo}}.gpg ] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/{{versions.recommended.mongo}} main" | sudo tee /etc/apt/sources.list.d/mongodb-org-{{versions.recommended.mongo}}.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```
