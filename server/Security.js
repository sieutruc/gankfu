/**
 * Created by hacops on 17/12/2015.
 */


/*collections['users'].permit(['insert','update','remove']).never().apply();

collections['activities'].permit(['insert','update','remove']).never().apply();

collections['chatrooms'].permit(['insert','update']).apply();
collections['chatrooms'].permit(['remove']).never().apply();

collections['games'].permit(['insert','update','remove']).never().apply();

collections['images'].permit(['insert','update','remove']).never().apply();

collections['likes'].permit(['insert','update','remove']).never().apply();*/

/*Notifications.allow({
 update: function(userId, doc, fieldNames) {
 return ownsDocument(userId, doc) &&
 fieldNames.length === 1 && fieldNames[0] === 'read';
 }
 });
 collections['notifications'].permit(['insert']).apply();*/