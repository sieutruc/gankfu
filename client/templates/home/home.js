Template.home.helpers({
	searchNotDefine: function() {
		return !Session.get('searchQuery'); 
	}
});