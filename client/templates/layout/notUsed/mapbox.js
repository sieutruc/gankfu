Template.form_map.rendered = function() {

	/*Session.set("currentLatLng",{
		location: "Paris, France",
		geocoding: [48.888406499999995,2.2559593]
	});*/

    L.mapbox.accessToken = 'pk.eyJ1IjoidHJlcGFmaSIsImEiOiJEZG5BWnFBIn0.yhwue_c8WV0KZYUDRDoj-A';

    var map = L.mapbox.map('map', 'sieutruc.db2f8cc2');

    var geocoder = L.mapbox.geocoder('mapbox.places');

    /*geocoder.query('289 avenue Georges Clemenceau Nanterre Paris', showMap);

	function showMap(err, data) {
    // The geocoder can return an area, like a city, or a
    // point, like an address. Here we handle both cases,
    // by fitting the map bounds to an area or zooming to a point.
    	//console.log(data);
	    if (data.lbounds) {
	        map.fitBounds(data.lbounds);
	    } else if (data.latlng) {
	        map.setView([data.latlng[0], data.latlng[1]], 13);
	    }
	}*/

	// customize the location search bar
	var geocoderControl = L.mapbox.geocoderControl('mapbox.places', {
        autocomplete: true,
        keepOpen: true
    });

	geocoderControl.addTo(map);

	// create a location search bar
	var searchElement = $(".leaflet-control-mapbox-geocoder").detach();
	$("#placeSearchBar").append(searchElement);
	

	currentMarker = L.marker(Session.get("currentLatLng").geocoding, {
	  title: "user's current location",
	  draggable: false
	}).bindPopup("Your location").openPopup().addTo(map);

	$(".leaflet-control-mapbox-geocoder-form input").val(Session.get("currentLatLng").placename);

	// triggered when user selects a entry in the suggested location list
	geocoderControl.on('select', function(feature) {
	  selectedPlace = feature.feature.geometry;
	  map.setView([selectedPlace.coordinates[1],selectedPlace.coordinates[0]]);
	  currentMarker.setLatLng([selectedPlace.coordinates[1],selectedPlace.coordinates[0]]);
	  currentMarker.addTo(map);
	  Session.set("currentLatLng",{
	  	"lat": selectedPlace.coordinates[1],
	  	"lng":selectedPlace.coordinates[0]
	  });
	  Session.set("currentLatLng",{
		placename: feature.feature.place_name,
		geocoding: [selectedPlace.coordinates[1],selectedPlace.coordinates[0]]
	  });
	});

	// use the marker created above instead of using the marker of the default control
	L.Control.MyLocate = L.Control.Locate.extend({
  		createMarker: function(latlng, mStyle) {
    //console.log(currentMarker);
     		currentMarker.setLatLng(latlng);
            return currentMarker;
        },
        removeMarker: function() {
            this._layer.clearLayers();
            this._marker = undefined;
            this._circle = undefined;
            currentMarker.addTo(map);
        },
        options: {
        	drawCircle: false
        }
	});

	var lc = new L.Control.MyLocate();

	lc.addTo(map);

	// move the button of getting current location to the search bar
	var locateElement = $("div.leaflet-control-locate.leaflet-bar.leaflet-control").detach();
	$("#placeSearchBar").append(locateElement); 

	// this event triggered when the geolocation of browser can detect current location
	map.on('locationfound', onLocationFound);
	 
	function onLocationFound(e) {
	    // create a marker at the users "latlng" and add it to the map
	    //L.marker(e.latlng).addTo(map);
	    currentLocationMarker = lc._marker;
	    geocoder.reverseQuery(e.latlng, function(err, json) {
		if (err)
			console.log(err);
		else
			if(json.features.length) {
				//console.log(json.features[0].place_name);
				Session.set("currentLatLng",{
					placename: json.features[0].place_name,
					geocoding: [e.latlng.lat,e.latlng.lng]
				});
				$(".leaflet-control-mapbox-geocoder-form input").val(json.features[0].place_name);
			}
	});

	}
};

Template.form_map.helpers({
	getLatLng: function() {
		var currentLatLng = Session.get("currentLatLng");
		return JSON.stringify(currentLatLng);
	}
});