var Quakesinfo = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(Quakesinfo)
var Infoplates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(Infoplates)

function markerSize(magnitude) {
    return magnitude * 4;
};


var earthquakes = new L.LayerGroup();

d3.json(Quakesinfo, function(geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function(geoJsonFeature) {
            return {
                fillColor: getColor(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function(feature, layer) {
            layer.bindPopup("</h4> <hr style='color: #008080' > <h2 style= 'font-family:Arial;color:#000093;text-align:center;' > " + feature.properties.title + " </h2>" +
                "<h4 style='font-family:Arial;color:#48a4ff;text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr style='background-color:#000093'>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

var platelimit = new L.LayerGroup();

d3.json(Infoplates, function(geoJson) {
    L.geoJSON(geoJson.features, {
        style: function(geoJsonFeature) {
            return {
                weight: 2,
                color: '#99CDC9'
            }
        },
    }).addTo(platelimit);
})


function getColor(magnitude) {
    if (magnitude > 5) {
        return '#FF0000'
    } else if (magnitude > 4) {
        return '#3B1C8C'
    } else if (magnitude > 3) {
        return '#450256 '
    } else if (magnitude > 2) {
        return '#21908D'
    } else if (magnitude > 1) {
        return '#5AC865'
    } else {
        return '#F9E721'
    }
};

function createMap() {

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: API_KEY
    });

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });


    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });


    var baseLayers = {
        "High Contrast": highContrastMap,
        "Street": streetMap,
        "Dark": darkMap,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakes,
        "Plate Boundaries": platelimit,
    };

    var mymap = L.map('map', {
        center: [40, -99],
        zoom: 4.3,

        layers: [streetMap, earthquakes, platelimit]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mags = [0, 1, 2, 3, 4, 5],
            labels = [];
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML +=
                '<span style="color:getColor(mags[i]);background-color:' + getColor(mags[i] + 1) + '"> ■■■ </span> ' +
                mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(mymap);
}