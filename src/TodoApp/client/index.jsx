import { Accounts } from 'meteor/accounts-base';

import 'TodoApp/methods';
import './routes';

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
