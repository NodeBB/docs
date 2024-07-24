Configuring Apache as a proxy
=============================

NodeBB by default runs on port 4567, meaning that builds are usually accessed using a port number in addition to their hostname (e.g. http://example.com:4567)

In order to allow NodeBB to be served without a port, Apache can be set up to proxy all requests to a particular hostname (or subdomain) to an upstream NodeBB build running on any port.

Requirements
----------------------------

**Note**: This requires Apache v2.4.x or greater. If your version of Apache is older, please see [Apache v2.2.x Instructions](./apache2.2.md)

You have to enable the following Apache mods:

1.  `sudo a2enmod proxy`
2.  `sudo a2enmod proxy_http`
3.  `sudo a2enmod proxy_wstunnel`
4.  `sudo a2enmod rewrite`
5.  `sudo a2enmod headers`

Configuration
------------------------

The next step is creating a configuration file, typically named after your site (e.g. `www.example.com.conf`), in the Apache vhost
config directory, usually found at `/etc/apache2/sites-available/`. Make sure to match servername to the URL field defined in the `config.json`.

Below is a minimal Apache virtualhost configuration for NodeBB running on port `4567`.

``` apache
<VirtualHost *:80>
    ServerName www.example.com
    RequestHeader set X-Forwarded-Proto "http"

    ProxyRequests off
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>

    RewriteEngine On
    RewriteCond %{REQUEST_URI}  ^/socket.io            [NC]
    RewriteCond %{QUERY_STRING} transport=websocket    [NC]
    RewriteRule /(.*)           ws://127.0.0.1:4567/$1 [P,L]

    ProxyPass / http://127.0.0.1:4567/
    ProxyPassReverse / http://127.0.0.1:4567/
</VirtualHost>
```

This is a more advanced Apache virtualhost configuration which uses TLS, HTTP/2, static file cache headers
and redirects http traffic **permanently** to HTTPS!

```apache
<VirtualHost *:80>
    ServerName www.example.com
    ServerAlias example.com

    # Rewrite any http traffic to the main url https site
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteRule ^[^\/]*\/(.*) https://www.example.com/$1 [R=301,L]
    </IfModule>
</VirtualHost>

<VirtualHost *:443>
    Protocols h2 http/1.1
    ServerName www.example.com

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/privkey.pem
    SSLCertificateChainFile /path/to/chain.pem

    # Basic security headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Xss-Protection "1; mode=block"

    # NodeBB header
    RequestHeader set X-Forwarded-Proto "https"

    # Static file cache
    <FilesMatch "\.(ico|jpg|jpeg|png|gif|js|css)$">
        <IfModule mod_expires.c>
            ExpiresActive on
            ExpiresDefault "access plus 14 days"
            Header set Cache-Control "public"
        </IfModule>
    </FilesMatch>

    ProxyRequests off
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>

    # Custom Error Document when NodeBB is offline
    ProxyPass /error-documents !
    ErrorDocument 503 /error-documents/503.html
    Alias /error-documents /path/to/nodebb/public

    # Websocket passthrough
    RewriteEngine On
    RewriteCond %{REQUEST_URI}  ^/socket.io            [NC]
    RewriteCond %{QUERY_STRING} transport=websocket    [NC]
    RewriteRule /(.*)           ws://localhost:4567/$1 [P,L]

    ProxyPass / http://localhost:4567/
    ProxyPassReverse / http://localhost:4567/

    # Log stuff
    ErrorLog ${APACHE_LOG_DIR}/www-example-error.log
    CustomLog ${APACHE_LOG_DIR}/www-example-access.log combined
</VirtualHost>

```

Configuring Apache to use a custom error page
============================

This example will demonstrate how to configure Apache to use a custom 503
error page when your forum isn't running.

## Create your custom error page

You can create your own `503.html` or you use the one included with your NodeBB installation. To make your own create a
new file `503.html` and place it in a subfolder of your NodeBB public folder `/path/to/nodebb/public/error-documents`.
If you want to use the one included with NodeBB, copy the `503.html` from the `public` folder to the subfolder mentioned above.

Be sure to add content to your `503_custom.html` file. Here's an example which you
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

## Configure Apache to use your custom error page

We now need to tell Apache to use our page when the relevant error
occurs. Open your vhost file `/etc/apache2/sites-available/www.example.com.conf`.

Add this to your active virtual host section and change the paths accordingly.

```
    ProxyPass /error-documents !
    ErrorDocument 503 /error-documents/503.html
    Alias /error-documents /var/www/nodebb/nodebb/public/error-documents
```

The `Alias` directive is used so that it can be easier excluded from the ProxyPasss directive.

Reload Apache `sudo service apache2 reload` and the next time a user
visits your forum when it isn't running, they'll see your custom page.
