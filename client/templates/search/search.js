var cursor = null;

// rerun everytime the url changes
var searchByDistance = function(params) {

  Session.set('searchQuery',params);

  var componentMethods = UsersIndex.getComponentMethods();

  componentMethods.addProps('distanceFilter', params['distanceFilter']);
  componentMethods.search(params['locationSearch']);

  cursor = componentMethods.getCursor();
}

var testSearchParams = function() {

  //var locationSearch = "Paris, France";
  //var distanceFilter = 5;

  /*if(!$(".tt-suggestion.tt-selectable > h4 >i")[0] && (
   ! $(".tt-suggestion.tt-selectable > h4 >i")[0].textContent ||
   ! $(".tt-suggestion.tt-selectable > h4 >i")[0].innerText ) ){
   return null ;
   }
   locationSearch = $(".tt-suggestion.tt-selectable > h4 >i")[0].textContent || $(".tt-suggestion.tt-selectable > h4 >i")[0].innerText;

   $("#searchbox")[0].value = locationSearch;*/

  var locationSearch = "Paris, France";

  if( ! $("#distanceOptions")[0] && parseInt(options.search.props['distanceFilter']) === NaN) {
    return null;
  }
  distanceFilter = $("#distanceOptions")[0].value.trim();

  return {"locationSearch": locationSearch,
    "distanceFilter": distanceFilter };
}

Template.distanceFilter.events({
  'change select': function (e) {
    FlowRouter.setQueryParams({d:e.target.value});
  }
});

Template.searchGeneralPage.onRendered(function () {
  var instance =  Template.instance();
  instance.autorun(function() {
    var distanceFilter = FlowRouter.getQueryParam('d');
    var locationSearch = FlowRouter.getQueryParam('l');

    if (distanceFilter && typeof(parseInt(distanceFilter)) === "number") {
      var distanceFilter = parseInt(distanceFilter);

      if (distanceFilter < 20)
        distanceFilter = 10;
      else if (distanceFilter >= 20 && distanceFilter < 40)
        distanceFilter = 20;
      else if (distanceFilter >= 40 && distanceFilter < 80)
        distanceFilter = 40;
      else if (distanceFilter >= 80 && distanceFilter < 200)
        distanceFilter = 80;
      else
        distanceFilter = 200;
    }
    else
      distanceFilter = $("#distanceOptions")[0].value.trim();

    if (! locationSearch || typeof(locationSearch) != "string")
      locationSearch = "";

    $("#distanceOptions")[0].value = distanceFilter;
    $("#searchbox").val(locationSearch);

    if(locationSearch)
      searchByDistance({"locationSearch": locationSearch,
        "distanceFilter": distanceFilter });
  });
});

Template.searchGeneralPage.helpers({
  searchDefined: function() {
    return !!Session.get('searchQuery');
    //return true;
  },
});

Template.userPage.helpers({
  index: function () {
    return UsersIndex;
  },
  resultsCount: function () {
    return UsersIndex.getComponentDict().get('count');
  }
});

Template.userSearchBar.rendered = function() {
  // initializes all typeahead instances
  Meteor.typeahead.inject();
};

Template.userSearchBar.events({
  "click .trigger": function(event) {
    event.preventDefault();
    var locationSearch = "";
    if ($(".tt-suggestion.tt-selectable > h4 >i")[0])
      locationSearch = $(".tt-suggestion.tt-selectable > h4 >i")[0].textContent || $(".tt-suggestion.tt-selectable > h4 >i")[0].innerText;
    if(!locationSearch)
      locationSearch = $("#searchbox").value;
    console.log(locationSearch);
    if (locationSearch) {
      FlowRouter.setQueryParams({l: locationSearch});
    }
  }
});

Template.userSearchBar.helpers({
  index: function () {
    return UsersIndex;
  },
  typeaheadAttributes: function() {
    return { "class": "form-control typeahead", "id": "searchbox", "name": "user",
      "type": "text", "placeholder": "Search...", "autocomplete": "off", "spellcheck": "off",
      "data-sets": "users", "data-highlight": 'true' };
  },
  users: function(){
    return [
      {
        name: 'address',
        valueKey: 'name',
        displayKey: 'value',
        /*local: function() {
         return Nba.find().fetch();
         },*/
        source: _.debounce(function(query, sync, callback) {
          Meteor.call('getAddress', query, {}, function(err, res) {
            if (err) {
              console.log(err);
              return;
            }
            // cannot use value key for the directive "valueKey", by default it takes 'name'
            if(!_.isEmpty(res))
              callback(res.map(function(v){
                //console.log(v);
                return {value: v.description,
                  name : v.description};
              }));
          });
        },100),
        header: '<h3 class="addressInput">ADDRESS</h3>',
        template: 'userSuggest'
      },
      {
        name: 'username',
        valueKey: 'name',
        displayKey: 'name',
        /*source: function(query, sync, callback) {
         Meteor.call('getDocFromCollection', 'users', 'phyAdd.add', query, {}, function(err, res) {
         if (err) {
         console.log(err);
         return;
         }
         // cannot use value key for the directive "valueKey", by default it takes 'name'
         callback(res.map(function(v){
         return {value: v.phyAdd.add,
         name : v.phyAdd.add};
         }));
         });
         },*/
        local: function() {
          return [];
        },
        header: '<h3 class="usernameInput">USERNAME</h3>',
        template: 'userSuggest'
      },
    ];
  }
});

