function isJSON (something) {
    if (typeof something != 'string')
        something = JSON.stringify(something);

    try {
        var test = JSON.parse(something);
        console.log(test);
        return true;
    } catch (e) {
        return false;
    }
}

Meteor.methods({
  saveProfileInfo: function(doc, docId) {
    // should show loading when verifying the location

    var id = this.userId;
    if (!id) {
        throw new Meteor.Error(403, "You must be logged in");
    }
    
    if(docId) {
      var location = [];
      var addressList = doc['$set']["phyAdd.add"];
      var test = JSON.parse(addressList);
      if(test.formattedAddress) {
        if(Meteor.isServer) {
          var geo = new GeoCoder();
          var location = test.formattedAddress;
          var userPlaces = geo.geocode(location);
          if (!userPlaces)
            throw new Meteor.Error(505, 'locationInvalid');
          // get the first element of the result
          var userPlace = userPlaces[0];
          console.log(userPlace);
          doc['$set']["phyAdd.streetNumber"] = userPlace['streetNumber'];
          doc['$set']["phyAdd.streetName"] = userPlace['streetName'];
          doc['$set']["phyAdd.city"] = userPlace['city'];
          doc['$set']["phyAdd.state"] = userPlace['state'];
          doc['$set']["phyAdd.country"] = userPlace['country'];
          doc['$set']["location"] = [userPlace['longitude'],userPlace['latitude']];
        }
        doc['$set']["phyAdd.add"] = test.formattedAddress;
      } else {
        doc['$set']["phyAdd.add"] = addressList.replace(/("|')/g,'');
      }
      check(doc,Schema.User);
      //console.log(doc);
      var modifier = doc;
      Meteor.users.update({_id:docId}, modifier);      
    }
    else {
      throw new Meteor.Error(403, 'Your action is forbidden');
      //PropertySchema.clean(doc);

      //PropertiesCollection.insert(doc, function(error, result) {
       // if(Meteor.isClient) {
       //   if(!error && result) {
            // console.log('success');
       //   }
       // }
      //});
    }
  },
});