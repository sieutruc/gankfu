Meteor.methods({
	/*getDocFromCollection: function(collection, searchField, query, options) {
		if (!query) return [];

		options = options || {};

		// guard against client-side DOS: hard limit to 6, cannot be lower than 6
		if (options.limit) {
			options.limit = Math.min(6, Math.abs(options.limit));
		} else {
			options.limit = 8;
		}
		// TODO fix regexp to support multiple tokens
		var regex = new RegExp(query);
		var searchLookup = {};
		// specifiy the search lookup phrase
		searchLookup[searchField] = {$regex:  regex, $options: "si"};
		return collections[collection].find(searchLookup, options).fetch();
	},
	searchUserCB: function(values) {

		userPages.set("filters", {
			"phyAdd.priv": 0,
			location: {$near: { $geometry: {type:"Point",coordinates:[50.181728, 2.767958]},$maxDistance: parseInt(values['distance'])}},
		});
	}*/
	getAddress:function(string,cb) {
    // we need to use "future" because our calls are async and the client
    // needs to wait to set values until after they come back from the server
    Future = Npm.require('fibers/future');
    var fut = new Future();

    var params = {
      'key':    'AIzaSyDXvt37-6vPUhkff5AZCGHJPZe_XYKe-eU',
      'input': string
    };

    console.log('resolve location');

    //var response = Async.runSync( function(done) {

    HTTP.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {params:params}, function(err,res) {
      /*
       description: 'Paris 16, Paris, France',
        id: 'a8b51abb493d643147bb50c16f64e264ddbe283f',
        matched_substrings: [ [Object] ],
        place_id: 'ChIJ6VVDJrN65kcRQBuUaMOCCwU',
        reference: 'CjQvAAAAhCKdoXrf2RPHXzKd90ik5jnDIBZ_GcEVi6xchTU1Zekl5XO0u7JZrkEAACdi37OkEhCgOQsZf8VYDbd4HsP_vTbbGhRLVOUX_40s43ds7VKM3FFgNlu9vQ',
        terms: [ [Object], [Object], [Object] ],
        types: [ 'sublocality_level_1', 'sublocality', 'political', 'geocode' ] },
      */
        if(err) {
            fut.return({});
        }
        var result = JSON.parse(res.content);
        var address = _.map(result['predictions'],function(suggestion) {
          return _.pick(suggestion,'description','place_id');
        });
        //done(null,address);
		
        fut.return(address);
      //});
    });

    //return response.result;
    return fut.wait();
  }
});