NodeBB stores data using different structures based on redis. These are `hashes`, `sets`, `sortedsets` and `lists`.

A hash is comparable to a javascript object, sets are collections of unique values, sorted sets are same as sets but they have an extra score field that lets sorting the values. Lists are similar to an array in JS.

For example each user's data is stored in an object with a unique key in the form `user:<uid>` where `<uid>` is the unique id of the user. 

NodeBB uses the following key names to refer to ids.

 * uid - user id `user:<uid>`
 * cid - category id `cateogory:<cid>`
 * tid - topic id `topic:<tid>`
 * pid - post id `post:<pid>`
 * mid - message id `message:<mid>`
 * nid - notification id `notifications:<nid>`
 * eid - event id `event:<eid>`

Whenever you see a key like `user:<uid>` it means `<uid>` is an increasing numeric identifier. Ie `user:1`, `user:2` ,`user:1000` and so on. The only exception to this are notifications which use a unique string per notification.

To grab the data of user 100 you can run `hgetall user:100` in redis or `db.objects.findOne({_key: "user:100"})` in mongodb.

Here is the output from mongodb.

```
> db.objects.findOne({_key:"user:100"})
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

The same applies to posts, topics, categories below are example outputs for the most important objects. 

Global Object - Stores counters for the other objects in the forum.
```
> db.objects.findOne({_key: "global"}) 
{
        "_id" : ObjectId("5c9be01d375afb4e6c577081"),
        "_key" : "global",
        "nextEid" : 183,
        "nextCid" : 26,
        "nextUid" : 23,
        "userCount" : 23,
        "nextTid" : 36,
        "topicCount" : 34,
        "nextPid" : 357,
        "postCount" : 355,
        "uniqueIPCount" : 149,
        "nextChatRoomId" : 10,
        "nextMid" : 55
}
```

Config  Object - stores forum wide settings
```
> db.objects.findOne({_key: "config"})
{
        "_id" : ObjectId("5c9bdff1375afb4e6c577073"),
        "_key" : "config",
        "email:from" : "admin@myforum.com",
        "adminReloginDuration" : 60,
        "allowAccountDelete" : 1,
        "allowGuestHandles" : 0,
        "allowMultipleBadges" : 0,
        "allowPrivateGroups" : 1,
        "allowProfileImageUploads" : 1,
        "allowTopicsThumbnail" : 0,
        "allowUserHomePage" : 0,
        "allowedFileExtensions" : "png,jpg,bmp",
        "autoDetectLang" : 1,
        "bookmarkThreshold" : 5,
        "categoryWatchState" : "watching",
        "chatDeleteDuration" : 5,
        "chatEditDuration" : 5,
        "chatMessageDelay" : 200,
        "defaultLang" : "en-US",
        "digestHour" : 17,
        "disableChat" : 0,
        "disableEmailSubscriptions" : 0,
        "disableRecentCategoryFilter" : 0,
        "disableSignatures" : 0,
        "downvote:disabled" : 0,
        "email:disableEdit" : 0,
        "emailConfirmInterval" : 10,
        "enablePostHistory" : 1,
        "eventLoopCheckEnabled" : 1,
        "eventLoopInterval" : 500,
        "eventLoopLagThreshold" : 100,
        "feeds:disableSitemap" : 1,
        "gdpr_enabled" : 0,
        "hideFullname" : 0,
        "hsts-enabled" : 0,
        "hsts-maxage" : 31536000,
        "hsts-preload" : 0,
        "hsts-subdomains" : 0,
        "initialPostDelay" : 10,
        "inviteExpiration" : 7,
        "lockoutDuration" : 60,
        "loginAttempts" : 5,
        "loginDays" : 14,
        "loginSeconds" : 0,
        "maintenanceMode" : 0,
        "maxPostsPerPage" : 20,
        "maxTopicsPerPage" : 20,
        "maximumAboutMeLength" : 1000,
        "maximumChatMessageLength" : 1000,
        "maximumCoverImageSize" : 2048,
        "maximumFileSize" : 2048,
        "maximumGroupNameLength" : 255,
        "maximumGroupTitleLength" : 40,
        "maximumInvites" : 0,
        "maximumPostLength" : 32767,
        "maximumProfileImageSize" : 256,
        "maximumRelatedTopics" : 0,
        "maximumSignatureLength" : 255,
        "maximumTagLength" : 15,
        "maximumTagsPerTopic" : 5,
        "maximumTitleLength" : 255,
        "maximumUsernameLength" : 16,
        "maximumUsersInChatRoom" : 0,
        "min:rep:aboutme" : 0,
        "min:rep:cover-picture" : 0,
        "min:rep:downvote" : 0,
        "min:rep:flag" : 0,
        "min:rep:profile-picture" : 0,
        "min:rep:signature" : 0,
        "min:rep:website" : 0,
        "minimumPasswordLength" : 6,
        "minimumPasswordStrength" : 0,
        "minimumPostLength" : 8,
        "minimumTagLength" : 3,
        "minimumTagsPerTopic" : 0,
        "minimumTitleLength" : 3,
        "minimumUsernameLength" : 2,
        "newbiePostDelay" : 120,
        "newbiePostDelayThreshold" : 3,
        "notificationType_follow" : "notification",
        "notificationType_group-invite" : "notification",
        "notificationType_mention" : "notification",
        "notificationType_new-chat" : "notification",
        "notificationType_new-post-flag" : "notification",
        "notificationType_new-register" : "notification",
        "notificationType_new-reply" : "notification",
        "notificationType_new-topic" : "notification",
        "notificationType_new-user-flag" : "notification",
        "notificationType_post-queue" : "notification",
        "notificationType_upvote" : "notification",
        "onlineCutoff" : 30,
        "passwordExpiryDays" : 0,
        "postCacheSize" : 10485760,
        "postDelay" : 10,
        "postDeleteDuration" : 0,
        "postEditDuration" : 0,
        "postsPerPage" : 20,
        "preventTopicDeleteAfterReplies" : 0,
        "profile:convertProfileImageToPNG" : 0,
        "profile:keepAllUserImages" : 0,
        "profileImageDimension" : 200,
        "registrationType" : "disabled",
        "rejectImageHeight" : 5000,
        "rejectImageWidth" : 5000,
        "reputation:disabled" : 0,
        "requireEmailConfirmation" : 0,
        "resizeImageQuality" : 80,
        "resizeImageWidth" : 760,
        "resizeImageWidthThreshold" : 2000,
        "showSiteTitle" : 0,
        "sitemapTopics" : 500,
        "teaserPost" : "last-post",
        "timeagoCutoff" : 30,
        "title" : "My Forums",
        "topicStaleDays" : 60,
        "topicThumbSize" : 120,
        "topicsPerPage" : 20,
        "unreadCutoff" : 2,
        "userSearchResultsPerPage" : 50,
        "username:disableEdit" : 0,
        "votesArePublic" : 0,
        "bootswatchSkin" : "",
        "theme:id" : "nodebb-theme-persona",
        "theme:src" : "",
        "theme:staticDir" : "",
        "theme:templates" : "",
        "theme:type" : "local",
        "customCSS" : "",
        "customHTML" : "",
        "customJS" : "",
        "enableLiveReload" : 1,
        "renderedCustomCSS" : "",
        "useCustomCSS" : 0,
        "useCustomHTML" : 0,
        "useCustomJS" : 1,
        "brand:favicon" : "",
        "brand:logo" : "",
        "brand:logo:alt" : "",
        "brand:logo:url" : "",
        "brand:touchIcon" : "",
        "browserTitle" : "",
        "description" : "",
        "keywords" : "",
        "og:image" : "",
        "outgoingLinks:whitelist" : "",
        "searchDefaultSortBy" : "relevance",
        "title:url" : "",
        "titleLayout" : "",
        "useOutgoingLinksPage" : 0,
        "homePageCustom" : "/home",
        "homePageRoute" : "categories",
        "homePageTitle" : "",
        "categoryTopicSort" : "oldest_to_newest",
        "composer:allowPluginHelp" : 1,
        "composer:customHelpText" : "",
        "composer:showHelpTab" : 1,
        "postQueue" : 1,
        "signatures:disableImages" : 0,
        "signatures:disableLinks" : 0,
        "topicPostSort" : "oldest_to_newest",
        "trackIpPerPost" : 0,
        "allowLoginWith" : "username-email",
        "dailyDigestFreq" : "off",
        "disableCustomUserSkins" : 0,
        "followTopicsOnCreate" : 0,
        "followTopicsOnReply" : 0,
        "hideEmail" : 0,
        "notificationType_group-request-membership" : "none",
        "openOutgoingLinksInNewTab" : 0,
        "password:disableEdit" : 0,
        "restrictChat" : 0,
        "showemail" : 0,
        "showfullname" : 0,
        "termsOfUse" : "",
        "topicSearchEnabled" : 0,
        "submitPluginUsage" : 0,
        "registrationApprovalType" : "admin-approval",
        "brand:emailLogo" : "\\assets\\uploads\\system\\site-logo-x50.png",
        "brand:logo:height" : 29,
        "brand:logo:width" : 32,
        "brand:emailLogo:height" : 50,
        "brand:emailLogo:width" : 155,
        "chat-incoming" : "Default | Water drop (high)",
        "chat-outgoing" : "Default | Deedle-dum",
        "notification" : "Default | Water drop (low)",
        "disableChatMessageEditing" : 0,
        "cookieConsentDismiss" : "",
        "cookieConsentEnabled" : 1,
        "cookieConsentLink" : "",
        "cookieConsentLinkUrl" : "",
        "cookieConsentMessage" : "",
        "cookieDomain" : "",
        "feeds:disableRSS" : 0,
        "robots:txt" : "",
        "backgroundColor" : "",
        "themeColor" : "",
        "title:short" : "",
        "groupsExemptFromPostQueue" : "[\"Global Moderators\",\"administrators\"]",
        "necroThreshold" : 7,
        "newbiePostEditDuration" : 3600,
        "postQueueReputationThreshold" : 2
}
```

Category Object
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

Topic Object
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
        "teaserPid" : 25995,
	"upvotes": 0,
	"downvotes": 0
}
```

