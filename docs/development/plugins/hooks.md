# Available Hooks

The following is a list of all hooks present in NodeBB. This list is
intended to guide developers who are looking to write plugins for
NodeBB. For more information, please consult
Writing Plugins for NodeBB &lt;create&gt;.

There are three types of hooks, **filters**, **actions**, and **static** hooks.

* Filters take an input (provided as a single argument), parse it in some way, and return the changed value.
* Actions take multiple inputs, and execute actions based on the inputs received. Actions do not return anything.
* Static hooks are similar to action hooks, except NodeBB will wait for the hook to complete (by calling its passed-in callback) before continuing.

Please consult the list of hooks [here](https://github.com/NodeBB/NodeBB/wiki/Hooks/).
