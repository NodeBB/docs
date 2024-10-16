# Public and Private Visibility

ActivityPub has a concept of _addressing_ that is similar to email. There are recipients that activities are sent `to`, and additional recipients can be added in `cc`.

There is also the concept of a "public address" that, when included, signifies that the activity and its object therein is to be considered public. **By and large**, almost all content sent via ActivityPub is considered public.

## Public content

When public content is received by NodeBB, **it is parsed into a post object**, and slotted into an existing topic if available, creating a new topic if not.

NodeBB will attempt to backfill a topic with additional replies if available, and will attempt to traverse up the reply chain otherwise.

If a specific category is mentioned, then the topic will be slotted in that category. Otherwise, it will be [uncategorized](../development/plugins/uncategorized.md) but can be moved at-will by administrators.

## Private content

If the public address is not present in the recipients list, then **NodeBB will parse it into a chat message**, and add it to a room if available, creating a new chat room if not.

When a new chat room is created, its recipients are the individuals addressed in the received activity. Those users are added to the chat room as though they were in the chat.

When messages are sent in that chat room, they are automatically federated out to the members of the chat room. The visibility scope is limited to that of the chat room membership.

For example;

> Alice (@alice@example.org) sends Bob (@bob on NodeBB) a message. As it is not in reply to another message, a new chat room is created that contains both Alice and Bob.

> Bob sends Alice a reply to her message. It is federated out to Alice only.

### Broader scope

When additional members are found in the recipents of a message, they are automatically added to the chat room. New users when added to a chat room are not able to view the existing history of the room, so their view of the conversation begins when they are added.

> Alice (@alice@example.org) replies to Bob (@bob on NodeBB) and also includes Charles (@charles@example.com) in the recipients list. Charles is added to the existing chat room containing Alice and Bob.

### Narrower scope

If a message is received that is addressed to *fewer* recipients, then a new chat is created for security, as the recipients list has changed.

> Charles (@charles@example.com) replies to the earlier message, but addresses the reply only to Bob (@bob on NodeBB). A new chat room is created that contains only Charles and Bob. Future messages in that chat room will not include Alice in the recipients list.

## Additional visibility patterns

Other ActivityPub implementors further divide their visibility levels based on recipient ordering and/or inclusion of the public address in `to` vs `cc`; e.g.

* A message addressed to the public address in `cc` is "unlisted" or "quiet public"
* A message addressed to a follower collection is only sent to the followers of a specific user.

NodeBB does not differentiate between these separate states. Follower collections are ignored, and unlisted/quiet objects are considered fully public posts in NodeBB.