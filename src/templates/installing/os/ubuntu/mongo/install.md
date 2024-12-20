The following is an abbreviation of the official [MongoDB installation guide for Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/). If you're having issues, fall back to using that guide instead.

```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-{{versions.recommended.mongo}}.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-{{versions.recommended.mongo}}.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-{{versions.recommended.mongo}}.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/{{versions.recommended.mongo}} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-{{versions.recommended.mongo}}.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```
