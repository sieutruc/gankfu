User.maxAcquaintancesForEachGame =  Meteor.users.maxAcquaintancesForEachGame;

User.methods({

    /**
     * Retrieve a list of acquaintance connections
     * @method friends
     * @param   {Number}        The number of records to limit the result set too
     * @param   {number}        The number of records to skip
     * @returns {Mongo.Cursor}  A cursor of which returns acquaintance instances
     */
    acquaintance:function (limit, skip) {
        var options = {limit:limit, skip:skip, sort:{date:-1}};
        return AcquaintancesCollection.find({userId:this._id}, options);
    },

    /**
     * Retrieves acquaintance connections as the users they represent
     * @method friendsAsUsers
     * @param   {Number}       limit     The maximum number or acquaintances to return
     * @param   {Number}       skip      The number of records to skip
     * @returns {Mongo.Cursor} A cursor which returns user instances
     */
    acquaintancesAsUsers:function (limit, skip) {
        var ids = this.acquaintance(limit, skip).map(function(acquaintance){
            return acquaintance.acquaintanceId;
        });

        return Meteor.users.find({_id:{$in:ids}});
    },

    /**
     * Remove the acquaintanceship connection between the user and the logged in user
     * @method unacquaintance
     */
    unacquaintance:function () {
        var acquaintance = AcquaintancesCollection.findOne({userId:Meteor.userId(), acquaintanceId:this._id});

        //if we have a friend record, remove it. FriendsCollection.after.remove will
        //take care of removing reverse friend connection for other user
        acquaintance && acquaintance.remove();
    },

    /**
     * Check if the user is acquaintances with another
     * @method isFriendsWith
     * @param   {Object}  user The user to check
     * @returns {Boolean} Whether the user is friends with the other
     */
    isAcquaintancesWith: function (user, gameId) {
        var userId = user._id || Meteor.userId();
        return !!AcquaintancesCollection.findOne({userId:this._id, acquaintanceId:userId, gameId:gameId});
    }

});
