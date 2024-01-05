Node.js is available from the NodeSource Ubuntu binary distributions repository.

1. Download and import the Nodesource GPG key

```sh
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
```

2. Create deb repository

```sh
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_{{versions.major.node}}.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```

3. Run Update and Install

```sh
sudo apt-get update
sudo apt-get install nodejs -y
```