Post Object
```
> db.objects.findOne({_key:"post:20000"});
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
        "upvotes" : 0,
	"downvotes": 0
}
```

Plugin Settings Object - plugin settings are saved in these objects `settings:<id>`
```
> db.objects.findOne({_key: "settings:mentions"})
{
        "_id" : ObjectId("5e8c8db8ba5ceec316de0b92"),
        "_key" : "settings:mentions",
        "autofillGroups" : "off",
        "disableFollowedTopics" : "off",
        "disableGroupMentions" : "[]",
        "display" : "",
        "overrideIgnores" : "off"
}
```

Chat Message Object
```
> db.objects.findOne({_key: /^message:1000/})
{
        "_id" : ObjectId("554537872b1e9e3c288d3b5e"),
        "_key" : "message:1000",
        "content" : "a chat message\n",
        "timestamp" : 1386347930646,
        "fromuid" : 2,
        "touid" : 243
}

```


Notification Object - each notification can have different fields depending on how it was created
```
> db.objects.findOne({_key: "notifications:chat_15142_3672"})
{
        "_id" : ObjectId("5ee0fe343dc567806d463a6f"),
        "_key" : "notifications:chat_15142_3672",
        "type" : "new-chat",
        "subject" : "subject",
        "bodyShort" : "short notification body",
        "bodyLong" : "long notification body",
        "nid" : "chat_15142_3672",
        "from" : 15142,
        "path" : "/chats/3672",
        "importance" : 5,
        "datetime" : 1591803444289
}
```

