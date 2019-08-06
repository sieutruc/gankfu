Template.sidebarChat.helpers({
    'onlusr':function(){
        return Meteor.users.find({ "status.online": true , _id: {$ne: Meteor.userId()} });
    },
    'selectedClass': function(){
        var roomid=this._id;
        var currentChatId = Session.get("currentChatId");
        if(roomid == currentChatId)
            return "selected";
        //highlight function

    }
});

Template.sidebarChat.events({
    'click .user':function() {
        /*  $('.user').removeClass('highlight');*/
        Session.set('currentChatId',this._id);
        var res=ChatRooms.findOne({chatIds:{$all:[this._id,Meteor.userId()]}});

        if(res)
        {
            //Room already exists
            Session.set("roomid",res._id);
        }
        else{
            //no room exists
            var newRoom= ChatRooms.insert({chatIds:[this._id , Meteor.userId()],messages:[]});
            Session.set('roomid',newRoom);
        }
    }
});

Template.messages.helpers({
    'msgs':function(){
        var result=ChatRooms.findOne({_id:Session.get('roomid')});
        if( result)
            return result.messages;
        return null;
    }
});

Template.input.events = {
    'keydown input#message' : function (event) {
        if (event.which == 13) {
            if (Meteor.user())
            {
                var name = Meteor.user().profile.username;
                var message = document.getElementById('message');
                var room= Session.get("roomid");

                if (message.value !== '') {
                    ChatRooms.update({"_id":room},{$push:{messages:{
                        owner:Meteor.userId(),
                        name: name,
                        text: message.value,
                        createdAt: Date.now()
                    }}});
                    createChatNotification(room,name);
                    document.getElementById('message').value = '';
                    message.value = '';
                }
            }
            else
            {
                alert("login to chat");
            }

        }
    }
}