Template.notifications.onCreated(function() {
    var instance = this;

    instance.autorun(function(){
        instance.subscribe("notification_sender_ForCurrentUser");
    });
});

Template.notifications.helpers({
    notifications: function() {
        return NotificationsCollection.find({read: {$in: [0,2]}},{limit:5, sort: {lastDate: -1}});
    },
    newNotificationCount: function() {
        return NotificationsCollection.find({read: 0}).count();
    },
    notificationCount: function(){
        return NotificationsCollection.find({read: {$in: [0,2]}}).count();
    }
});

Template.notificationItem.helpers({
    notificationPostPath: function() {
        // TODO
        //return Router.routes.postPage.path({_id: this.postId});
    },
    notifType: function() {
        var notifType = "messageNotifType";
        switch ( this.type) {
            case 1: {

                break;
            }
            case 2: {
                notifType = "invitationRequestNotifType";
                break;
            }
            case 3: {
                notifType = "invitationAcceptedType"
            }
            default:
                console.log('default ');
        }
        return notifType;
    }
});

Template.notificationItem.events({
    'click a': function() {
        Notifications.update(this._id, {$set: {read: true}});
    }
});

Template.invitationRequestNotifType.onCreated(function() {
    var instance = this;

    instance.autorun(function() {
       instance.subscribe("invitationFromInviter", instance.data.senderId, instance.data.gameId);
    });

});

Template.invitationRequestNotifType.helpers({
    inviteNotif: function() {
        if(this.desc === "canceled") {
            return "canceledNotif";
        }else if(this.desc === "ignored") {
            return "ignoredNotif";
        }else if(this.desc === "valid") {
            return "validNotif";
        }else if(this.desc === "valided") {
            return "validedNotif";
        }
    },
    notifData: function() {
        // check if users subscrition is ready
        if(collections['users'].findOne({_id: this.senderId})) {
            var sender = collections['users'].findOne({_id:this.senderId});
            var instance = this;
            var invitation = InvitationsCollection.findOne({inviterId: instance.senderId, gameId: instance.gameId,
                denied: { $exists: false}, ignored: {$exists: false}});
            console.log(invitation);
            return _.extend(this,{
                inviterName: sender.profile.username,
                gameName: collections['games'].findOne({_id: this.gameId}).name,
                avatarThumbnail: sender.profile.avatar,
                inviteTime: moment(new Date(invitation.inviteTime)).format('DD/MM/YYYY')
            });
        }
    }
});

Template.invitationRequestNotifType.events({
    "click .accept": function (e,t) {
        var currentUser = User.createEmpty(Meteor.userId());
        currentUser.acceptInvitation(this.senderId, this.gameId, function(err, res) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            }
        });
    },
    "click .ignore": function (e,t) {
        var currentUser = User.createEmpty(Meteor.userId());
        currentUser.ignoreInvitation(this.senderId, this.gameId, function(err, res) {
            if (err) {
                console.log(err);
                sAlert.error(err.reason);
            }
        });
    }
});