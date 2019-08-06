/**
 * Created by David on 11/30/2015.
 */

Notification = BaseModel.extendAndSetupCollection("notifications");

NotificationsCollection = Notification.collection;

NotificationsCollection.after.insert(function(userId, notification) {
    console.log('hello');
});

createChatNotification = function(room,name) {
    var curRoom = ChatRooms.findOne(room);
//Test which user to notify
    if (Meteor.userId() == curRoom.chatIds[1]) {
        var NotifyUser=curRoom.chatIds[0];
    }
    else {
        var NotifyUser=curRoom.chatIds[1];
    }
    NotificationsCollection.insert({
        userId: NotifyUser,
        senderId: curRoom._id,
        gameId: 0, // for general purpose
        type: 1,
        desc: name, // containe the name of the sender
        read: 0
    });
};

if (Meteor.isServer) {
    // Notifications._ensureIndex( {userId:1, gameId:1}, { unique: true } )
    // This code only runs on the server
}

Notification.appendSchema({
    userId: { // user that receives the notification
        type: String,
        regEx:SimpleSchema.RegEx.Id,
        optional: false,
        denyUpdate:true
    },
    senderId: { // user that sends the notification
        type: String,
        regEx:SimpleSchema.RegEx.Id,
        optional: false,
        denyUpdate:true
    },
    gameId: { // 0: for the general purpose , for all games
        type: String,
        regEx:SimpleSchema.RegEx.Id,
        optional: false,
        denyUpdate:true
    },
    // type:
    // 0: default message
    // 1 - user message
    // 2 - invitation message
    // 3 - accepted invitation message
    type: {
        type: Number,
        min: 1,
        max: 3,
        optional: false,
        denyUpdate:true
    },
    // read:
    // 0: not read
    // 1: read
    // 2: read but display the notif anyway
    read: {
        type: Number,
        optional: false
    },
    desc: {
        type: String,
        optional: true
    },
    "lastDate":{
        type:Date,
        autoValue:function() {
            if(this.isInsert){
                return new Date();
            }
        }
    },
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert){
                return new Date();
            }
        },
        denyUpdate:true
    }
});

