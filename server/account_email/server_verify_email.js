
Meteor.startup(function () {
  // test with gmail
  process.env.MAIL_URL="smtp://gankfu%40gmail.com:Dota123456789@smtp.gmail.com:465/";
  // test with SendGrid
  // process.env.MAIL_URL = 'smtp://your_username:your_password@smtp.sendgrid.net:587';
  /*Email.send({
    from: "hackerjvn@gmail.com",
    to: "sieutruc@gmail.com",
    subject: "Meteor Can Send Emails via Gmail",
    text: "Its pretty easy to send emails via gmail."
  }); */
  Accounts.config({
    sendVerificationEmail: true, // send mail after sign in
    loginExpirationInDays: 30, // expiration days
  });

  PrettyEmail.options = {
    from: 'hackerjvn@gmail.com',
    logoUrl: 'http://localhost:3000/img/logo.png',
    companyName: 'Gankfu',
    companyUrl: 'http://gankfu.com',
    companyAddress: '123 Street, ZipCode, City, Country',
    companyTelephone: '+1234567890',
    companyEmail: 'support@mycompany.com',
    siteName: 'gankfu.com',
  }

  
  /*PrettyEmail.send('call-to-action',{
  to: 'sieutruc@gmail.com',
  subject: 'You got new message',
  heading: 'Your friend sent you a message',
  message: 'Click the button below to read the message',
  buttonText: 'Read message',
  buttonUrl: 'http://mycompany.com/messages/2314'
  });*/
 //Accounts.sendVerificationEmailM(Meteor.userId(),
 //Accounts.sendResetPasswordEmail Meteor.userId()
 //Accounts.sendEnrollmentEmail Meteor.userId()
});

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl('verify-email/' + token);
};

Meteor.methods({
  serverVerifyEmail: function(email, userId, callback) {
    console.log("Email to verify:" +email + " | userId: "+userId);
    // this needs to be done on the server.
    Accounts.sendVerificationEmail(userId, email);
    if (typeof callback !== 'undefined') {
      callback();
    }
  }
})