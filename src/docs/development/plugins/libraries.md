# Using Third-Party Libraries

Plugins are able to define libraries for use on the client side through use of the `scripts` property in `plugin.json`,
but occasionally, you may want to include a dependent script that you did not write. Oftentimes, these scripts are
written in AMD-style, and can be used by a module loader such as [require.js](//requirejs.org), but NodeBB is unable
to load them because they are not also often defined by name.

You may see errors like this:

`Uncaught Error: Mismatched anonymous define() module ...`

This is a common error with anonymous modules, [as is explained in this help article](http://requirejs.org/docs/errors.html#mismatch).
In a nutshell, because we minify all javascript files defined in `scripts` or `acpScripts`, there is no context left for require.js to
determine where a file is in relation to where it is called from.

In NodeBB, you'll want to use the `modules` property in `plugin.json` to properly name these modules so they can be referenced and linked properly:

**plugin.json**

```
{
	...
	"modules": {
		"jquery.js": "/path/to/jquery.js"
	},
	...
}
```

From your client-side scripts, you can then load the jQuery module via require.js as follows:

```
require(['jquery'], function ($) {
	$('.someClass').addClass('someotherclass');
});
```

Keep in mind this is a contrived example, as jQuery is already available globally in NodeBB.