This lets us store all the forum data, now to retrieve it in a sorted fashion we use sorted sets. You can think of sorted sets as indexes. They have two fields `value` and `score`.

Let's look at a sample `users:postcount` sorted set.

When users are created a hash is created to store their data at `user:<uid>` and their `postcount` and `uid` is added to a sorted set called `users:postcount`. `postcount` is used as the score and the `uid` is used as the value. 

This query returns the top posters in the forum.

```
> db.objects.find({ _key:"users:postcount" }, { _id: 0, _key: 0 }).sort({ score: -1 }).pretty()
{ "value" : "2", "score" : 4121 }
{ "value" : "970", "score" : 2749 }
{ "value" : "3", "score" : 2190 }
{ "value" : "1", "score" : 1707 }
{ "value" : "598", "score" : 769 }
{ "value" : "11", "score" : 733 }
{ "value" : "477", "score" : 546 }
{ "value" : "587", "score" : 504 }
{ "value" : "747", "score" : 467 }
{ "value" : "302", "score" : 449 }
...
```

Here the `value` field is the user id and `score` is their postcount. From the result of this query we can see that user id `2` is the top poster with 4121 posts.

Below is a complete javascript function to retrieve the top posters in the forum using the database module in nodebb.

```
const db = require('../database');
const user = require('../user')
async function getTopPosters(start, stop) {
	const uids = await db.getSortedSetRevRange('users:postcount', start, stop);
	return await user.getUsers(uids);
}
```

