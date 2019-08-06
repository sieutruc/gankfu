Meteor.methods({
  /*'createUserWithRole': function(data, role) {
    var userId;

    Meteor.call('createUserNoRole', data, function(err, result) {
      if (err) {
        return err;
      }
      Roles.addUsersToRoles(result, role);
      return userId = result;
    });
    return userId;
  },*/
  'createUserNoRole': function(data) {
    //Do server side validation
    return Accounts.createUser({
      email: data.email,
      password: data.password,
      profile: data.profile
    });
  }
});