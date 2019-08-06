/**
 * Created by hacops on 30/05/2015.
 */

// global group exposed to anybody
var exposed = FlowRouter.group({});

// group used for logged in users
var loggedIn = FlowRouter.group({
    triggersEnter: [checkLoggedInUser]
});

exposed.route('/', {
    name: "home",
    action: function(params, queryParams) {
        BlazeLayout.render("layoutFlowRouter", {maintp: "home"});
    }
});


var adminSection = loggedIn.group({
    prefix: "/admin",
    triggersEnter: [checkAdminRole]
});

var searchSection = exposed.group({
    prefix: "/search"
});

var userSection = loggedIn.group({
    prefix: "/profile"
});

// for the user page
userSection.route('/:userId', {
    name: "userPage",
    action: function(params, queryParams) {
        BlazeLayout.render("layoutFlowRouter", {maintp: "mainUserProfile"});
    }
});

// for the search page
searchSection.route('/', {
    name: "userSearchPage",
    action: function(params, queryParams) {
        BlazeLayout.render('layoutFlowRouter', { maintp: "searchGeneralPage" });
    }
});

// define the glocal subscriptions

/*FlowRouter.subscriptions = function() {
    this.register('notification_sender_ForCurrentUser', Meteor.subscribe('notification_sender_ForCurrentUser'));
};*/

FlowRouter.notFound = {
    // Subscriptions registered here don't have Fast Render support.
    subscriptions: function() {

    },
    action: function() {
        BlazeLayout.render('layoutFlowRouter', { maintp: "notFound" });
    }
};

exposed.route('/sign-up', {
    name: "entrySignUp",
    triggersEnter: [function(context, redirect) {
        //redirect('/some-other-path');
        Session.set('entryError',  0);
        Session.set('buttonText', 'up');
    }],
    action: function(params) {
        //console.log(AccountsEntry.settings);
        BlazeLayout.render('layoutFlowRouter', { maintp: "entrySignUp" });
    }
});

exposed.route('/sign-in', {
    name: "entrySignIn",
    triggersEnter: [function(context, redirect) {
        //redirect('/some-other-path');
        Session.set('entryError',  0);
        Session.set('buttonText', 'in');
    }],
    action: function(params) {
        BlazeLayout.render('layoutFlowRouter', { maintp: "entrySignIn" });
    }
});

exposed.route('/forgot-password', {
    name: "entryForgotPassword",
    triggersEnter: [function(context, redirect) {
        //redirect('/some-other-path');
        Session.set('entryError',  0);
    }],
    action: function(params) {
        //console.log(AccountsEntry.settings);
        BlazeLayout.render('layoutFlowRouter', { maintp: "entryForgotPassword" });
    }
});

exposed.route('/reset-password/:resetToken', {
    name: "entryResetPassword",
    triggersEnter: [function(context, redirect) {
        //redirect('/some-other-path');
        Session.set('entryError', void 0);
        Session.set('resetToken', context.params.resetToken);
    }],
    action: function(params, queryParams) {
        //console.log(AccountsEntry.settings);
        BlazeLayout.render('layoutFlowRouter', { maintp: "entryResetPassword" });
    }
});

exposed.route('/sign-out', {
    name: "entrySignOut",
    triggersEnter: [function(context, redirect) {
        //redirect('/some-other-path');
        Session.set('entryError',  0);
        if (AccountsEntry.settings.homeRoute) {
            return Meteor.logout(function() {
                return FlowRouter.go(AccountsEntry.settings.homeRoute);
            });
        }
    }],
    action: function(params, queryParams) {
        //console.log(AccountsEntry.settings);
        BlazeLayout.render('layoutFlowRouter', { maintp: "entrySignOut" });
    }
});

exposed.route('/verification-pending', {
    name: "entryVerificationPending",
    triggersEnter: [function(context, redirect) {
        //redirect('/some-other-path');
        Session.set('entryError', void 0);
    }],
    action: function(params, queryParams) {
        //console.log(AccountsEntry.settings);
        BlazeLayout.render('layoutFlowRouter', { maintp: "entryVerificationPending" });
    }
});

exposed.route('/enroll-account/:resetToken', {
    name: "entryEnrollAccount",
    triggersEnter: [function(context, redirect) {
        //redirect('/some-other-path');
        Session.set('entryError', void 0);
        Session.set('resetToken', context.params.resetToken);
    }],
    action: function(params, queryParams) {
        //console.log(AccountsEntry.settings);
        BlazeLayout.render('layoutFlowRouter', { maintp: "entryEnrollAccount" });
    }
});

exposed.route('/verify-email/:token', {
    name: "verifyEmail",
    action: function(params, queryParams) {
        //BlazeLayout.render('layoutFlowRouter', { maintp: "verifyEmail" });
        console.log(params.token);

        Accounts.verifyEmail(params.token, function () {
            FlowRouter.go('/verified');
        });
    }
});

// if verifying successfully
exposed.route('/verified', {
    name: "verified",
    action: function(params, queryParams) {
        //console.log(AccountsEntry.settings);
        BlazeLayout.render('layoutFlowRouter', { maintp: "verified" });
    }
});

function checkLoggedInUser(context, redirect, stop) {
    if (!(Meteor.loggingIn() || Meteor.userId())) {
        var route = FlowRouter.current();
        if (route.route.name !== 'entrySignIn') {
            Session.set('fromWhere', route.path);
        }
        return FlowRouter.go("/sign-in");
    }
};

function checkAdminRole(context, redirect, stop) {
    if(! Roles.userIsInRole(Meteor.user(), [ 'admin' ])) {
        FlowRouter.go(FlowRouter.path(''));
    }
}

// redirect user to his page after logged in
Accounts.onLogin(function() {
    var redirect = Session.get('fromWhere');
    if (redirect != null) {
        if (redirect !== '/sign-in') {
            console.log(Session.get('fromWhere'));
            console.log('hlo');
            return FlowRouter.go(redirect);
        }
    }
});