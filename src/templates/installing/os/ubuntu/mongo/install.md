The following is an abbreviation of the official [MongoDB installation guide for Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/).

```bash
{{commandPrefix}} sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
{{commandPrefix}} echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/{{versions.recommended.mongo}} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-{{versions.recommended.mongo}}.list
{{commandPrefix}} sudo apt-get update
{{commandPrefix}} sudo apt-get install -y mongodb-org
```
