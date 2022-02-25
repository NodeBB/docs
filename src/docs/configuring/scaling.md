Scaling NodeBB
==============

When it comes to maintaining many concurrent connections or high view
rates, there are certain procedures that can be followed in order to
streamline NodeBB.

This article attempts to outline the various strategies that can be
employed by those finding that NodeBB is not running as fast as it
should under full load.

Use a proxy server to serve static assets
-----------------------------------------

Nginx is exceedingly good at serving static resources (e.g. javascript,
css, images, etc). By allowing Nginx to take over the task of serving
this to the end user, the NodeBB process(es) will be left to handle only
the API calls, which substantially lowers the amount of work for NodeBB
(and increases your throughput).

Your Nginx config will need to be modified add the following `location`
blocks:

    location @nodebb {
        proxy_pass http://127.0.0.1:4567;
    }

    location ~ ^/assets/(.*) {
        root /path/to/nodebb/;
        try_files /build/public/$1 /public/$1 @nodebb;
    }

    location / {
        proxy_pass http://127.0.0.1:4567;
    }

Furthermore, you can instruct Nginx to serve these assets compressed:

    gzip            on;
    gzip_min_length 1000;
    gzip_proxied    off;
    gzip_types      text/plain application/xml text/javascript application/javascript application/x-javascript text/css application/json;

Utilise clustering
------------------

By default, NodeBB will run on one process, and certain calls may take
longer than others, resulting in a lag or queue for the same resources.
To combat this, you can instruct NodeBB to run on multiple processes by
adding the `port` property into your `config.json`:

    {
        "port": ["4567", "4568", "4569"]  // will start three processes
    }

Keep in mind you need to start nodebb with `node loader.js` or
`./nodebb start` so that 3 workers can be spawned. Using `node app.js` will
only use the first port in the array.

A proxy server like Nginx is required in order to load balance requests
between all of the servers. Add an `upstream` block to your config:

    upstream io_nodes {
        ip_hash;
        server 127.0.0.1:4567;
        server 127.0.0.1:4568;
        server 127.0.0.1:4569;
    }

... and alter the `proxy_pass` directive in your `location /` block to read: `proxy_pass http://io_nodes;`

Sample Nginx configuration with all of the above applied
--------------------------------------------------------

    upstream io_nodes {
        ip_hash;
        server 127.0.0.1:4567;
        server 127.0.0.1:4568;
        server 127.0.0.1:4569;
    }

    server {
        listen 80;

        server_name community.nodebb.org;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_redirect off;

        # Socket.io Support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        gzip            on;
        gzip_min_length 1000;
        gzip_proxied    off;
        gzip_types      text/plain application/xml text/javascript application/javascript application/x-javascript text/css application/json;

        location @nodebb {
            proxy_pass http://io_nodes;
        }

        location ~ ^/assets/(.*) {
            root /path/to/nodebb/;
            try_files /build/public/$1 /public/$1 @nodebb;
        }

        location / {
            proxy_pass http://io_nodes;
        }
    }

Configure Redis
---------------

When you setup NodeBB to use more than one process, Redis needs to be configured alongside your primary data store. Each NodeBB process can communicate with the others through Redis pub-sub. Install Redis on your server and add a `redis` block to your config.json. A sample `config.json` that uses mongodb as datastore and Redis for pubsub looks like this.

    {
        "url": "http://example.org",
        "secret": "your-secret-goes-here",
        "database": "mongo",
        "port": [4567, 4568,4569],
        "mongo": {
            "host": "127.0.0.1",
            "port": "27017",
            "database": "0"
        },
        "redis": {
            "host":"127.0.0.1",
            "port":"6379",
            "database": 0
        }
    }

When configured like so, Redis will also be used as the session store. Outside of user session data and message passing between processes, no other data is stored on Redis, and so it is not necessary that it be backed up. If the database is lost, then existing user sessions will no longer be valid, and users will have to log in again.

## Handling Duplicate Digests, etc.

By default, each NodeBB instance assumes it is acting alone and runs scheduled jobs such as pruning notifications and sending out email digests. NodeBB will know if it is part of a local fleet (that is, if NodeBB is running on multiple ports as configured in `config.json`) and act accordingly, but if it is part of a horizontally scaled setup, it won't proactively communicate with its neighbours and elect a primary server.

In that event, all but one server should have its `config.json` updated to contain an additional config property: `jobsDisabled`. When set to `true`, it will disable these jobs, and so they will only be run on the one server.

**Note**: If your setup consists of multiple machines each running a single instance of NodeBB (one port), then you will also need to set `isCluster` to `true`.

For more information, see [our article on `config.json`](/configuring/config).