//Meteor.subscribe("Games");
//Meteor.subscribe("Likes");

Meteor.subscribe("onlusers1");
Meteor.subscribe("chatrooms1");

Template.userProfileGamesList.onCreated(function(){
    var instance = this;
    instance.autorun(function() {
        instance.subscribe('GamesForCurrentUser');
        instance.subscribe('LikesForCurrentUser');
    });
});

Template.userProfileGamesList.helpers({
    //get games
    Games: function () {
        return Games.find();
    }
});

Template.gameInfo.onCreated(function() {
    Template.instance().data.totalLikes = new ReactiveVar(0);
});

Template.gameInfo.events({
    "click #like":function(event, template){
    ///Call the server side function to check if already liked and then like.
        Meteor.call('newLike', {userId:Meteor.userId(),gameId: this._id});
    //   Session.set("updated",new Date());
    }
});

Template.gameInfo.helpers({
    numLikes:function() {
        var instance = this;
        Meteor.call('getTotalLikesEachGame', this._id, function(err, res) {
            if (err) {
                sAlert.error(err.reason);
            }
            instance.totalLikes.set(parseInt(res));
        });
        return this.totalLikes.get();
    },
    likesThis:function() {
        var doeslike = Likes.findOne({userId:Meteor.userId(),gameId:this._id});
        if (doeslike) {
            return 'You liked this';
        }
    },
    getUrl: function () {
        return "/" + this.url;
    }
});