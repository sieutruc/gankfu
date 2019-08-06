/**
 * Created by David on 11/20/2015.
 */
ChatRooms = new Meteor.Collection("chatrooms");

if (Meteor.isServer) {
    Meteor.publish("chatrooms1",function(){
        //return ChatRooms.find({});
    });

    Meteor.publish("onlusers1",function(){
        //return Meteor.users.find({"status.online":true},{username:1});
    });
}
