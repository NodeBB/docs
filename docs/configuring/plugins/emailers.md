# Emailer Plugins

NodeBB will elect to send mail via the local mail service installed on the server if possible. If you are not receiving emails, then it may be a result of the mail service not being installed or configured, or that the receiving mail server has rejected it as it may have been classified as spam.

We recommend utilising third-party emailer systems as they have been sending out emails for much longer than your server, and have built a reputation that you can utilise to ensure that emails you send end up in the inboxes of your recipients.

Any plugins that begin with "nodebb-plugin-emailer" are emailer plugins that override the default behaviour of NodeBB and send mail through the plugin's service. For example, `nodebb-plugin-emailer-sendgrid` will allow you to send emails via the [SendGrid](//sendgrid.com) service.

You can find these plugins available for install in the "Extend -> Plugins" page. In nearly all cases, after installation, activation, and a NodeBB restart, you will need to enter the plugin's configuration page to enter some sort of API key before it will send emails.