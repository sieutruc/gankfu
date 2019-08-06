// general subsription
Meteor.publish("myProfileInformation", function () {
    return Meteor.users.find(
        {_id: this.userId},
        { fields: Meteor.users.myProfileInformation }
    );
});

// subscription for notification

Meteor.publishComposite('notification_sender_ForCurrentUser', {
    find: function() {
        return NotificationsCollection.find({userId: this.userId, read: {$in: [0,2]}});
    },
    children: [{
        find: function (notif) {
            return Meteor.users.find({_id: notif.senderId},
                { limit: 1, fields: {
                    "profile": 1} });
        }
    }, {
        find: function(notif) {
            return Games.find({_id: notif.gameId},
                { limit: 1 });
        }
    }
    ]
        //NotificationsCollection.find({userId: this.userId, read: false});
});

// publish only invitations that are not denied or ignored
Meteor.publish("invitationFromInviter", function(inviterId, gameId) {
    return InvitationsCollection.find({inviterId: inviterId, gameId: gameId,
                                        denied: { $exists: false}, ignored: {$exists: false}});
});

// ids: the user ids from the search result
Meteor.publish("invitationFromSearchResult", function (ids, gameId) {
    // get all userids with whom the current user has the valid invitations
    var query = { userId : { $in : ids }};
    var queryAcq = { $or: [ {userId : { $in : ids },acquaintanceId: this.userId },{userId: this.userId,acquaintanceId : { $in : ids }}]}
    if (gameId)
        query['gameId'] = gameId;
    query['inviterId'] =  this.userId ;
    return [InvitationsCollection.find(query, {
        $where: function () {
            return User.checkInvitationValidity(this);
        }
    }), AcquaintancesCollection.find(queryAcq)
    ];
});

Meteor.publish("GamesForCurrentUser", function () {
    return Games.find({});
});

Meteor.publish("LikesForCurrentUser", function () {
    return Likes.find({userId: this.userId});
});

Meteor.publish("TotalLikesForEachGame", function (gameId) {
    return Likes.find({gameId: gameId}).count();
});

// ids: the user ids from the search result
Meteor.publish("getLikesAndGamesFromIds", function (ids) {
    // get all userids with whom the current user has the valid invitations
    var likes = Likes.find({userId:{$in: ids}});
    var gameIds = _.uniq(_.pluck(likes.fetch(), 'gameId'));
    var games = Games.find({_id: {$in: gameIds}});
    return [ likes, games];
});