AccountsEntry.hashPassword = (password) ->
  digest: SHA256(password),
  algorithm: "sha-256"

#Template.signupForm.helpers
#  users: ->
#    Meteor.users
#  userSchema: ->
#    Schema.User

AccountsEntry.entrySignUpHelpers = {
  showEmail: ->
    fields = AccountsEntry.settings.passwordSignupFields

    _.contains([
      'USERNAME_AND_EMAIL',
      'USERNAME_AND_OPTIONAL_EMAIL',
      'EMAIL_ONLY'], fields)

  showUsername: ->
    fields = AccountsEntry.settings.passwordSignupFields

    _.contains([
      'USERNAME_AND_EMAIL',
      'USERNAME_AND_OPTIONAL_EMAIL',
      'USERNAME_ONLY'], fields)

  showLocation: ->
    AccountsEntry.settings.showLocation

  showSignupCode: ->
    AccountsEntry.settings.showSignupCode

  logo: ->
    AccountsEntry.settings.logo

  privacyUrl: ->
    AccountsEntry.settings.privacyUrl

  termsUrl: ->
    AccountsEntry.settings.termsUrl

  both: ->
    AccountsEntry.settings.privacyUrl &&
    AccountsEntry.settings.termsUrl

  neither: ->
    !AccountsEntry.settings.privacyUrl &&
    !AccountsEntry.settings.termsUrl

  emailIsOptional: ->
    fields = AccountsEntry.settings.passwordSignupFields

    _.contains(['USERNAME_AND_OPTIONAL_EMAIL'], fields)

  emailAddress: ->
    Session.get('email')
}

AccountsEntry.entrySignUpEvents = {
  'keyup #place': (event, t) ->
    #$("input[name='longitude']").val("")
    #$("input[name='latitude']").val("")


  'submit #signUp': (event, t) ->
    event.preventDefault()

    Session.set('entryError', "")

    username =
      if t.find('input[name="username"]')
        t.find('input[name="username"]').value.toLowerCase()
      else
        undefined
    if username and AccountsEntry.settings.usernameToLower then username = username.toLowerCase()

    signupCode =
      if t.find('input[name="signupCode"]')
        t.find('input[name="signupCode"]').value
      else
        undefined

    trimInput = (val)->
      val.replace /^\s*|\s*$/g, ""

    email =
      if t.find('input[type="email"]')
        trimInput t.find('input[type="email"]').value
      else
        undefined
    if AccountsEntry.settings.emailToLower and email then email = email.toLowerCase()

    formValues = SimpleForm.processForm(event.target)
    extraFields = _.pluck(AccountsEntry.settings.extraSignUpFields, 'field')
    filteredExtraFields = _.pick(formValues, extraFields)
    filteredExtraFields["username"] = username || email		
    
    password = t.find('input[type="password"]').value

    fields = AccountsEntry.settings.passwordSignupFields

    #console.log(filteredExtraFields);
    passwordErrors = do (password)->
      errMsg = []
      msg = false
      if password.length < 7
        errMsg.push t9n("error.minChar")
      #if password.search(/[a-z]/i) < 0
      #  errMsg.push t9n("error.pwOneLetter")
      #if password.search(/[0-9]/) < 0
      #  errMsg.push t9n("error.pwOneDigit")

      if errMsg.length > 0
        msg = ""
        errMsg.forEach (e) ->
          msg = msg.concat "#{e}\r\n"

        Session.set 'entryError', msg
        return true

      return false

    if passwordErrors then return

    emailRequired = _.contains([
      'USERNAME_AND_EMAIL',
      'EMAIL_ONLY'], fields)

    usernameRequired = _.contains([
      'USERNAME_AND_EMAIL',
      'USERNAME_ONLY'], fields)

    if usernameRequired && username.length is 0
      Session.set('entryError', t9n("error.usernameRequired"))
      return

    if username && AccountsEntry.isStringEmail(username)
      Session.set('entryError', t9n("error.usernameIsEmail"))
      return

    if emailRequired && email.length is 0
      Session.set('entryError', t9n("error.emailRequired"))
      return

    if AccountsEntry.settings.showSignupCode && signupCode.length is 0
      Session.set('entryError', t9n("error.signupCodeRequired"))
      return

    place =
      if t.find('input[name="place"]')
        t.find('input[name="place"]').value
      else
        undefined

    location =
      latitude: if t.find('input[name="latitude"]')
                  t.find('input[name="latitude"]').value
                else
                  undefined
      longitude: if t.find('input[name="longitude"]')
                  t.find('input[name="longitude"]').value
                else
                  undefined

    placeObj = 
      place: place
      location: location
    #console.log placeObj

    if AccountsEntry.settings.showLocation && place.length is 0
      Session.set('entryError', t9n("error.locationRequired"))
      return

    #Meteor.call 'entryValidateSignupCode', signupCode, (err, valid) ->
    Meteor.call 'testSchema', placeObj, (err, notValid) ->
      #console.log('valid');
      #console.log(notValid);
      if not notValid
        newUserData =
          username: username
          email: email
          password: AccountsEntry.hashPassword(password)
          profile: filteredExtraFields
        Session.set 'talkingToServer', true
        Meteor.call 'entryCreateUser', newUserData, (err, data) ->
          Session.set 'talkingToServer', false
          if err
            console.log err
            T9NHelper.accountsError err
            return
          #login on client
          isEmailSignUp = _.contains([
            'USERNAME_AND_EMAIL',
            'EMAIL_ONLY'], AccountsEntry.settings.passwordSignupFields)
          if isEmailSignUp 
            userCredential = email 
          else 
            userCredential = username
          if AccountsEntry.settings.signInAfterRegistration is true
            Session.set 'talkingToServer', true
            Meteor.loginWithPassword userCredential, password, (error) ->
              Session.set 'talkingToServer', false
              if error
                console.log error
                T9NHelper.accountsError error
              else if Session.get 'fromWhere'
                FlowRouter.go Session.get('fromWhere')
                Session.set 'fromWhere', undefined
              else
                FlowRouter.go AccountsEntry.settings.dashboardRoute

          else
            if AccountsEntry.settings.emailVerificationPendingRoute
              FlowRouter.go AccountsEntry.settings.emailVerificationPendingRoute
      else
        console.log err
        Session.set 'entryError', notValid
        return
}

Template.entrySignUp.rendered  = ->
  $("#hideTheMap").hide()
  if AccountsEntry.settings.showLocation
    @autorun ->
      if GoogleMaps.loaded()

        $('#place').geocomplete(
          map: $("#map"),
          mapOptions: {
            zoom: 10
          },
          location : [48.85661400000001, 2.3522219000000177]
        ).bind 'geocode:result', (event, result) ->
          loc =
            latitude: result['geometry']['location'].lat()
            longitude: result['geometry']['location'].lng()
          $("#hideTheMap").show()
          $("input[name='longitude']").val(loc.longitude)
          $("input[name='latitude']").val(loc.latitude)


Template.entrySignUp.helpers(AccountsEntry.entrySignUpHelpers)

Template.entrySignUp.events(AccountsEntry.entrySignUpEvents)