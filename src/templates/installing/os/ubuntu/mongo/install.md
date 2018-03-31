The following is an abbreviation of the official [MongoDB installation guide for Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/). If you're having issues, fall back to using that guide instead.

```bash
{{commandPrefix}} sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
{{commandPrefix}} echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/{{versions.recommended.mongo}} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-{{versions.recommended.mongo}}.list
{{commandPrefix}} sudo apt-get update
{{commandPrefix}} sudo apt-get install -y mongodb-org
```
