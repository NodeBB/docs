NodeBB stores data using different structures based on redis. These are `hashes`, `sets`, `sortedsets` and `lists`.

A hash is comparable to a javascript object, sets are collections of unique values, sorted sets are same as sets but they have an extra score field that lets the values be sorted and lists are similar to an array in JS.

For example each user's data is stored in a hash/document with a unique key in the form `user:<uid>` where uid is the unique id of the user.

To grab the data of user 100 you can run `hgetall user:100` in redis or `db.objects.find({_key: "user:100"})` in mongodb.

Here is the output from mongodb.

```
> db.objects.find({_key:"user:100"}).pretty()
{
        "_id" : ObjectId("555b9afa65190fe2123df8de"),
        "_key" : "user:100",
        "username" : "KwVLmsBU",
        "userslug" : "kwvlmsbu",
        "email" : "KwVLmsBU@nodebb.org",
        "joindate" : 1432066810034,
        "picture" : "https://secure.gravatar.com/avatar/8e43da62c77de95de0a91b306fb9d658?size=128&default=identicon&rating=pg",
        "gravatarpicture" : "https://secure.gravatar.com/avatar/8e43da62c77de95de0a91b306fb9d658?size=128&default=identicon&rating=pg",
        "fullname" : "",
        "location" : "",
        "birthday" : "",
        "website" : "",
        "signature" : "",
        "uploadedpicture" : "",
        "profileviews" : 0,
        "reputation" : 0,
        "postcount" : 0,
        "topiccount" : 0,
        "lastposttime" : 0,
        "banned" : 0,
        "status" : "online",
        "uid" : 100
}
```

The same applies to posts, topics, categories below are example outputs for each respectively.

```
> db.objects.find({_key:"post:20000"}).pretty()
{
        "_id" : ObjectId("5547af3f65190fe2122d0b3c"),
        "_key" : "post:20000",
        "edited" : 0,
        "pid" : 20000,
        "content" : "content of this post",
        "tid" : 2543,
        "timestamp" : 1412304172707,
        "deleted" : 0,
        "editor" : "",
        "uid" : 747,
        "toPid" : 19999,
        "votes" : 0,
        "reputation" : 0
}
```

```
> db.objects.find({_key:"topic:2000"}).pretty()
{
        "_id" : ObjectId("5547ae9d65190fe21227622c"),
        "_key" : "topic:2000",
        "tid" : 2000,
        "uid" : 668,
        "cid" : 2,
        "mainPid" : 15257,
        "title" : "Host Nodebb Free",
        "slug" : "2000/host-nodebb-free",
        "timestamp" : 1405433121145,
        "lastposttime" : 1421334586258,
        "postcount" : 34,
        "viewcount" : 1691,
        "locked" : 0,
        "deleted" : 0,
        "pinned" : 0,
        "teaserPid" : 25995
}
```

```
> db.objects.find({_key:"category:25"}).pretty()
{
        "_id" : ObjectId("55d2c27ed03b9afd5af5e854"),
        "_key" : "category:25",
        "cid" : 25,
        "name" : "sub1",
        "description" : "",
        "icon" : "fa-comments",
        "bgColor" : "#AB4642",
        "color" : "#fff",
        "slug" : "25/sub1",
        "parentCid" : 23,
        "topic_count" : 0,
        "post_count" : 0,
        "disabled" : 0,
        "order" : 1,
        "link" : "",
        "numRecentReplies" : 1,
        "class" : "col-md-3 col-xs-6",
        "imageClass" : "auto"
}
```

Other keys include 

* `global` - contains counts for users, posts, topics and so on
* `config` - contains forum wide config settings
* `settings:<pluginid>` - plugin settings are saved here
* `message:<mid>` - chat messages are saved in these objects
* `notification:<nid>` - notifications are saved in these objects

This lets us store all the forum data, now to retrieve it in a sorted fashion we use sorted sets. You can think of sorted sets as indexes. They have two fields `value` and `score`.

Let's look at a sample `users:postcount` sorted set.

When users are created a hash is created to store their data at `user:<uid>`. After that `postcount` and `uid` gets added to a sorted set called `users:postcount`. `postcount` is used as the score and the `uid` is used as the value. 

This query returns the top posters in the forum.

```
> db.objects.find({_key:"users:postcount"}, {_id: 0}).sort({score: -1}).pretty()
{ "_key" : "users:postcount", "value" : "2", "score" : 4121 }
{ "_key" : "users:postcount", "value" : "970", "score" : 2749 }
{ "_key" : "users:postcount", "value" : "3", "score" : 2190 }
{ "_key" : "users:postcount", "value" : "1", "score" : 1707 }
{ "_key" : "users:postcount", "value" : "598", "score" : 769 }
{ "_key" : "users:postcount", "value" : "11", "score" : 733 }
{ "_key" : "users:postcount", "value" : "477", "score" : 546 }
{ "_key" : "users:postcount", "value" : "587", "score" : 504 }
{ "_key" : "users:postcount", "value" : "747", "score" : 467 }
{ "_key" : "users:postcount", "value" : "302", "score" : 449 }
...
```

Here the `value` field is the user id and `score` is their postcount. From the result of this query we can see that user id `2` is the top poster with 4121 posts.

There are many sorted sets in nodebb that let us display the data, for example posts of a topic are stored in `tid:<tid>:posts` using the post timestamp as score to display the posts sorted by time. Below is a complete javascript function to retrieve the top posters in the forum using the database module in nodebb.

```
async function getTopPosters(start, stop) {
	const db = require('../database');
	const user = require('../user')
	const uids = await db.getSortedSetRevRange('users:postcount', start, stop);
	return await user.getUsers(uids);
}
```

The db class provides set of functions to manipulate hashes, sets, sortedsets and lists. You can see all of the source [here](https://github.com/NodeBB/NodeBB/tree/master/src/database/redis). It doesn't matter if you are using mongodb or redis since the interface is the same. For an explanation see [this](https://community.nodebb.org/topic/309/mongodb-support) post.