Template.gankfu_Each.helpers({
  doc() {
  var stopPublication = UsersIndex
          .getComponentDict(this.name)
          .get('stopPublication')
      ;

  cursor && stopPublication && cursor.stop();

  var componentMethods = UsersIndex.getComponentMethods();

  if( cursor && cursor.mongoCursor ) {
    cursor = componentMethods.getCursor();
    return cursor.fetch();
  }
  else
  {
    return [];
  }
}
});

Template.gankfu_Each.onCreated(function() {
  var instance = this;
  instance.autorun(function () {
    var ids = UsersIndex.config.searchCollection._collection.findOne().ids;
    var subsInvitations = instance.subscribe('invitationFromSearchResult', ids);
    var subsLikes = instance.subscribe('getLikesAndGamesFromIds', ids);
  });
});

Template.userInfo.onCreated(function(){
  Template.instance().data.optionFilter = new ReactiveVar("");
});

Template.userInfo.helpers({
  subsribedGames: function(){

    var likes = Likes.find({userId: this.__originalId});
    var gameIds = _.uniq(_.pluck(likes.fetch(), 'gameId'));

    return Games.find({_id: {$in: gameIds}});
  },
  isFiltered: function() {
    return !!Template.instance().data.optionFilter.get();
  },
  getFilter: function() {
    return Template.instance().data.optionFilter.get();
  }
});

Template.inviteFilter.rendered = function() {
  var today = new Date();
  var m = moment(today);
  var limitDate = m.add(1,'months');
  $('.datepicker').pickadate({
    min: today,
    max: m.toDate(),
    weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    showMonthsShort: true
  });
};

Template.inviteFilter.events({
  "click #sendInviteId": function(e,tmp) {
    e.preventDefault();

    var chosenDate = $('#timeInviteId').val();
    //console.log(User.checkInvitationTimeValidity(chosenDate));

    var timeCheck = User.checkInvitationTimeValidity(chosenDate);

    if(timeCheck === 1) {
      var parentTemp = Template.parentData(1);

      var invitedUser = User.createEmpty(Template.parentData(1).__originalId);
      invitedUser.requestInvitation(this.data._id, moment(chosenDate).toDate(), function (err, res) {
        if (err) {
          sAlert.error(err.reason);
          return;
        }
        parentTemp.optionFilter.set("");
      });
    } else if(timeCheck === 0) {
      sAlert.error("Your chosen date must be from today to the same day of next month !");
    } else if (timeCheck === -1) {
      sAlert.error("Your chosen date is not valid !");
    }
  }
});

Template.inviteFilter.helpers({
  gameName: function() {
    return this.data.name;
  }
});

Template.subscribeGameTP.onCreated(function () {
  Template.instance().data.disabledBt = new ReactiveVar("");
});

Template.subscribeGameTP.events({
  "click ": function(e) {
    e.preventDefault();
    if( Meteor.userId()) {
      var gameId = this._id;
      if (Template.instance().data.disabledBt.get() === "requesting") {
        var invitedUser = User.createEmpty(Template.parentData(1).__originalId);
        invitedUser.cancelInvitation(gameId, function (err, res) {
          if (err) {
            console.log(err);
            sAlert.error(err.reason);
          }
        });
      } else if (Template.instance().data.disabledBt.get() === "request") {
        if(Template.parentData(1).optionFilter.get()
            && Template.parentData(1).optionFilter.get().name === Template.instance().data.name) {
          Template.parentData(1).optionFilter.set("");
        }else {
          Template.parentData(1).optionFilter.set(this);
        }
        //Session.set('chosenUsername', )
      } else if (Template.instance().data.disabledBt.get() === "valid") {
        //TODO
      } else if (Template.instance().data.disabledBt.get() === "disabled") {
        //TODO

        sAlert.error("You cannot invite this person at the moment. Perhaps your invitation has been ignored or blocked by that user");
      }
    } else {
      // the user does not log in
      //TODO

      sAlert.error("Please log in in order to send an invitation.");
    }
  }
});

Template.subscribeGameTP.helpers({
  invitedAlready: function() {
    // get the template of user to check if it has already an invitation from the current user
    var gameId = this._id;
    var invitedUser = User.createEmpty(Template.parentData(1).__originalId);
    var stateBt = Template.instance().data.disabledBt.get();
    if(stateBt === "requesting") {
      return "glyphicon-refresh glyphicon-refresh-animate";
    }else if( stateBt === "valid") {
      return "glyphicon-ok";
    }else if (stateBt === "disabled") {
      return "glyphicon-lock";
    }
    return "";
  },
  getName: function() {
    return this.name;
  },
  dataState: function() {
    var gameId = this._id;
    var invitedUser = User.createEmpty(Template.parentData(1).__originalId);
    var code = invitedUser.hasInvitationFrom(Meteor.user(), gameId);
    //console.log("code is:", code, " game:",gameId);
    if (code === 1) {
      Template.instance().data.disabledBt.set("requesting");
      return "requesting";
    } else if (invitedUser.isAcquaintancesWith(Meteor.user(), gameId)) {
      Template.instance().data.disabledBt.set("valid");
      return "valid";
    } else if (code > 1) {
      Template.instance().data.disabledBt.set("disabled");
      return "disabled";
    }else {
      Template.instance().data.disabledBt.set("request");
      return "request";
    }
  }
});