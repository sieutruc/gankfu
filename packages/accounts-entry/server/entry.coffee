Meteor.startup ->

  Accounts.urls.resetPassword = (token) ->
    Meteor.absoluteUrl('reset-password/' + token)

  Accounts.urls.enrollAccount = (token) ->
    Meteor.absoluteUrl('enroll-account/' + token)

  AccountsEntry =
    settings: {}

    config: (appConfig) ->
      @settings = _.extend(@settings, appConfig)

  @AccountsEntry = AccountsEntry

  Accounts.onCreateUser (options, user) ->
    if options['phyAdd']
      user['phyAdd'] = options['phyAdd']
    if options['location']
      user['location'] = options['location']

    if options.profile
      user.profile = options.profile

    user


  Meteor.methods
    testSchema: (accountSingup) ->
      test = accountTestContext.validate(accountSingup)
      if not test
        accountTestContext.keyErrorMessage("place")
      #console.log accountTestContext.invalidKeys()
      

    entryValidateSignupCode: (signupCode) ->
      check signupCode, Match.OneOf(String, null, undefined)
      not AccountsEntry.settings.signupCode or signupCode is AccountsEntry.settings.signupCode

    entryCreateUser: (user) ->
      check user, Object
      check userPlace, Object
      profile = AccountsEntry.settings.defaultProfile || {}

      physicalAddr = 
        streetNumber: userPlace['streetNumber']
        streetName: userPlace['streetName']
        city: userPlace['city']
        state: userPlace['state']
        country: userPlace['country']
        add: userPlace['place']
        priv: 0
      locationPoint = [userPlace['longitude'],userPlace['latitude']]
        #type: "Point"
        #coordinates: [userPlace['latitude'],userPlace['longitude']]

      if user.username
        userId = Accounts.createUser
          username: user.username,
          email: user.email,
          password: user.password,
          profile: _.extend(profile, user.profile),
          location: locationPoint
          phyAdd: physicalAddr
      else
        userId = Accounts.createUser
          email: user.email,
          password: user.password,
          profile: _.extend(profile, user.profile),
          location: locationPoint
          phyAdd: physicalAddr
      if (user.email && Accounts._options.sendVerificationEmail)
        Accounts.sendVerificationEmail(userId, user.email)
