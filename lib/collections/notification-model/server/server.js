/**
 * Created by hacops on 01/01/2016.
 */
NotificationsCollection.allow({
    insert: function (userId, notification) {
        if(userId){
            var receiver = Meteor.users.findOne(notification.userId);
            var sender = Meteor.users.findOne(notification.senderId);

            if(!receiver.isSelf() && sender.isSelf() ){
                if(!(receiver.blocksUser(sender) || sender.blocksUserById(receiver))){
                    if((receiver.hasInvitationFrom(sender, 0)
                        || sender.hasInvitationFrom(receiver, 0)
                        || sender.isAcquaintancesWith(receiver)
                        || sender.isFriendsWith(receiver))){
                        var numNotif = NotificationsCollection.find({userId: notification.userId, senderId: notification.senderId, read: 0}).count();
                        if(numNotif === 0)
                            return true;
                        if(numNotif > 1)
                            throw new Meteor.Error("DuplicatedNotif", "Duplicated notificattions have not been read.");
                    }else{
                        throw new Meteor.Error("PermissionDenied", "PermissionDenied");
                    }
                }else{
                    throw new Meteor.Error("Blocked", "One user is blocking the other");
                }
            }else{
                throw new Meteor.Error("BadDataInDoc", "Data in doc are not valid.");
            }
        }
        return false;
    },
    update: function (userId, notification, fieldNames) {
        if(userId){
            console.log('check update');
            return notification.checkOwnership() &&
                fieldNames.length === 1 && ( _.contains(['read', 'lastDate'],fieldNames[0]));
        }
    },
    remove: function (userId, notification) {
        if(userId){
            //allow the invitation to be canceled if the currentUser is the inviter
            //and the other user has not denied the invitation
            return true;
        }
    }
});