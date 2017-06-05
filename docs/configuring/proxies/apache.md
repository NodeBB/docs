Configuring apache as a proxy
=============================

**Note**: This requires Apache v2.4.x or greater. If your version of Apache is lower, please see [Apache v2.2.x Instructions](proxies/apache2.2)

Enable the necessary modules
----------------------------

1.  sudo a2enmod proxy
2.  sudo a2enmod proxy\_http
3.  sudo a2enmod proxy\_wstunnel
4.  sudo a2enmod rewrite
5.  sudo a2enmod headers

Add the config to Apache
------------------------

The next step is adding the configuration to your `virtualhost.conf`
file, typically located in `/etc/apache2/sites-available/`. The below
configuration assumes you've used 4567 (default) port for NobeBB
installation. It also assumes you have the bind address set to
127.0.0.1.

``` apache
ProxyRequests off

<Proxy *>
    Order deny,allow
    Allow from all
</Proxy>

# edit the next line if you use https
RequestHeader set X-Forwarded-Proto "http"

RewriteEngine On

RewriteCond %{REQUEST_URI}  ^/socket.io            [NC]
RewriteCond %{QUERY_STRING} transport=websocket    [NC]
RewriteRule /(.*)           ws://127.0.0.1:4567/$1 [P,L]

ProxyPass / http://127.0.0.1:4567/
ProxyPassReverse / http://127.0.0.1:4567/
```

The last thing you need to be sure of is that the `config.json` in the
NodeBB folder defines the node.js port outside of the url:

Example nodebb/config.json
--------------------------

``` json
{
    "url": "http://www.yoursite.com",
    "port": "4567",
    "secret": "55sb254c-62e3-4e23-9407-8655147562763",
    "database": "redis",
    "redis": {
        "host": "127.0.0.1",
        "port": "6379",
        "password": "",
        "database": "0"
    }
}
```

**Change the domain and dont use the secret in the example above.**
