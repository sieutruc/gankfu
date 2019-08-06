Template.entryExtraSignUpFields.helpers
  extraSignUpFields: ->
    AccountsEntry.settings.extraSignUpFields

Template._entryExtraSignUpField.helpers
  isTextField: ->
    @type is "text_field"

  isCheckbox: ->
    @type is "check_box"

	