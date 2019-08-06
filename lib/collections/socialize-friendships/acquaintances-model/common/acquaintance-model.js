/**
 * The Acquaintance Class
 * @class Acquaintance
 * @param {Object} document An object representing a Acquaintance ususally a Mongo document
 */
Acquaintance =  BaseModel.extendAndSetupCollection("acquaintance");

/**
 * Get the User instance for the acquaintance
 * @function user
 * @memberof Acquaintance
 */
Acquaintance.prototype.user = function () {
    if(this.acquaintanceId){
        return  Meteor.users.findOne(this.acquaintanceId);
    }
};

/**
 * Get the Game instance of the acquaintance
 * @function game
 * @memberof Acquaintance
 */
Acquaintance.prototype.game = function () {
    if(this.gameId){
        return  collections['games'].findOne(this.gameId);
    }
};

AcquaintancesCollection = Acquaintance.collection;

//Create the schema for a Acquaintance
Acquaintance.appendSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert){
                if(!this.isSet && this.isFromTrustedCode){
                    return Meteor.userId();
                }
            }
        },
        denyUpdate:true
    },
    "acquaintanceId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        denyUpdate:true
    },
    "gameId": {
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        denyUpdate:true
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

if(Meteor.isServer) {
    AcquaintancesCollection._ensureIndex({userId:1, acquaintanceId:1,gameId:1}, {unique: 1});
}