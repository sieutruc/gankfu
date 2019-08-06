import { FlowRouter } from 'meteor/meteorhacks:flow-router';

import 'TodoApp/client';

Meteor.startup(function() {
  FlowRouter.initialize();
});
