Configuring a node.js reverse proxy
===================================

In this tutorial we will create a simple reverse proxy https server 
that proxies requests to the /forum path of an https server to
the /forum path of a nodebb server running at http://localhost:4567

### Requirements

- NodeBB installation
- Node.js v5.0
- The following npm packages installed using the command: npm install PACKAGE\_NAME\_HERE --save
  - express 
  - http-proxy-middleware or https-proxy

### 

### Example server source code

Here is the complete server source code. You can run it using something like ```node server.js```. You will need to start nodebb separately, but only after you've modified config.json - see below.

```js
const express = require("express");
const fs = require("fs");
const https = require("https");

const {createProxyMiddleware} = require("http-proxy-middleware");

function main() {

    const app = express();

    // This is the line that sets up the actual proxy.
    // Note: the {xfwd: true} option here is very important!
    app.use("/forum", createProxyMiddleware("http://localhost:4567", {
        xfwd: true
    }));

    // Otherwise not found.
    app.use((req, res) => {
        res.statusCode = 404;
        res.end("Not found");
    });

    const serverOpts = {
      key: fs.readFileSync("/etc/letsencrypt/live/example.com/privkey.pem"),
      cert: fs.readFileSync("/etc/letsencrypt/live/example.com/fullchain.pem")
    };

    https.createServer(serverOpts, app).listen(443);
}

main();
```

### Modifying NodeBB config.json

You will also need to modify the config.json file in the nodebb directory. The following  is just an example, your config will differ depending on DB used, "secret", "url" etc.

The important thing to get right here is the "url" property. This should be the url of the forum at your server (including path), and is the url users will type into their browsers to visit your forum.

```json
{
    "url": "https://example.com/forum",
    "secret": "...etc...",
    "database": "mongo",
    "mongo": {
        "host": "127.0.0.1",
        "port": 27017,
        "username": "...etc...",
        "password": "...etc...",
        "database": "nodebb",
        "uri": "mongodb://localhost:27017/nodebb"
    }
}
```

### Proxying without express

If you are not using express, it's also possible to use the http-proxy module alone.

Here is an example of proxying without express:

```js
const https = require("https");
const httpProxy = require("http-proxy"); 
const fs = require("fs");

function main() {

    const serverOpts = {
      key: fs.readFileSync("/etc/letsencrypt/live/example.com/privkey.pem"),
      cert: fs.readFileSync("/etc/letsencrypt/live/example.com/fullchain.pem")
    };

    proxy = httpProxy.createProxyServer();

    const server = https.createServer(serverOpts, (req, res) => {
        if(req.url === "/forum" || req.url.startsWith("/forum/")) {
            // Note: the {xfwd: true} option here is very important!
            // Also, make sure to provide an error handler or you'll get an unhandled exception
            return proxy.web(req, res, {
                    target: "http://localhost:4567",
                    xfwd: true
                }, (err) => {
                console.log("### Proxy error:", err);
            });
        }
        res.statusCode = 404;
        res.end("### Not found");

    });

    server.listen(443);
}

main();
```

### Trouble shooting

The problem you're mostly to run into is "Invalid CSRF Token" which appears to be related to session cookies.

The primary causes of this seem to be:

* Incorrect "url" in config.json - double check your config.json

* Missing X-Forward headers - make sure you've got the {xfwd: true} option set in your proxy.

* Problems with cookieDomain - search nodebb forums!

One thing you can try that helped me out is comparing the success or otherwise of network connections (you can view these in the browser F12 debug console) when visiting the nodebb server directly vs over a proxy.

To run nodebb directly over https, you'll need to add the following lines to config.json:

```json
    "ssl": {
        "key": "/etc/letsencrypt/live/example.com/privkey.pem",
        "cert": "/etc/letsencrypt/live/example.com/fullchain.pem"
    },
    "port": 443
```

You will probably also need to add the port to your "url", eg:

```json
    "url": "https://example.com:443/forum"
```

Good luck!
