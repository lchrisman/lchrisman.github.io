//Code inspired by Matt Seto https://setom.github.io/index.html
//My data geojson placeholder
var myData;
var map = L.map('map').setView([37.560806, -100.763308], 4.25);

var OpenMapSurfer_Grayscale = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
    maxZoom: 17,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

//add the basemap to the map
            map.addLayer(OpenMapSurfer_Grayscale);

//Get fill colours. Returns a fill colour based on what the value of the param is
function getColor(d) {
    return d > 1000000 ? '#a50f15' :
            d > 500000 ? '#de2d26' :
            d > 100000 ? '#fb6a4a' :
            d > 50000 ? '#fc9272' :
            d > 0 ? '#fcbba1' :
            d < -50 ? '#fee5d9' :
            //default
            '#EEEEEE';
}

//gets the style for each polygon (since the fill is different)

function style(feature) {
    return {
        fillColor: getColor(feature.properties.POPULATION),
        weight: 1,
        opacity: 0.75,
        color: '#8B8B8B',
        fillOpacity: 0.75
    };
}

//interaction handlers (credit: http://leafletjs.com/examples/choropleth/)

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

//get the change in visitors, if no data return No Data
getChange = function (props) {
    if (props.hasOwnProperty('POPULATION')) {
        return props.POPULATION + "";
    } else {
        return "No Data";
    }
};

info.update = function (props) {
    this._div.innerHTML = '<h5>County or State</h5>' + (props ?
            '<b>' + props.NAME + '</b><br />' + getChange(props)
            : 'Hover over a County or State');
};

info.addTo(map);

//highlight a polygon when mouseover it
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#8B8B8B',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}
//unhighlight when you remove the mouseover
function resetHighlight(e) {
    myData.resetStyle(e.target);
}
//zoom to a feature when you click the polygon
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

//add a mouse listener to each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

//Legend
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 50000, 100000, 500000, 1000000],
            labels = ["0 - 50,000", "50,001 - 100,000", "100,001 - 500,000", "500,001 - 1,000,000", "> 1,000,000"];


    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 5) + '"></i> ' + labels[i] + '<br>';
    }

    return div;
};

legend.addTo(map);

//Reset extent button
// Thanks to http://www.coffeegnome.net/control-button-leaflet/
//reset the extent on a click
resetExtent = function () {
    map.setView([37.560806, -100.763308], 4.25);
};

//the button
var customControl =  L.Control.extend({

  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';  
    container.style.backgroundImage = "url(./images/zoom.png)";
    container.style.backgroundSize = "40px 40px";
    container.style.width = '40px';
    container.style.height = '40px';

    container.onclick = function(){
      resetExtent();
    };

    return container;
  }
});

map.addControl(new customControl());


//MAKE THE MAP! :)
myData = L.geoJson(states, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
myData = L.geoJson(population, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

