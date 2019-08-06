InvitationsCollection.allow({
    insert: function (userId, invitation) {
        if(userId){
            var user = Meteor.users.findOne(invitation.userId);
            var inviter = Meteor.users.findOne(invitation.inviterId);

            if(!user.isSelf() && !user.isAcquaintancesWith(inviter)){
                if(!(user.blocksUser(inviter) || inviter.blocksUserById(user))){
                    if(!(user.hasInvitationFrom(inviter, invitation.gameId) || inviter.hasInvitationFrom(user,invitation.gameId))){
                        return true;
                    }else{
                        throw new Meteor.Error("InvitationExists", "An invitation between users already exists");
                    }
                }else{
                    throw new Meteor.Error("Blocked", "One user is blocking the other");
                }
            }else{
                throw new Meteor.Error("RelationshipExists", "Either the user is inviting themselves or they are already friends with this user");
            }
        }
    },
    update: function (userId, invitation,fields, modifier) {
        if(userId){
            invitation = new Invitation(invitation);
            //let the update happen if the invitation belongs to the user. simple-schema takes
            //care of making sure that they can't change fields they aren't supposed to
            if(invitation.inviterId === userId) {
                // allow updating only "state" field from the inviter
                return _.intersection(['state'],fields).length === 1;
            } else {
                return invitation.checkOwnership();
            }
        }
    },
    remove: function (userId, invitation) {
        //allow the invitation to be canceled if the currentUser is the inviter
        //and the other user has not denied the invitation
        //return invitation.inviterId === userId && !invitation.wasRespondedTo();
        return false;
    }
});

// send a new notifcation after creating a invitation
InvitationsCollection.after.insert(function(userId, invitation) {
    var countNotif = NotificationsCollection.find({userId: invitation.userId, senderId: invitation.inviterId, gameId: invitation.gameId, read: 0, type: 2}).count();
    if( countNotif === 0) {
        new Notification({userId: invitation.userId, senderId: invitation.inviterId, gameId: invitation.gameId, read: 0, type: 2}).save( function(err, res) {
            if (err)
                throwError(err.error, err.reason, err.details);
        });
    } else if (countNotif === 1) {
        var notification = NotificationsCollection.findOne({userId: invitation.userId, senderId: invitation.inviterId, gameId: invitation.gameId, read: 0, type: 2});
        notification.update({$set:{lastDate: new Date()}});
    } else {
        throwError("CorruptedNotification", "There are "+countNotif+" notifs have the same data");
    }
});

InvitationsCollection.before.insert(function(userId, invitation) {
    var exist = InvitationsCollection.find({userId: invitation.userId,inviterId: invitation.inviterId,gameId:invitation.gameId}).count();
    if( exist) {
        throwError("ServerError", "The invitation exists already.");
    }
    if(User.checkInvitationTimeValidity(invitation.inviteTime) === 1)
        return;
    else {
        throwError('ServerError',"The chosen date is not valid.");
    }

});

InvitationsCollection.before.update(function (userId, invitation, fieldNames, modifier)  {
    if(modifier.$set.state && _.contains(["canceled","ignored"],modifier.$set.state)) {
        if(invitation.state === "requesting") {
            return ;
        }
    } else if(modifier.$set.state && modifier.$set.state === "requesting") {
        if(User.checkInvitationValidity(invitation) === 0) {
            //console.log(User.checkTimeValidity(invitation));
            if(User.checkTimeValidity(invitation)) {
                if(User.checkInvitationTimeValidity(modifier.$set.inviteTime) === 1)
                    return;
                else {
                    throwError('ServerError',"The chosen date is not valid.");
                }
            }else {
                throwError('ServerError',"You have to wait for about 1 minutes before continuing.");
            }
        }
    } else if (invitation.state === "ignored") {
        // if the current state is ignored, please wait for maybe 1 day before requesting a new invitation
        if(! invitation.checkIgnoredValidity() ){
            console.log('checkIgnored bypass');
            if(invitation.state === "requesting") {
                return ;
            }
        }else{
            throw new Meteor.Error("InvitationExists", "An invitation between users already exists");
        }
    } else if(modifier.$set.state && modifier.$set.state === "valid") {
        if(invitation.state === "requesting") {
            return ;
        }
    }
    throwError('ServerError',"Permission denied (invitation update)");
});

InvitationsCollection.after.update(function (userId, invitation, fieldNames, modifier)  {
    if(modifier.$set.state && modifier.$set.state === "requesting") {
        var countNotif = NotificationsCollection.find({userId: invitation.userId, senderId: invitation.inviterId, gameId: invitation.gameId, read: 0, type: 2}).count();
        if( countNotif === 0) {
            new Notification({userId: invitation.userId, senderId: invitation.inviterId, gameId: invitation.gameId, read: 0, type: 2}).save( function(err, res) {
                if (err)
                    throwError(err.error, err.reason, err.details);
            });
        } else {
            throwError("CorruptedNotification", "There are "+countNotif+" notifs have the same data");
        }
    }
});

Meteor.methods({
    ignoreNotification: function(inviterId, gameId, state) {

        var notif = NotificationsCollection.findOne({userId: this.userId, senderId: inviterId, gameId: gameId, read: 0, type: 2});
        var invite = InvitationsCollection.findOne({userId: this.userId, inviterId: inviterId, gameId: gameId});

        if(! notif || ! invite  ) {
            throwError('CorruptedData',"Bad data.");
        }
        if(invite.state === "canceled") {
            notif.update({$set: {read: 2, desc: "canceled" }});
            return;
        }
        if(invite.state === "requesting") {
            invite.update({$set: {state: "ignored"}});
            notif.update({$set: {read: 2, desc: "ignored" }});
            return;
        }
        throwError('ServerError',"Permission denied.");
    }
});