Meteor.startup(function(){


    Deps.autorun(function(){

        Session.set("showLoadingIndicator", true);

        // All my data. Provide only to logged-in users.
        /*if(!Meteor.loggingIn() && Meteor.userId()){
            Meteor.subscribe('myData', function(){
                Session.set('settings', Meteor.user().settings||{});
            });
            /*Meteor.subscribe('myPictures');
            Meteor.subscribe('myNotifications');

            Meteor.subscribe('myFriendList');
            myNewsFeedHandle = Meteor.subscribeWithPagination('myNewsfeed', Newsfeed.activitiesPerPage);

            // My conversations
            conversationsHandle = Meteor.subscribeWithPagination('myConversations', 10);
            */
            // Questions for the profile form.
            //Meteor.subscribe('questions');
        //}
        
    });

    // run this one every time the search query is modified, used in search router
    /*Deps.autorun(function(){
        if(Session.get("searchQuery")){
            searchHandle = Meteor.subscribe("searchResults", Session.get("searchQuery"), Meteor.users.searchResultsLimit, function(){
                Session.set('searchQueryDone', Session.get('searchQuery'));
            });
        }
    });*/

});


