# Conversational Contexts

ActivityPub supports a number of different activity types, such as [`Question`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-question), [`Listen`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-listen), etc. The most common type of activity encountered is the [`Create`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-create), which is typically paired with the [`Note`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note) object.

All of these activities and objects theoretically could relate to one another, and through these relationships we can build a _conversational context_ (herein referred to as "context").

In NodeBB, these conversational contexts are easily represented as **topics**, which house **posts**.

There are several ways that NodeBB can build a context, listed here in order of preference.

## Resolvable context resolution

[FEP 7888](./fep/7888.md) outlines a set of normative guidances for use of the context property. Specifically, it details the use of the `context` property and how it is a resolvable URL that returns a `Collection`.

When NodeBB encounters an object that refers to a `context`, it will attempt first to resolve the context. If the resolved context contains objects, then all of those objects are parsed and organized into a topic.

[This issue](https://github.com/NodeBB/NodeBB/issues/12695) ([related discussion](https://community.nodebb.org/topic/18184/the-current-state-of-context-resolution)) further outlines the capability of NodeBB to provide and parse a synchronization header so that ActivityPub implementors can easily determine whether their context is up-to-date without needing to traverse all pages of the context collection.

## Reply chain traversal

Most of the other software that NodeBB can communicate with attaches the [`inReplyTo`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-inreplyto) property, which allows for one or more references to be considered a "parent".

If a resolvable context (see above) cannot be found, then NodeBB will fall back to traversing up this reply chain to the root node, in order to build a context. This chain of objects would then be parsed and organized into a topic.

### Deficiencies

1. If one of the objects in the chain no longer resolves (either temporarily or permanently), then the chain is broken, and the root node is unreachable.
1. Reply chain traversal allows you to build a direct line of replies to the root node, but by design omits every other branch of a reply tree. It will almost never represent the entire context.