The db class provides set of functions to manipulate hashes, sets, sortedsets and lists. You can see all of the source [here](https://github.com/NodeBB/NodeBB/tree/master/src/database/redis). It doesn't matter if you are using mongodb or redis since the interface is the same. For an explanation see [this](https://community.nodebb.org/topic/309/mongodb-support) post.

There are many sorted sets in nodebb that let us display the data, for example posts of a topic are stored in `tid:<tid>:posts` using the post timestamp as score to display the posts sorted by time. Below you can find a reference to all the sorted sets and what is stored as the value and score.

**User Sorted Sets**
```
key: users:joindate
score: timestamp user was created
value: uid of user
```

```
key: users:online
score: timestamp user was last online
value: uid of user
```

```
key: users:postcount
score: postcount of user
value: uid of user
```

```
key: users:reputation
score: reputation of user
value: uid of user
```

```
key: users:notvalidated
score: timestamp user was added to this set
value: uid of user
```

```
key: users:flags
score: number of times user was flagged
value: uid of user
```

```
key: users:banned
score: timestamp user was banned
value: uid of user
```

```
key: users:banned:expire
score: timestamp user bann will expire
value: uid of user
```

```
key: uid:<uid>:bans:timestamp
score: timestamp user was banned
value: uid:<uid>:ban:<timestamp>
```

```
key: username:uid
score: uid of the user
value: username of the user
```

```
key: userslug:uid
score: uid
value: userslug of the user
```

```
key: email:uid
score: uid of user
value: lowercased email of user
```

```
key: email:sorted
score: 0
value: <lowercase_email>:<uid>
```

```
key: username:sorted
score: 0
value: <lowercase_username>:<uid>
```

```
key: user:<uid>:usernames
score: timestamp of username changge
value: <username>:<timestamp>
```

```
key: user:<uid>:emails
score: timestamp of email change
value: <email>:<timestamp>
```

```
key: uid:<uid>:posts
score: timestamp of post creation
value: post id
```

```
key: cid:<cid>:uid:<uid>:pids
score: timestamp of post creation
value: post id
```


wip

**Category Sorted Sets**

wip
	
**Topic Sorted Sets**

wip

**Post Sorted Sets**

wip
	
	
