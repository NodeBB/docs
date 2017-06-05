# Configuring Apache v2.2.x as a reverse proxy to NodeBB

Prerequisites:
  * `build-essential`
  * `automake`
  * `libtool`
  * [You can install these packages via `apt`](https://help.ubuntu.com/community/AptGet/Howto#Installation_commands)

You need to manually compile and add the module `mod_proxy_wstunnel` to the Apache 2.2 branch.
If you're running Ubuntu (prior to 14.04) or Debian, you're likely on the 2.2 branch of code.

### [Please use this guide to backport the `mod_proxy_wstunnel` module into the 2.2 code base of Apache](http://www.amoss.me.uk/2013/06/apache-2-2-websocket-proxying-ubuntu-mod\_proxy\_wstunnel/)

*Note: On ubuntu, if you’re missing the ./configure file, you need to first run `./buildconf`. After this is complete, you will then be able to use `./configure`.
