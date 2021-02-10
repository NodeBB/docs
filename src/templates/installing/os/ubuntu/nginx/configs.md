When installing with the ppa above, the best way to install new nginx configs is to add new files in `/etc/nginx/sites-available` (like `/etc/nginx/sites-available/forum.example.org`). You then must link these files from `sites-available` to `sites-enabled`.

The following demonstrates a typical series of commands when creating a new nginx config:

```bash
cd /etc/nginx/sites-available
sudo nano forum.example.com # config entered into file and saved
cd ../sites-enabled
sudo ln -s ../sites-available/forum.example.com
```