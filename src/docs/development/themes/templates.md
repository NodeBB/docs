Rendering Engine
================

How it works
------------

Every page has an associated API call, Template file, and Language File.

For example, if you navigate to
[/topic/351/nodebb-wiki](https://community.nodebb.org/topic/351/nodebb-wiki),
the application will load three resources. The API return
[/api/topic/351/nodebb-wiki](http://community.nodebb.org/api/topic/351/nodebb-wiki)
and the [template](https://community.nodebb.org/templates/topic.tpl), in
this example, "topic.tpl", and the appropriate [language
file](https://community.nodebb.org/language/en-GB/topic.json) "topic.json"\*.

Just prepend api/ to the URL's path name to discover the JSON return.
Any value in that return can be utilized in your template.

\*A page's name corresponds to the template and language's filename (ex.
`http://domain.com/topic/xyz` correlates to `topic.tpl`).

Templating Basics
-----------------

Using the API return as your guide, you can utilize any of those values
in your template/logic. Using the above API call as an example, for
anything in the root level of the return you can do something like:

``` html
{topic_name}
```

To access values in objects:

``` html
{privileges.read}
```

And finally you can loop through arrays and create blocks like so:

``` html
{{{ each posts }}}
{posts.content}
{{{ end }}}
```

The above will create X copies of the above block, for each item in the
posts array.

Templating Logic
----------------

NodeBB's templating system implements some basic logic. Using the same
API call as above for our example. You can write IF conditionals like
so:

``` html
{{{ if unreplied }}}
This thread is unreplied!
{{{ end }}}
```

Another example:

``` html
{{{ if !disableSocialButtons }}}
<button>Share on Facebook</button>
{{{ else }}}
Sharing has been disabled.
{{{ end }}}
```

We can check for the length of an array like so:

``` html
{{{ if posts.length }}}
There be some posts
{{{ end }}}
```

While looping through an array, we can check if our current index is the
@first or @last like so:

``` html
{{{ each posts }}}
  {{{ if @first }}}
    <h1>Main Author: {posts.username}</h1>
  {{{ end }}}
  {posts.content}
  {{{ if @last }}}
    End of posts. Click here to scroll to the top.
  {{{ end }}}
{{{ end }}}
```

For more advanced documentation, have a look at the
[bencpressjs](https://github.com/benchpressjs/benchpressjs/tree/master/docs) repository

Exposing template variables to client-side JavaScript
-----------------------------------------------------

There are two ways of letting our JS know about data from the
server-side, apart from WebSockets (TODO: will be covered in a different
article).

### Via jQuery.get

If we require data from a different page we can make a `$.get` call to
any other API call. For example, if we wanted to know more about a
specific user we could make a call like so:

``` js
$.get(config.relative_path + '/api/user/psychobunny', {}, function(user) {
    console.log(user)
});
```

See this API call in action:
<http://community.nodebb.org/api/user/psychobunny>

### Via Template Variables

On every page the data used to render that page is avaiable in `ajaxify.data`
For example on the topic page you can access the topic title with `ajaxify.data.title` or the category id with `ajaxify.data.cid`


Internationalization
--------------------

The template engine interfaces with the internationalization system as
well. We can embed variables into language strings. Let's use [this API
call](http://community.nodebb.org/api/register) as well as this
[language
file](http://community.nodebb.org/language/en-GB/register.json) as an
example. We can now do something like the following:

``` html
[[register:help.username_restrictions, {minimumUsernameLength}, {maximumUsernameLength}]]
```

Which will translate this string:

``` html
A unique username between %1 and %2 characters
```

to

``` html
A unique username between 2 and 16 characters
```

Advanced Topics
---------------

### Dynamically requiring and rendering a template file from client-side
JavaScript

The template engine lazy loads templates on an as-needed basis and
caches them. If your code requires a template or partial on-demand then
you can :

``` js
ajaxify.loadTemplate('myTemplate', function(myTemplate) {
    var html = templates.parse(myTemplate, myData);
});
```

You can also access the invidual blocks inside each template, which is
handy for doing things like (for example) rendering a new post's `<li>`
and dynamically sticking it in an already loaded `<ul>`

``` html
Some stuff here...
{{{ each posts }}}
We just want to pull this block only.
{{{ end }}}
... some stuff here
```

``` js
ajaxify.loadTemplate('myTemplate', function(myTemplate) {
    var block = templates.getBlock(myTemplate, 'posts');
    var html = templates.parse(block, myData);
});
```

### Rendering templates on server-side Node.js

The templating system hooks into Express just like most other templating
frameworks. Just use either `app.render` or `res.render` to parse the
appropriate template.

``` js
res.render('myTemplate', myData);
```

``` js
app.render('myTemplate', myData, function(err, parsedTemplate) {
    console.log(parsedTemplate);
});
```
