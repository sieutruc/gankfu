/**
 * Created by David on 8/18/2015.
 */
Likes = new Mongo.Collection('likes');

if (Meteor.isServer) {
    Likes._ensureIndex( {userId:1, gameId:1}, { unique: true } )
    // This code only runs on the server
}
Schema.Likes = new SimpleSchema({
    userId: {
        type: String,
        regEx:SimpleSchema.RegEx.Id,
        optional: false
    },
    gameId: {
        type: String,
        regEx:SimpleSchema.RegEx.Id,
        optional: false
    }
});

Likes.attachSchema(Schema.Likes);


