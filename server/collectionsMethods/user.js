Meteor.methods({
    modifyProfile : function(modprofile) {
        var FirstN=modprofile.firstname;
        var LastN=modprofile.lastname;
        var address=modprofile.location;
        if(this.userId)
        {   Meteor.users.update(this.userId, {
            $set :  {
                'profile.firstname' : FirstN,
                'profile.lastname' : LastN,
                'profile.location' : address
            }});
        }
    }
});