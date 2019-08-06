Meteor.methods({
	updateAvatar: function(url) {
	    var id = this.userId;
	    if (!id) {
	        throw new Meteor.Error(403, "You must be logged in");
	    }
	    try {
	        return Meteor.users.update({_id: id},
	            {$set: {'profile.avatar': url, 'profile.upgraded': new Date()}}
	        );
	    }
	    catch(e){
	        throw new Meteor.Error(403, e.message);
	    }    
	    return true;
	}
});