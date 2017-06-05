Koding
======

**Note**: Installations to Koding requires a free account on Koding.com.
(This guide has been changed to reflect the changes to Koding.com as of
September 2014)

1.  Create an account or log in to [Koding.com](http://koding.com)
2.  Click the Green Icon at the top that looks like `>_`
3.  You will see your VM with Off to the right in red letters, click
    this, to power on your VM
4.  Click it again when it says Ready.
5.  You should now be inside a terminal window. The installation
    instructions are close to Ubuntu's, but vary slightly, as certain
    packages are already installed.
6.  Firstly, we need to make sure we're up to date -
    `sudo apt-get update && sudo apt-get upgrade`
7.  Enter your password you used to sign up, if you signed up using
    Github or another 3rd party, you will need to set one in your
    Account Settings. Then come back.
8.  Now run the following
    `sudo apt-get install python-software-properties python g++ make`
9.  Now we install NodeBBs other dependencies -
    `sudo apt-get install redis-server imagemagick`
10. Next, we clone NodeBB into a NodeBB folder -
    `git clone -b v1.5.x https://github.com/NodeBB/NodeBB.git nodebb`
    (Optional: Replace nodebb at the end if you want the folder to be a
    different name)
11. Now enter the NodeBB folder - `cd nodebb` (unless you changed the
    foldername in the previous step, if you somehow forgot what you
    called it, run `ls` to see the name of the folder)
12. Now we install all the dependencies of NodeBB - `npm install` (could
    take a minute or two)
13. Set up nodebb using - `./nodebb setup`
14. The first setup question will ask for the domain name, this will
    vary, do not use localhost. Your domain name/Access URI is found on
    the left sidepanel by clicking the small icon to the right of your
    koding-vm-ID underneath VMS (it's a circle with 3 dots inside).
15. Complete the setup (defaults after the domain name are fine to
    accept, so press enter a few times until you get to "Create an
    Admin"
16. Create an Admin Username and password etc, it will then create
    categories and other things that make NodeBB awesome.
17. Now we can start NodeBB - `./nodebb start`
18. Open another tab in your browser of choice and navigate to
    `http://{uniqueID}.{yourkodingusername}.kd.io:4567` (assuming you
    didn't change the port number during setup)
19. You will see a screen to continue to your page, click the link about
    half way down to continue to your site.

Congratulations, you've successfully installed NodeBB on Koding.com

If these instructions are unclear or if you run into trouble, please let
us know by [filing an issue](https://github.com/NodeBB/NodeBB/issues).
(Be sure to mention @a5mith in your issue, as I wrote the guide)

Some issues with running on Koding
---------------------

As Koding is free, it does come with some nuances to a regular cloud
host:

1.  Your VM will switch off after 60 minutes of inactivity. This doesn't
    mean the website unfortunately, but your Terminal Window (You can
    bypass this by keeping the terminal window open and running `ls`
    before your VM shuts down, alternatively, pay for the service and it
    will remain on)
2.  It can be temperamental, sometimes you may receive "Your VM is
    unavailable, try again later", you can try logging out and back in,
    refreshing your page, or filing an issue with their support team.
3.  Koding.com uses Ubuntu 14.04 to host your VM, so a basic knowledge
    of Ubuntu would always help.

