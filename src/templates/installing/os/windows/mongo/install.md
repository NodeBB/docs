The following is an abbreviation of the official [MongoDB installation guide for Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/).

#### Go to the [MongoDB Download Center](https://www.mongodb.com/download-center#production) and download the appropriate setup file

#### Locate the downloaded `.msi` file and execute it to start the installer

The default installation location is `C:\Program Files\MongoDB\Server\{{versions.recommended.mongo}}`

#### Add the MongoDB binaries to your PATH
1. Find the `bin` directory under your MongoDB installation
  The default path is `C:\Program Files\MongoDB\Server\{{versions.recommended.mongo}}\bin`
2. Type PATH into the Start Menu search bar
3. Open **Edit environment variables for your account**
4. Under **User variable for [your username]**, click on `Path`
5. Click the **Edit...** button
6. Click the **New** button on the right
7. Type or paste in the full path to the `bin` directory

#### Configure a service for the `mongod` server

1. Open an administrator command prompt

2. Create two directories for your database and log files. We'll use `C:\MongoDB\data\db` and `C:\MongoDB\logs`

3. Create a config file (`{{mongo.config}}`) defining those paths
    <code><pre>systemLog:
    destination: file
    path: C:\MongoDB\logs\mongod.log
storage:
    dbPath: C:\MongoDB\data\db</pre></code>

4. Install the MongoDB service
 <code><pre>mongod.exe --config "{{mongo.config}}" --install</pre></code>
