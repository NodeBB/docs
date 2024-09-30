# Content Discovery

A forum that can communicate over ActivityPub can theoretically communicate with a wider universe of content (also known as the _fediverse_).

However, new entrants to the fediverse often remark that it is "quiet", or that they are not receiving content. This is by design, and is one of the trademarks that sets the fediverse apart from centralized social media platforms like Facebook, X, etc.

Considering that — as of writing — there are over 8 billion people in the world, if we were to see every piece of content shared by everybody, you would be very much overwhelmed! Finding out how to tame that firehose is a problem that many social networks attempt to tackle.

Many incumbent social networks take that incoming stream of content (or "firehose") and parse it for sentiment and association. It uses that information against their own collective knowledge of you as a person to serve you content you want to view. It is a very effective strategy, but one that is very resource intensive and privacy invading.

ActivityPub by-design encourages a relationship-based spread of content. You need to follow other people in order to receive their content, and other people need to follow you in order to receive your content.

The best analogy is a chain of islands, each island representing a separate website. Each website can build bridges (ActvityPub) with other islands, and they become connected. New installations do not have any known associations, and so its reach is limited. You are an island with no bridges yet!

There are a couple of tried-and-true methods to build these connections.

## Follow often and follow lots

As indicated prior, ActivityPub is built upon the follow relationships of its users. Therefore if you want to see lots of content, follow people that interest you in order to see more content from them.

In addition to seeing their content, following a user also exposes you to content **shared** by that followed user, meaning that a *linear* increase in follow relationships may expose you to *exponentially* more content.

## Manual content discovery

If you discover content on another site that you would like to interact with, you can instruct NodeBB to *pull* that content in.

Take the URL of the piece of content and paste it into the NodeBB search bar. NodeBB will then attempt to pull it in using ActivityPub and generate a topic and automatically slot in into [Uncategorized](../development/plugins/uncategorized.md).

From there, you can reply, upvote, etc. — you can also move that topic to one of your local categories.

## Relays

**NodeBB does not support relays at this time**.

Some fediverse software can be set up so that there is a two-way exchange of all known content, even if there is no specific user-follow relation between them. This setup allows for a forum to be quickly connected to a larger network, but does not guarantee the quality of the incoming content.