//Code inspired by Matt Seto https://setom.github.io/index.html
//My data geojson placeholder
var myData;
var map = L.map('map').setView([37.560806, -100.763308], 4.25);

var OpenStreetMap_BlackAndWhite = L.tileLayer('https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

//add the basemap to the map
            map.addLayer(OpenStreetMap_BlackAndWhite);

//Get fill colours. Returns a fill colour based on what the value of the param is
function getColor(d) {
    return d > 200 ? '#BD0026' :
            d > 100 ? '#F03B20' :
            d > 20 ? '#FD8D3C' :
            d > 10 ? '#FEB24C' :
            d > 0 ? '#FED976' :
            d < -5 ? '#FFFFB2' :
            //default
            '#EEEEEE';
}

//gets the style for each polygon (since the fill is different)

function style(feature) {
    return {
        fillColor: getColor(feature.properties.CAFOs),
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
    if (props.hasOwnProperty('CAFOs')) {
        return props.CAFOs + " CAFOs";
    } else {
        return "No Data";
    }
};

info.update = function (props) {
    this._div.innerHTML = '<h5>CAFOs Population</h5>' + (props ?
            '<b>' + props.NAME + '</b><br />' + getChange(props)
            : 'Hover over a County');
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
            grades = [-5, 10, 20, 100, 200],
            labels = ["< 0", "1 - 10", "11 - 20", "21 - 100", "> 101"];


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
myData = L.geoJson(statesoutline, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
myData = L.geoJson(cafos, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

