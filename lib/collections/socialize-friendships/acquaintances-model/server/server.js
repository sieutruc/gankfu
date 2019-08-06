AcquaintancesCollection.allow({
    insert:function (userId, acquaintance) {
        if(userId){
            var user = User.createEmpty(userId);
            var inviter = User.createEmpty(acquaintance.acquaintanceId);
            if(user.hasInvitationFrom(inviter, acquaintance.gameId) === 1) {
                return true;
            }else{
                throw new Meteor.Error("NoInvitation", "User must be invited to play before friendship is allowed");
            }
        }
    },
    update: function(userId, acquaintance) {
        return false;
    },
    remove:function (userId, acquaintance) {
        if(userId){
            return acquaintance.checkOwnership();
        }
    }
});

AcquaintancesCollection.after.insert(function(userId, document){
    var user = User.createEmpty(userId);
    var acquaintance = User.createEmpty(document.acquaintanceId);

    var notif = NotificationsCollection.findOne({userId: userId, senderId: document.acquaintanceId, gameId: document.gameId, read: 0, type: 2});
    var invite = InvitationsCollection.findOne({userId: userId, inviterId: document.acquaintanceId, gameId: document.gameId});

    invite.update({$set: {state: "valid"}});
    notif.update({$set: {read: 2, desc: "valid" }});

    //this if is a dirty dirty hack, unfortunately collection-hooks bypasses
    //collection2 with simple-schema when using collection.direct and doesn't
    //insert a proper record since we rely on simple-schema's autoValue feature
    if(acquaintance.hasInvitationFrom(user, document.gameId) === 1){ //TODO: find a way around this hack
        //InvitationsCollection.remove({userId:document.userId, inviterId:document.acquaintaceId});
        var notif = NotificationsCollection.findOne({userId: document.acquaintanceId, senderId: userId, gameId: document.gameId, read: 0, type: 2});
        var invite = InvitationsCollection.findOne({userId: document.acquaintanceId, inviterId: userId, gameId: document.gameId});
        invite.update({$set: {state: "valid"}});
        notif.update({$set: {read: 2, desc: "valided" }});
        //create a reverse record for the other user
        //so the connection happens for both users
        AcquaintancesCollection.insert({userId:document.acquaintanceId, acquaintanceId:userId, gameId: document.gameId});
    }
});

AcquaintancesCollection.after.remove(function (userId, document) {
    //when a acquaintace record is removed, remove the reverse record for the
    //other users so that the acquaintace connection is terminated on both ends
    invite.update({$set: {state: "canceled"}});
    AcquaintancesCollection.direct.remove({userId:document.acquaintanceId, acquaintanceId:userId});
});
