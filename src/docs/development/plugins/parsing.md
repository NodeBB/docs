# Post Parsing

NodeBB is editor-agnostic, meaning that the default composer and markup plugin combination (composer-default and markdown, respectively) can be swapped out if desired.

To achieve this, NodeBB fires a number of hooks that deal with parsing of content.
This article deals with the `filter:parse:post` hook, which is called by `posts.parsePost`.

## Function signature

`parsePosts(post, type)`

* `post` is an object containing post data, typically from a call to `posts.getPostData(pid);`.
    * *N.B. You don't need to send in the entire post object, the minimum set of properties is `pid` and `content`.*
* `type` is a nullable string that hints to plugins what the desired output is. The values are one of the following:
	* `null`/`falsy`, which is automatically passed to plugins as `default`.
	* `default`, html for display in the front-end.
	* `activitypub.note`, html for federation to remote instances (see [Federation](../../activitypub/index.md)); typically a subset of valid html tags are used, such as those related to text formatting.
	* `activitypub.article`, html for federation to remote instances (see [Federation](../../activitypub/index.md)); this type is reserved for future use.
	* `plaintext`, self-explanatory, no html markup intended.
	* `markdown`, markdown for federation to remote instances (see [Federation](../../activitypub/index.md)); in most cases this is the same as the raw content

## Guidance

When your plugin listens to `filter:parse.post`, you should look at the `types` available and consider whether your plugin should respond to each type. While most of thet types are html-related, `plaintext` and `markdown` are the two that need specific handling (or opting out of).

## Examples

1. A plugin expands anchors in the post body into dynamic link previews. It would not make sense to send the complicated HTML (with classes, tables, etc.) to other servers, and there is no markdown equivalent.

	The plugin should listen and act only for the `default`, and do nothing otherwise.

1. A plugin looks for bbcode and converts it to html. Sending simple html to other servers is fine.

	The plugin should execute alternative logic specifically to `plaintext` (excise the bbcode tags) and `markdown` (optionally convert to markdown equivalent), and act normally otherwise.