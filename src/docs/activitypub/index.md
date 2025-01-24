***Important Note**: Federation is currently only available in pre-release versions of NodeBB v4.*

Technical details on enabling federation [can be found here](./prerelease.md).

----

`Availability: >4.0.0`

"Federation", used in a technical sense, is the ability for a software to interact with others outside of its own domain. NodeBB is working towards federation in version 4 by adopting the ActivityPub protocol.

## What is ActivityPub?

ActivityPub is a standardized protocol that allows software — like NodeBB — to communicate with other ActivityPub enabled software. This exchange could take place between two separate NodeBB instances, or even with non-forum software, such as microblogging networks, bookmarking apps, or image-based feed scrollers.

If enabled, your NodeBB installation would become part of a larger decentralized social network; a federated universe, or _fediverse_.

[More information about ActivityPub](https://activitypub.rocks/).

## Upgrading to v4

When coming from a version of NodeBB lesser than v4.0.0, your installation will automatically run several upgrade scripts; one of those scripts will **intentionally disable** ActivityPub integration so as to not surprise administrators of existing installations.  (See "Enabling Federation", below.)

Once enabled, pre-existing categories will not federate out-of-the-box. You will need to modify their privileges so that the "fediverse" pseudo-user is granted viewing and posting privileges on a per-category basis.

*N.B. New installations of NodeBB v4+ will have ActivityPub enabled, and all categories will federate by default.*

## Enabling Federation

ActivityPub integration is controlled via a global toggle switch in the admin panel (`ACP > Settings > Federation`).

### Additional Settings

A list of additional settings available for tweaking the ActivityPub integration can be found [here](./settings.md).

## How is NodeBB different from other apps on the fediverse?

By some margin, the largest ActivityPub implementor is [Mastodon](https://joinmastodon.org/), a micro-blogging platform (similar to Twitter/X.) Other notable apps include, but are not limited to, [WordPress](https://wordpress.org/plugins/activitypub/) and [Ghost](https://activitypub.ghost.org/) (both blogs), [Pixelfed](//pixelfed.org) (media-focused feed, like Instagram), and [Threads](//threads.net) (micro-blogging platform by Meta.)

All of those examples present and organize their content in a different manner, but via ActivityPub, content can be exchanged seamlessly between them.

NodeBB belongs to a subset of ActivityPub implementors who structure their content in topics (or threads). A forum-style presentation of content allows for topics to be organized logically, which is a departure from the somewhat ephemeral nature of social networks found today.

Typically, content is also presented in chronological order (or reverse so when listing topics). This presents a recency bias for content, but also allows for more algorithmic-free discovery of new content. As topics receive replies, they are bumped up to the top of the list, allowing others to re-discover the content.

Additionally, NodeBB contains strong tooling for local community building. Not all categories need be federated, and some can be kept within the local community for more focused discussion.

## Discovering Content

When first enabled, it may seem as though there is not much remote content to view, or even none at all. This lack of content is due to ActivityPub being a "follow-based" protocol. Content is streamed to you in real-time from your followers, and vice versa. Unlike traditional social media, there is no centralized authority to artificially boost your content for viewership purposes, or to expose you to new content.

Remote users can be discovered by using the search bar. Enter the handle of a remote user (e.g. `julian@community.nodebb.org`) to see their profile and follow them!

For more information, see the [Discovery](./discovery.md) page.

## The "Uncategorized" category

NodeBB v4 introduces a new (albeit oddly named) pseudo-category called "Uncategorized". This category is a catch-all bucket for remote content, and content pruning logic works only on topics contained in this pseudo-category.

[More information on the "Uncategorized" pseudo-category](../development/plugins/uncategorized.md).

## Privileges

Fine-grained control over how content from the fediverse ("remote content") is handled can be adjusted using the existing privilege tooling at ACP > Manage > Privileges.

For more information, see the [privileges](./privileges.md) page.