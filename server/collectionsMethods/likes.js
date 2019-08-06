/**
 * Created by hacops on 16/12/2015.
 */
Meteor.methods({
    newLike: function (like) {
        var curlike = Likes.findOne(like);
        if (!curlike) {
            Likes.insert(like);
        }
    },
    getTotalLikesEachGame: function(gameId) {
        return Likes.find({gameId: gameId}).count();
    }
})