Configuring nginx as a proxy
============================

NodeBB by default runs on port `4567`, meaning that builds are usually
accessed using a port number in addition to their hostname (e.g. `http://example.org:4567`)

In order to allow NodeBB to be served without a port, nginx can be set
up to proxy all requests to a particular hostname (or subdomain) to an
upstream NodeBB build running on any port.

## Requirements

* NGINX version v1.3.13 or greater
    * Package managers may not provide a new enough version. To get the latest version, [compile it yourself](http://nginx.org/en/download.html), or if on Ubuntu, use the [NGINX Stable](https://launchpad.net/~nginx/+archive/stable) or [NGINX Development](https://launchpad.net/~nginx/+archive/development) PPA builds, if you are on Debian, use [DotDeb repository](http://www.dotdeb.org/instructions/) to get the latest version of Nginx.
    * To determine your nginx version, execute `nginx -V` in a shell

## Configuration

NGINX-served sites are contained in a `server` block. This block of
options goes in a specific place based on how nginx was installed and
configured:

* `/path/to/nginx/sites-available/*` -- files here must be aliased to
    `../sites-enabled`
* `/path/to/nginx/conf.d/*.conf` -- filenames must end in `.conf`
* `/path/to/nginx/httpd.conf` -- if all else fails

Below is the basic nginx configuration for a NodeBB build running on
port `4567`:

```
server {
    listen 80;

    server_name forum.example.org;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://127.0.0.1:4567;
        proxy_redirect off;

        # Socket.IO Support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Below is another nginx configuration for a NodeBB that has port: `["4567","4568"]` in config.json.

```
server {
    listen 80;

    server_name forum.example.org;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://io_nodes;
        proxy_redirect off;

        # Socket.IO Support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

upstream io_nodes {
    ip_hash;
    server 127.0.0.1:4567;
    server 127.0.0.1:4568;
}
```

Below is an nginx configuration which uses SSL.

```
### redirects http requests to https
server {
    listen 80;
    server_name forum.example.org;

    return 302 https://$server_name$request_uri;
}

### the https server
server {
    # listen on ssl, deliver with speedy if possible
    listen 443 ssl spdy;

    server_name forum.example.org;

    # change these paths!
    ssl_certificate /path/to/cert/bundle.crt;
    ssl_certificate_key /path/to/cert/forum.example.org.key;

    # enables all versions of TLS, but not SSLv2 or 3 which are weak and now deprecated.
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    # disables all weak ciphers
    ssl_ciphers 'AES128+EECDH:AES128+EDH';

    ssl_prefer_server_ciphers on;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://127.0.0.1:4567;
        proxy_redirect off;

        # Socket.IO Support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Notes

* nginx must be on version 1.4.x to properly support websockets. Debian/Ubuntu uses 1.2, although it will work there will be a reduction in functionality.
* The `proxy_pass` IP should be `127.0.0.1` if your NodeBB is hosted on the same physical server as your nginx server. Update the port to match your NodeBB, if necessary.
* This config sets up your nginx server to listen to requests for `forum.example.org`. It doesn't magically route the internet to it, though, so you also have to update your DNS server to send requests for `forum.example.org` to the machine with nginx on it!


Configuring Nginx to use a custom error page
============================

This example will demonstrate how to configure Nginx to use a custom 502
error page when your forum isn't running.

## Create your custom error page

Create a new file `502.html` and place it in the `/usr/share/nginx/html`
directory. This is where Nginx sets its document root by default. Be
sure to add content to your `502.html` file. Here's an example which you
can copy and paste:

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Insert your page title here</title>
    </head>
    <body>
        <p>Insert your content here.</p>
    </body>
</html>
```

## Configure Nginx to use your custom error page

We now need to tell Nginx to use our page when the relevant error
occurs. Open your server block file
`/etc/nginx/sites-available/default`. If you're using a non-default
server block file, be sure to change `default`.

```
server {
    # Config will be here.

    error_page 502 /502.html;

    location = /502.html {
        root /usr/share/nginx/html;
        internal;
    }
}
```

The `error_page` directive is used so that the custom page you created
is served when a 502 error occurs. The location block ensures that the
root matches our file system location and that the file is accessible
only through internal Nginx redirects.

Restart Nginx `sudo service nginx restart` and the next time a user
visits your forum when it isn't running, they'll see your custom page.
