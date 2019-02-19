When installing with the ppa above, the best way to install new nginx configs is to add new files in `/etc/nginx/sites-available` (like `/etc/nginx/sites-available/forum.example.org`). You then must link these files from `sites-available` to `sites-enabled`. 

The following demonstrates a typical series of commands when creating a new nginx config:

```bash
{{commandPrefix}} cd /etc/nginx/sites-available
{{commandPrefix}} sudo nano forum.example.com # config entered into file and saved
{{commandPrefix}} cd ../sites-enabled
{{commandPrefix}} sudo ln -s ../sites-available/forum.example.com
```