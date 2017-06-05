# ACP / Dashboard

The dashboard shows an at-a-glance overview of your NodeBB, including pageviews collated by time and day, and other interesting metrics such as current active user count and user location.

### System Control

The "Reload", "Restart", and "Maintenance Mode" buttons allow you to administer the running process of NodeBB.

* **Reload** - refreshes all stylesheets, js files, and templates. Clears caches if there are any. The NodeBB server is kept running.
* **Restart** - Brings down the NodeBB server and starts it up again. Refreshes all assets and clears all caches. A restart is recommended if you have activated or deactivated plugins.
* **Maintenace Mode** - Brings you to the maintenance mode page, allowing you to temporarily restrict access to your forum.

### Updates

The updates section queries the NodeBB project for a new version of NodeBB, and determines whether you are up-to-date. There is no requirement to update NodeBB, although it is usually recommended in order to obtain the latest features and bug fixes.

### Notices

The notices allows NodeBB and various plugins to quickly determine if action is required (e.g. if a restart is required).