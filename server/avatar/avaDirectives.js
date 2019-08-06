Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
  bucket: Meteor.settings.AWSBucket,
  region: Meteor.settings.AWSRegion,
  acl: "public-read",

  authorize: function () {
    return true;
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    var user = Meteor.users.findOne(this.userId);
    return "users/avatars/" + user._id + "/" + file.name;
  }
});
