//Configurable number of days to restrict a user from re-inviting a acquaintanceship
User.restrictInvitationDays = 1;
// number of minutes between 2 actions
User.restrictMinutesBetweenAction = 1;

// the methods used by all User instances
User.checkInvitationValidity = function(invitation) {
    if(!invitation)  {
        return 0;
    }else if( invitation.state === "valid") return -1;
    else if( invitation.state === "valided") return -2;
    else if( invitation.state === "requesting") return 1;
    else if( invitation.state === "canceled") return 0;
    else if( invitation.state === "denied"){
        return 3;
    }else if (invitation.state === "ignored") {
        if(invitation.checkIgnoredValidity()) {
            return 2;
        } else
            return 0;
    }else {
        return 0;
    }
}

// check time difference between 2 actions
User.checkTimeValidity = function(invitation) {
    if( invitation.state === "canceled") {
        var unit = 0;
        if (Meteor.isClient) {
            unit = 60000;
        }else {
            unit = 50000;
        }
        var minDate =  invitation.date.getTime() + (unit  * User.restrictMinutesBetweenAction);
        if(minDate > Date.now()) {
            return false;
        }
    }
    return true;
}

User.checkInvitationTimeValidity = function(chosenDate) {
    if(!moment(chosenDate).isValid()) {
        return -1; // the time is invalid
    }
    var timestamp = moment(chosenDate);
    var nextMonth = moment().add(1, 'months');

    if (timestamp.diff(moment(),'days') < 0 || timestamp.diff(nextMonth,'days') > 0) {
        return 0; // the time is not in the valid range
    }
    return 1; // the time is valid and can be imported to db
}

// the method of each instance of User collection
User.methods({
    /**
     * Get the invitations the user currently has
     * @param   {Number}       limit     The maximum number of requests to return
     * @param   {Number}       skip      The number of records to skip
     * @param   {String}       sortBy    The key to sort on
     * @param   {Number}       sortOrder The order in which to sort the result. 1 for ascending, -1 for descending
     * @returns {Mongo.Cursor} A cursor which returns Invitation instances
     */
    invitations: function (limit, skip) {
        var options = {limit:limit, skip:skip};
        return InvitationsCollection.find({userId:this._id, denied:{$exists:false}, ignored:{$exists:false}}, options);
    },

    /**
     * Retrieve the number of pending invitation the user has
     * @method numPendingInvitations
     * @returns {Number} The number of pending invitation
     */
    numInvitations: function () {
        return this.invitations().count();
    },

    /**
     * Get the pending invitations from this user to other users
     * @param   {Number}       limit     The maximum number of invitations to return
     * @param   {Number}       skip      The number of records to skip
     * @param   {String}       sortBy    The key to sort on
     * @param   {Number}       sortOrder The order in which to sort the result. 1 for ascending, -1 for descending
     *                                   @returns {Mongo.Cursor} A cursor which returns invitation instances
     */
    pendingInvitations: function (limit, skip) {
        var options = {limit:limit, skip:skip};
        return InvitationsCollection.find({inviterId:this._id, denied:{$exists:false}, ignored:{$exists:false}}, options);
    },

    /**
     * Retrieve the number of pending invitation the user has
     * @method numPendingInvitations
     * @returns {Number} The number of pending invitations
     */
    numPendingInvitations: function () {
        return this.pendingInvitations().count();
    },

    /**
     * Check if the user has a pending invitation from someone
     * @method hasInvitationForm
     * @param   {Object}  user The user to check if there is a invitation from
     * @returns {Boolean} Whether or not there is a pending invitation
     */
    hasInvitationFrom: function (user,gameId) {
        var query = {
            userId:this._id,
            inviterId:user._id
        }
        if (gameId) {
            //console.log(InvitationsCollection.find({}).fetch());
            //console.log(this._id, " helllo ", user.profile.username);
            query['gameId'] = gameId;
        }

        var invitation = InvitationsCollection.findOne(query, {fields:{_id:true, state:true, date: true, hisState: true}});

        return User.checkInvitationValidity(invitation);
    },

    /**
     * Send an invitation to a user // request an acquaintanceship
     * @method requestship
     */
    requestInvitation: function (gameId, inviteTime, callback) {
        //insert the invitation, simple-schema takes care of default fields and values and allow takes care of permissions
        var invitation = InvitationsCollection.findOne({userId: this._id,gameId:gameId});

        if (invitation) {
            if(User.checkTimeValidity(invitation)) {
                invitation.request(inviteTime, callback);
                console.log('return ok');
            }else {
                sAlert.error("You have to wait for about 1 minutes before continuing.");
            }
        }else {
            new Invitation({userId:this._id, gameId: gameId, inviteTime: new Date(inviteTime)}).save(callback);
        }
    },

    /**
     * Cancel an invitation sent to the user
     * @method cancelInvitation
     */
    cancelInvitation: function (gameId,callback) {
        var invitation = InvitationsCollection.findOne({inviterId:Meteor.userId(), userId:this._id, gameId: gameId});
        invitation && invitation.cancel(callback);
    },

    /**
     * Accept invitation from the user
     * @method  acceptInvitation
     */
    acceptInvitation: function(senderId, gameId, callback) {

        var invitation = InvitationsCollection.findOne({inviterId: senderId, userId:Meteor.userId(), gameId: gameId});
        invitation && invitation.accept(callback);
    },

    /**
     * Deny invitation from the user
     * @method denyInvitation
     */
    denyInvitation: function(gameId) {
        var invitation = InvitationsCollection.findOne({inviterId:this._id, userId:Meteor.userId(), gameId: gameId});
        invitation && invitation.deny();
    },

    /**
     * Ignore invitation from the user
     * @method ignoreInvitation
     */
    ignoreInvitation: function(senderId, gameId, callback) {
        var invitation = InvitationsCollection.findOne({inviterId: senderId, gameId: gameId});
        invitation && invitation.ignore(callback);
    }
});
