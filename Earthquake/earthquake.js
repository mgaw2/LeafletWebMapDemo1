// Create a separate world map for the earthquake data.
var map = L.map('earthquakemap').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Use the same colors in the markers and the legend.
function getColor(magnitude) {
    if (magnitude === null) return 'gray';
    if (magnitude < 2) return 'green';
    if (magnitude < 4) return 'gold';
    if (magnitude < 6) return 'orange';
    return 'red';
}

// Download the USGS past-day GeoJSON feed.
var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
$.getJSON(earthquakeUrl, function(data) {
    L.geoJSON(data, {
        attribution: 'Earthquakes: USGS',
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 7,
                fillColor: getColor(feature.properties.mag),
                color: '#333',
                weight: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            var properties = feature.properties;
            var magnitude = properties.mag;
            if (magnitude === null) magnitude = 'Not reported';
            var time = new Date(properties.time).toUTCString();
            var popup = document.createElement('div');
            popup.textContent = 'Magnitude: ' + magnitude +
                '\nLocation: ' + properties.place + '\nTime (UTC): ' + time;
            layer.bindPopup(popup);
        }
    }).addTo(map);
    document.getElementById('status').textContent =
        data.features.length + ' events loaded from USGS. Times are shown in UTC.';
}).fail(function() {
    document.getElementById('status').textContent =
        'Earthquake data could not load. Check your internet connection and refresh.';
});

// Add a magnitude legend to the bottom right of the map.
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'legend');
    var magnitudes = [0, 2, 4, 6, null];
    var labels = ['Below 2', '2 to less than 4', '4 to less than 6', '6 and above', 'Not reported'];
    div.innerHTML = '<strong>Earthquake magnitude</strong><br>';
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML += '<i style="background:' + getColor(magnitudes[i]) +
            '"></i>' + labels[i] + '<br>';
    }
    return div;
};
legend.addTo(map);
