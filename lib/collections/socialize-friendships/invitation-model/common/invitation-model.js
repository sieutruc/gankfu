// this schema should be defined at first
Schema = {};

SimpleSchema.debug = true;

// maximum number of historic states
User.numOfHistoricStates = 5;

/**
 * The Invitation Class
 * @class Invitation
 * @param {Object} document An object representing a Invitation, usually a Mongo document
 */
Invitation = BaseModel.extendAndSetupCollection("invitation");

/**
 * Get the User instance for the user who made the invitation
 * @returns {User} The user who made the invitation
 */
Invitation.prototype.inviter = function () {
    return Meteor.users.findOne(this.inviterId);
};

/**
 * Get the User instance for the user who is recieving the invitation for play
 * @returns {User} The user who recieved the invitation
 */
Invitation.prototype.user = function () {
    return Meteor.users.findOne(this.userId);
};

/**
 * Accept the invitation for play
 * @method approve
 */
Invitation.prototype.accept = function (callback) {
    new Acquaintance({userId:this.userId, acquaintanceId:this.inviterId, gameId: this.gameId}).save(callback);
};


/**
 * update the invitation 's request for play
 * @method deny
 */
Invitation.prototype.request = function(inviteTime, callback) {
    this.update({$set:{state:"requesting", inviteTime: inviteTime}}, callback);
};

/**
 * Deny the invitation for play
 * @method deny
 */
Invitation.prototype.deny = function(callback) {
    this.update({$set:{state:"denied"}}, callback);
};

/**
 * Ignore the invitation for play so that it can be accpted or denied later
 * @method ignore
 */
Invitation.prototype.ignore = function(callback) {
    Meteor.call('ignoreNotification', this.inviterId, this.gameId, this.state, callback);
    //this.update({$set:{state:"ignored"}}, callback);
};

/**
 * Cancel the invitation for play
 * @method cancel
 */
Invitation.prototype.cancel = function (callback) {
    this.update({$set:{state:"canceled"}}, callback);
};

/**
 * Check if the invitation had been denied
 * @returns {Boolean} Whether the invitation has been denied
 */
Invitation.prototype.wasRespondedTo = function() {
    return !!this.denied || !!this.ignored;
};

/**
 * Check if the invitation had been ignored
 * @returns {Boolean} Whether the invitation has still been ignored
 */
Invitation.prototype.checkIgnoredValidity = function() {
    if (this.state === "ignored") {
        //console.log('date:',User.restrictInvitationDays);
        var minDate =  this.date.getTime() + (3600000 * 24 * User.restrictInvitationDays);
        if(  minDate > Date.now()){
            return true;
        }
    }
    return false;
};

InvitationsCollection = Invitation.collection;

Schema.State = new SimpleSchema({
    "state": {
        type: String,
        allowedValues: ["valid", "requesting", "canceled", "ignored", "denied"],
        autoValue: function() {
            if(this.isInsert) {
                return "requesting";
            }
        }
    },
    "date": {
        type: Date
    }
});

//Create the schema for an invitation for play
Invitation.appendSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        denyUpdate:true
    },
    "inviterId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert){
                return Meteor.userId();
            }
        },
        denyUpdate:true
    },
    "gameId": {
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        denyUpdate:true
    },
    "inviteTime":{
        type:Date
    },
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert | this.isUpdate | this.isUpsert){
                return new Date();
            }
        }
    },
    "created":{
        type:Date,
        autoValue:function() {
            if(this.isInsert){
                return new Date();
            }
        },
        denyUpdate:true
    },
    "state": {
        type: String,
        allowedValues: ["valid", "requesting", "canceled", "ignored", "denied"],
        autoValue: function() {
            if(this.isInsert) {
                return "requesting";
            }
        },
        optional: true
    },
    hisState: {
        type: [Schema.State],
        autoValue: function() {
            if(this.isInsert) {
                return [ ];
            }else if (this.isUpdate) {
                var beforeUpdate = InvitationsCollection.findOne({_id:this.docId});
               // if( beforeUpdate.hisState.length > 0 & beforeUpdate.hisState[beforeUpdate.hisState.length].state === "ignored" )
                if(beforeUpdate.hisState.length > User.numOfHistoricStates) {
                    // remove the first, and to the last
                    beforeUpdate.hisState.shift();
                }
                beforeUpdate.hisState.push({ "state": beforeUpdate.state,
                    "date": beforeUpdate.date });
                return beforeUpdate.hisState;
            }
        },
        optional: true
    }
});
