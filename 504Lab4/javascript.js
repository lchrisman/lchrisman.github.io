window.onload = function(){
alert('If you give it permission, this web page will access to your location in order to demonstrate how device sensors can interact with web maps.');
} // On load, this alert notifies the user that the page will ask to access their location and gives a reason why. You can easily modify this text.

var map = L.map('map').fitWorld(); //Here we initialize the map in the "map" div defined in the html body. Below, we call in Mapbox tiles and 
//use the options to set the max zoom to 18, include our attribution, specify that the tiles set we want is mapbox.streets, and provide the 
//access token for Mapbox's API

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.light', // experiment with changing this to mapbox.light, mapbox.dark, mapbox.satellite, etc.
  accessToken: 'pk.eyJ1IjoibGNocmlzbWFuIiwiYSI6ImNqbzU1a2RsZzA0ZzYza256ZzZ2OGZzd3UifQ.FlGqMWY7Rzn20B1bbLM_3g' //this is a generic access token, 
  //but when you deploy projects of your own, you must get a unique key that is tied to your Mapbox account
}).addTo(map);

//the below JS code takes advantage of the Geolocate API as it is incorporated in the Leaflet JS API with the locate method
function onLocationFound(e) { //this function does three things if the location is found: it defines a radius variable, adds a popup to the map, 
  //and adds a circle to the map.

  var radius = e.accuracy / 2; //this defines a variable radius as the accuracy value returned by the locate method divided by 2. It is divided 
  //by 2 because the accuracy value is the sum of the estimated accuracy of the latitude plus the estimated accuracy of the longitude. The unit 
  //is meters.

  var time = new Date().getHours(); 
  if (time < 17) {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoibGNocmlzbWFuIiwiYSI6ImNqbzU1a2RsZzA0ZzYza256ZzZ2OGZzd3UifQ.FlGqMWY7Rzn20B1bbLM_3g'
  }).addTo(map);
    }
  else {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.dark',
    accessToken: 'pk.eyJ1IjoibGNocmlzbWFuIiwiYSI6ImNqbzU1a2RsZzA0ZzYza256ZzZ2OGZzd3UifQ.FlGqMWY7Rzn20B1bbLM_3g'
  }).addTo(map);
    }

  L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters of this point." + "<br>" + "Latitude: " + e.latitude + "<br>" + "Longitude: " + e.longitude).openPopup();
  //this adds a Leaflet popup to the map at the lat and long returned by the locate function. The text of the popup is defined here as well. 
  //Please change this text to specify what unit the radius is reported in.

  L.circle(e.latlng, radius).addTo(map); // this adds a Leaflet circle to the map at the lat and long returned by the locate function. 
  //Its radius is set to the var radius defined above.

  if (radius < 30) {
      L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
  }
  else{
      L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
  } 
  //this adds a Leaflet circle to the map at the lat and long returned by the locate function. Its radius is set to the var radius defined above. 
  //If the radius is less than 30, the color of the circle is blue. If it is more than 30, the color is red. Comment out the line of code that adds 
  //the simple circle and uncomment the seven lines of code that enable the responsively colored circle. NOTE: there are two syntax errors in the 
  //code that you must correct in order for it to function.
}

function onLocationError(e) {
  alert(e.message);
}
//this function runs if the location is not found when the locate method is called. It produces an alert window that reports the error

//Toggle day/night start
  var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGNocmlzbWFuIiwiYSI6ImNqbzU1a2RsZzA0ZzYza256ZzZ2OGZzd3UifQ.FlGqMWY7Rzn20B1bbLM_3g';

  var daymap   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
      nightmap  = L.tileLayer(mbUrl, {id: 'mapbox.dark',   attribution: mbAttr});

  var baseLayers = {
    "Day map": daymap,
    "Night map": nightmap
  };

  L.control.layers(baseLayers).addTo(map);
//Toggle day/night end

//Geolocate Button 
resetExtent = function () {
    map.locate({setView: true, enableHighAccuracy: true, maxZoon: 16});
};

var Geolocation =  L.Control.extend({

  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';  
    container.style.backgroundImage = "url(./images/markerimage.png)";
    container.style.backgroundSize = "30px 30px";
    container.style.width = '30px';
    container.style.height = '30px';


    container.onclick = function(){
      resetExtent();
    };

    return container;
  }
});

map.addControl(new Geolocation());
//Geolocation Button end

//Info button
var Info =  L.Control.extend({

  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';  
    container.style.backgroundImage = "url(./images/infomarker.jpg)";
    container.style.backgroundSize = "30px 30px";
    container.style.width = '30px';
    container.style.height = '30px';


    container.onclick = function(){
      window.confirm("This page uses sensors to find the user's geolocation in order to pinpoint that location on the map within a certain accuracy threshold, as well as accessing the user's current time zone in order to set the basemap accordingly for day or night time.");
    };

    return container;
  }
});

map.addControl(new Info());
//Info button end

//these are event listeners that call the functions above depending on whether or not the locate method is successful
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//This specifies that the locate method should run
map.locate({
  setView: true, //this option centers the map on location and zooms
  maxZoom: 16, // this option prevents the map from zooming further than 16, maintaining some spatial context even if the accuracy of the 
  //location reading allows for closer zoom
  timeout: 15000, // this option specifies when the browser will stop attempting to get a fix on the device's location. Units are miliseconds. 
  //Change this to 5000 and test the change. Before you submit, change this to 15000.
  watch: false, // you can set this option from false to true to track a user's movement over time instead of just once. For our purposes, 
  //however, leave this option as is.
});
