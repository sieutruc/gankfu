/***********************************************
 * Client side configuration
 ********************************************* */

if(Meteor.isClient){
    /*Accounts.ui.config({
        passwordSignupFields: 'EMAIL_ONLY'
    });*/

    // Default language for the application
    //Meteor.setLocale('en_GB');
}

/***********************************************
 * Server side configuration
 * *********************************************/

if(Meteor.isServer){
    /*
     Users configuration
     */
    // What fields are public for everyone
    Meteor.users.publicProfileInformation = {
        // show selected information
        'profile.username' : 1,
        'profile.firstname' : 1,
        'profile.lastname' : 1,
        'profile.dobtime': 1,
        'profile.gender': 1
    };
    // What fields are reserved for friends only
    Meteor.users.privateProfileInformation = {
        'profile': 1 // show all profile
    };

    // What field I can see about myself
    Meteor.users.myProfileInformation = {
        'profile': 1,
        'friends': 1,
        'settings': 1,
        'location': 1,
        'phyAdd.add': 1
    };

    // profile's default avatar
    Meteor.users.defaultAvatar = "http://keenthemes.com/preview/metronic/theme/assets/admin/pages/media/profile/profile_user.jpg";
    Meteor.users.maxSizeAvatar =  5 * 1024 * 1024 ; // 5 MB (use null for unlimited)
    Meteor.users.imageExtension = ["image/png", "image/jpeg", "image/gif"];


    // friendship 's parameter
    Meteor.users.maxInvitationForPlayForEachGame = 20; // maximum of invitations for each game
    Meteor.users.maxAcquaintancesForEachGame = 20; // maximum of acquaintances for each game
    //Configurable number of days to restrict a user from re-inviting a acquaintanceship
    Meteor.users.restrictInvitationDays = 30;
    //Configurable number of days to restrict a user from re-requesting a friendship
    Meteor.users.restrictRequestDays = 30;


    // Invitation 's parameters
}

/* *****************************************************
 A bit of both
 ***************************************************** */
