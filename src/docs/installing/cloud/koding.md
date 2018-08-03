Koding
======

**Note**: Installations to Koding requires a free account on Koding.com.
(This guide has been changed to reflect the changes to Koding.com as of
September 2014)

1.  Create an account or log in to [Koding.com](http://koding.com)
1.  Click the Green Icon at the top that looks like `>_`
1.  You will see your VM with Off to the right in red letters, click
    this, to power on your VM
1.  Click it again when it says Ready.
1.  You should now be inside a terminal window. The installation
    instructions are close to Ubuntu's, but vary slightly, as certain
    packages are already installed.
1.  Firstly, we need to make sure we're up to date -
    `sudo apt-get update && sudo apt-get upgrade`
1.  Enter your password you used to sign up, if you signed up using
    Github or another 3rd party, you will need to set one in your
    Account Settings. Then come back.
1.  Now run the following
    `sudo apt-get install python-software-properties python g++ make`
1.  Now we install NodeBBs other dependencies -
    `sudo apt-get install redis-server imagemagick`
1. Next, we clone NodeBB into a NodeBB folder -
    `git clone -b v1.10.x https://github.com/NodeBB/NodeBB.git nodebb`
    (Optional: Replace nodebb at the end if you want the folder to be a
    different name)
1. Now enter the NodeBB folder - `cd nodebb` (unless you changed the
    foldername in the previous step, if you somehow forgot what you
    called it, run `ls` to see the name of the folder)
1. Set up nodebb using - `./nodebb setup`
1. The first setup question will ask for the domain name, this will
    vary, do not use localhost. Your domain name/Access URI is found on
    the left sidepanel by clicking the small icon to the right of your
    koding-vm-ID underneath VMS (it's a circle with 3 dots inside).
1. Complete the setup (defaults after the domain name are fine to
    accept, so press enter a few times until you get to "Create an
    Admin"
1. Create an Admin Username and password etc, it will then create
    categories and other things that make NodeBB awesome.
1. Now we can start NodeBB - `./nodebb start`
1. Open another tab in your browser of choice and navigate to
    `http://{uniqueID}.{yourkodingusername}.kd.io:451. (assuming you
    didn't change the port number during setup)
1. You will see a screen to continue to your page, click the link about
    half way down to continue to your site.

Congratulations, you've successfully installed NodeBB on Koding.com

If these instructions are unclear or if you run into trouble, please let
us know by [filing an issue](https://github.com/NodeBB/NodeBB/issues).
(Be sure to mention @a5mith in your issue, as I wrote the guide)

Some issues with running on Koding
---------------------

As Koding is free, it does come with some nuances to a regular cloud
host:

1.  Your VM will switch off after 1. minutes of inactivity. This doesn't
    mean the website unfortunately, but your Terminal Window (You can
    bypass this by keeping the terminal window open and running `ls`
    before your VM shuts down, alternatively, pay for the service and it
    will remain on)
1.  It can be temperamental, sometimes you may receive "Your VM is
    unavailable, try again later", you can try logging out and back in,
    refreshing your page, or filing an issue with their support team.
1.  Koding.com uses Ubuntu 14.1. to host your VM, so a basic knowledge
    of Ubuntu would always help.

