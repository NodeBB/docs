The settings page for ActivityPub integration can be reached in the administration panel:

**ACP > Settings > Federation (ActivityPub)**

## General

* "Enable Federation"
    * This is the global toggle that controls whether NodeBB federates at all. Use this toggle as a convenience switch to enable or disable federation completely.
* "Allow loopback processing"
    * This setting allows the NodeBB installation to make ActivityPub calls to itself. It is purely used for development and debugging and should be left disabled in production.

## Content Pruning

The fediverse is large — that's probably an understatement! As more and more content streams into NodeBB from the fediverse, the database will grow in size. Content streams in at all hours of the day, and it is very likely that of the content received by NodeBB, only a miniscule fraction would be read by your users.

It is important to understand that it is not your responsibility to catalog the entire fediverse, and there is absolutely no expectation that you keep everything you receive in perpetuity. The remote content received is best thought of as transient, and can be expunged from the data store as soon as is reasonable.

NodeBB prunes remote content and user profiles on a daily basis, and that caching interval can be adjusted.

* "Days to keep remote content"
    * Topics containing content that has received no "engagement" are automatically pruned after 30 days (default, adjustable)
    * A topic is considered to have engagement if at least one of the posts within has been voted upon, or if a local user has replied to it.
* "Days to keep remote user accounts"
    * A remote user account is automatically pruned after 7 days (default, adjustable).
	* Remote user accounts are pruned if they have not made any posts, and have no follow relationships with local users.

## Filtering

Heavy-handed global filtering options are available here, allowing the administrator to make unilateral decisions about whether to federate with (or allow remote content from) certain domains.

The list can be either a deny-list (default), or an allow-list.