Configuring a node.js reverse proxy
============================

In this tutorial we will create a reverse proxy https server complete
with proxy rules, websockets, and TLS. This will allow multiple node
applications to share the same domain, so that you can run NodeBB on a
specific path (IE /forum) and another node application on another path.

## Requirements

-   NodeBB installation
-   Node.js v5.0
-   The following npm packages installed using the command: npm install PACKAGE\_NAME\_HERE --save
    -   http-proxy-rules
    -   express
    -   http-proxy

### Include packages

Create a node.js app with the following code

``` js
var https = require('https');
var httpProxy = require('http-proxy');
var express = require('express');
var HttpProxyRules = require('http-proxy-rules');
```

#### Define proxy rules and create proxy

Change these proxy rules to suit your needs. These rules will determine
where traffic is proxied to based on the url path. In this example we
assume you have an instance of NodeBB running on the default port

``` js
var proxyRules = new HttpProxyRules({
    rules: {
        '.*/docs': 'http://localhost:8081', // Rule (1) docs, about, etc
        '.*/docs/*': 'http://localhost:8081',
        '.*/about': 'http://localhost:8081',
        '.*/press': 'http://localhost:8081',
        '.*/jobs': 'http://localhost:8081',
        '.*/developers': 'http://localhost:8081',

        '.*/forum': 'http://localhost:4567/forum', // Rule (2) forums
        '.*/forum/*': 'http://localhost:4567/forum', 
        '/forum/*': 'http://localhost:4567/forum',
        './forum/*': 'http://localhost:4567/forum',
        '/forum': 'http://localhost:4567/forum' 
    },
    default: 'http://localhost:8081' // default target, will be landing page
});
var proxy = httpProxy.createProxy();
```

#### Change url in NodeBB config.json

Suffix the path you set in the proxy rules onto the default NodeBB url
in the config.json file in your NodeBB directory. In this example, the
path was /forum, so the URL becomes: .. code:: javascript
<http://localhost:4567/forum>

#### Create the web server and call the proxy

First create the express.js app

``` js
var express = require('express');
var bodyParser = require('body-parser')
var mainapp = express();
mainapp.use(function(req,res,next){
    try{
        if (req.url.substr(0, 18).indexOf("socket.io")>-1){
            //console.log("SOCKET.IO", req.url)
            return proxy.web(req, res, { target: 'wss://localhost:4567', ws: true }, function(e) { 
            //console.log('PROXY ERR',e)
            });
        } else {
            var target = proxyRules.match(req);
            if (target) {
                //console.log("TARGET", target, req.url)
                return proxy.web(req, res, {
                    target: target
                }, function(e) { 
                //console.log('PROXY ERR',e)
                });
            } else {
                res.sendStatus(404);
            }
        }
    } catch(e){
        res.sendStatus(500);
    }
});
mainapp.use(bodyParser.json());
mainapp.use(bodyParser.urlencoded({ extended: false }));
```

Then put the code to start the web server, and put your HTTPS options in
the options variable. (see node docs for more info about HTTPS)

Change the port (4433) to your port.

``` js
var options = {/*Put your TLS options here.*/};

var mainserver = https.createServer(options, mainapp);
mainserver.listen(4433);
mainserver.on('listening', onListening);
mainserver.on('error', function (error, req, res) {
    var json;
    console.log('proxy error', error);
    if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
    }

    json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
});
```

Thats it. Start up the proxy server, start up NodeBB, and start up your
second server on port 8081 (or whichever port you chose)
