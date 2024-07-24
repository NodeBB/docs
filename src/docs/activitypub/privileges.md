Fine-grained privileges are available for all NodeBB categories, allowing for user actions such as upvotes, replies, and even viewership access to be gated to certain user groups.

Likewise, fine-grained control over federation is available at the category-level, and is exposed as the "fediverse" pseudo-group in each category's privilege table.

The "fediverse" pseudo-group is a catch-all that encompasses all remote users, and the privileges available dictate whether received activities from the fediverse are accepted by NodeBB. The privileges are self-explanatory (e.g. "Edit Posts" privilege governs whether remote users are allowed to update their posts.), but several have additional effects or whose effects are not immediately apparent.

These effects are listed below:

* Global
	* View Users (`view:users`)
		* Whether a remote user can retrieve a local user's profile
		* *N.B. "guests" will also need the `view:users` privilege for profiles to be retrievable via the fediverse*
* Per category
	* Find Category (`find`)
		* Whether a category can be retrieved via the fediverse
	* Access Category (`read`)
		* Whether a category can be followed by a remote user
	* Access Topics (`topics:read`)
		* Also controls whether local replies are federated out
	* Create Topics (`topics:create`)
		* Whether a remote user can create a topic in that category by mentioning it
