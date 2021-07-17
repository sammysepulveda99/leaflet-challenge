// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log("hola")
// Perform a GET request to the query URL
d3.json(queryUrl, function(data){
  // Once we get a response, send the data.features object to the createFeatures function
  createEarthquakes(data.features);

});

function createEarthquakes(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  var earthquakeMarkers = [];
    for (var i = 0; i < earthquakeData.length; i++) {

    var magnitude = earthquakeData[i].properties.mag
    var lat = earthquakeData[i].geometry.coordinates[1]
    var lng = earthquakeData[i].geometry.coordinates[0]
    var latlng = [lat,lng]
    var depth = earthquakeData[i].geometry.coordinates[2]

  var color = "";
      if (depth < 10){color = "Green"}
      else if (depth < 30) {color = "Yellow"}
      else if (depth < 50) {color = "Orange"}
      else if (depth < 70) {color = "DarkSalmon"}
      else if (depth < 90) {color = "Red"}
      else {color = "DarkRed"}

   earthquakeMarkers.push(
     L.circle(latlng, {
        stroke: false,
        fillOpacity: .8,
        color: "white",
        fillColor: color,
        radius: magnitude*30000
     }).bindPopup("<h3>" + earthquakeData[i].properties.title +
      "</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>")
)
}

  var earthquakes = L.layerGroup(earthquakeMarkers)

// Earthquakes layer to begin create Map function
  createMap(earthquakes);

}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  function legendColor(depth){
    if (depth < 10){return "Green"}
    else if (depth < 30) {return "Yellow"}
    else if (depth < 50) {return "Orange"}
    else if (depth < 70) {return "DarkSalmon"}
    else if (depth < 90) {return "Red"}
    else {return "DarkRed"}
}  

//adding a legend to the map
  var legend = L.control({
      position: "bottomleft",
      fillColor: "White"
});

// Creating legend and adding to MyMap
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      var depth = [9, 29, 49, 69, 89, 500];
      var labels = ["<10", "10-30", "30-50", "50-70", "70-90", "90+"];
      div.innerHTML = '<div>Depth (km)</div>';
      for (var i = 0; i < depth.length; i++){
        div.innerHTML += '<i style="background:' + legendColor(depth[i]) + '">&nbsp;&nbsp;&nbsp;&nbsp;</i>&nbsp;'+
                      labels[i] + '<br>';
    }
    return div;
};
  
legend.addTo(myMap);
}


