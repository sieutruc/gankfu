
UsersIndex = new EasySearch.Index({
  collection: collections['users'],
  fields: ['location'],
  engine: new EasySearch.ElasticSearch({
    /*body: function() { 
      return {"query": { "match_all": {} },
      "sort": { "score": { "order": "desc" } },
      "fields": [ "_id" ]
      }
    }*/ // modify the body that's sent when searching


    query: function(searchObject, options) {
      //return { "match_all" : {} };
      //console.log(searchObject);


      var params = testSearchParams(searchObject, options);

      if(! params) {
        return [];
      }

      console.log(params);

      var lat = options.search.props['coordinates'][0];
      var lon = options.search.props['coordinates'][1];

      //console.log(lat,lon);

      //Meteor._sleepForMs(5000);

      return {
        "filtered" : { 
          "query" : {
              "match_all" : {}
          },
          "filter" : {
              "geo_distance" : {
                  "distance" :  params['distanceFilter'],
                  "location" : {
                      "lat" : lat,//47.428652900050814,
                      "lon" : lon//1.123161430611986
                  }
              }
          }
        }
      }
    },
    sort: function(searchObject, options) {
      //console.log(options.search.props['coordinates']);
      //return {"score": { "order" : "desc" }};
      var lat = options.search.props['coordinates'][0];
      var lon = options.search.props['coordinates'][1];
      return {
        "_geo_distance" : {
            "location" : {
                  "lat" : lat,//47.428652900050814,
                  "lon" : lon//1.123161430611986
            },
            "order" : "asc",
            "unit" : "km"
        }
      }
      /*return {
        "location" : { $near : [ lon, lat ] } 
      }*/
    }
  }),
  defaultSearchOptions: {
    limit: 8,
    // list of fields that will be displayed in the search results
    filteredFields: {
      emails: 1,
      profile: 1,
      location: 1,
      phyAdd: 1
    }
  },
  indexName: "meteor",
  permission: () => {
    //console.log(Meteor.userId());

    return true;
  }
});

var testSearchParams = function(searchObject, options) {

  var location = [];

  /*if(searchObject['location']) {
    location =  geo.geocode(searchObject['location']);
    if( ! location)
      return null;
    else
      location = location[0];
  } else
    return null;*/

  options.search.props['coordinates'] = [ 48.856614, 2.3522219 ];//[location['latitude'],location['longitude']];

  console.log('location:',options.search.props['coordinates']);

  if( ! options.search.props['distanceFilter'] || parseInt(options.search.props['distanceFilter']) === NaN
      || options.search.props['distanceFilter'] < 5 )
    options.search.props['distanceFilter'] = 5;
  else if (options.search.props['distanceFilter'] > 200 )
    options.search.props['distanceFilter'] = 200;

  var distance = options.search.props['distanceFilter'] + "km";

  return { "distanceFilter": distance }; 
}

