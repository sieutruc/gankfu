// npm install --save body-parser
// meteor install meteorhacks:picker - server router
var bodyParser = require("body-parser");
import {Picker} from 'meteor/meteorhacks:picker';

if (Meteor.isServer) {

    // parse requests' body under format json or urlencode
    Picker.middleware( bodyParser.json() );
    Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

    var config = {
        host:process.env.ELASTIC_URL || "http://localhost:9200",
        index:'meteor',
        queryProcessor:function(query, req, res){
            //do neccessery permissions, prefilters to query object
            //then return it
            return query
        }
    };

    var request = require("request");

    var requestClient = request.defaults({
        pool: {
            maxSockets: config.maxSockets || 1000
        }
    });

    var elasticRequest = function(url, body){
        var fullUrl = config.host+ "/" + config.index + url;
        //var fullUrl = "http://localhost:9200/recipes" + url;
        if(_.isObject(body)){
            console.log("Request body", body)
        }
        return requestClient.post({
            url:fullUrl,
            body:body,
            json:_.isObject(body),
            forever:true
        }).on("response", function(response){
            console.log("Finished Elastic Request", fullUrl, response.statusCode)
        }).on("error", function(response){
            console.log("Error Elastic Request", fullUrl,response.statusCode)
        })
    };

    var POST = Picker.filter(function( req, res ) {
        return req.method == "POST";
    });

    // the api point "host/elsearch" is used to query el server
    POST.route('/elsearch/_search', function( params, req, res, next ) {
        var queryBody = config.queryProcessor(req.body || {}, req, res)
        elasticRequest("/_search", req.body).pipe(res);
        //response.end( "Hello!" );
    });
}