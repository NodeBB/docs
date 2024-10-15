Node.js is available from the NodeSource Ubuntu binary [distributions repository](https://github.com/nodesource/distributions?tab=readme-ov-file#using-ubuntu-nodejs-lts). Download the setup script.

```sh
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
curl -fsSL https://deb.nodesource.com/setup_lts.x -o nodesource_setup.sh
```

Run the script and install Node.js.

```sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
```
