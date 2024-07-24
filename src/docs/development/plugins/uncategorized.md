# Uncategorized (`cid -1`)

`Availability: >4.0.0`

When categories are created, they are assigned a numeric category id (or `cid`). NodeBB's initial setup populates four categories, which take up cids 1 through 4.

Additionally, there is a pseudo-category present in the UI with the cid `-1`. This is the "uncategorized" pseudo-category that does not strictly exist in the database as an editable category.

## How it is used

It is used by the ActivityPub integration to automatically slot received content that was not addressed to a specific category. Due to its rather free-for-all nature, content in cid `-1` is also subject to regular pruning.

## How it can be used

There is no restriction on the usage of cid `-1`. You may post topics into that category just like any other; by passing in `-1` to the `cid` property when calling `api.topics.create`.

*N.B. As content pruning only applies to topics with no engagement from local users, any topics created by local users are automatically exempt from pruning.*

This can be a useful construct for plugins that wish to take advantage of the pre-existing structure of topics and posts, without having to create their own data structures from scratch.

For example, a plugin exposing the capability for users to self-journal could utilise the existing internal API and post journal entries (aka topics) into cid `-1`. In that scenario, the only thing required would be to maintain a list of journal entries (tids) by user, as opposed to building out the entire model and controller for saving journal entries into the database.