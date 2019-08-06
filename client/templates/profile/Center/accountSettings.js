/**
 * Created by David on 6/26/2015.
 */

// hook on the error returned from the server
var hooksObject = {
    onError: function(formType, error) {
        console.log(error);
        this.validationContext.addInvalidKeys([{name: "phyAdd.add", type: error.reason}]);
    },
};

AutoForm.hooks({
  updateBaiscInfoUser: hooksObject
});

Template.accountSettings.rendered = function() {
    Deps.autorun(function(){

         //All my data. Provide only to logged-in users.
         Meteor.subscribe('myProfileInformation');
        }
    );
}

Template.accountSettings.helpers({
    userProfile: function() {
        return Meteor.user();
    }
});


Template.accountSettings.events({
    "click #modifyProfileInfo": function (event, template) {
        event.preventDefault();
        var profile = {
            firstname: template.find(".firstName").value,
            lastname: template.find(".lastName").value,
            location: template.find(".address").value
        };

        Meteor.call('modifyProfile', profile);
        var msg ="Profile Saved Successfully";

        // use sAlert here
    }
});



///// MUST CREATE 1 VARIABLE TO SEND ALL AT ONCE
Template.accountSettings.events = {
    "keypress": function (evt, template) {
        if (evt.which === 13) {

            var profile = {
                firstname: template.find(".firstName").value,
                lastname: template.find(".lastName").value,
                location: template.find(".address").value
            };
            Meteor.call('modifyProfile', profile);
        }
    }
};