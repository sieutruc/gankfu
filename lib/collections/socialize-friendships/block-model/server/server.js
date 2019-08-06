BlocksCollection.allow({
    insert: function (userId, block){
        if(block.checkOwnership()){
            if(!block.isDuplicate()){
                return true;
            }else{
                throw new Meteor.Error("ExistingBlock", "This user is already blocked by the current user");
            }
        }
    },
    remove: function (userId, block){
        return block.checkOwnership();
    }
});

BlocksCollection.after.insert(function(userId, document){
    var blockedUser = User.createEmpty(document.blockedUserId);
    //If the users are friends or acquaintances, we need to delete them
    blockedUser.unfriend();
    blockedUser.unacquaintance();

    //If there are any requests or invitations between the users, clean them up.
    RequestsCollection.remove({$or:[
        {userId:document.userId, requesterId:document.blockedUserId},
        {userId:document.blockedUserId, requesterId:document.userid}
    ]});
    InvitationsCollection.remove({$or:[
        {userId:document.userId, inviterId:document.blockedUserId},
        {userId:document.blockedUserId, inviterId:document.userid}
    ]});
});
