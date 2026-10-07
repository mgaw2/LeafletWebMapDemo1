// Create the weather map, centered on the United States.
var map = L.map('weathermap').setView([38, -95], 4);

// A light gray basemap makes the colored weather layers easier to see.
var basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var basemap = L.tileLayer(basemapUrl, {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors, and the GIS user community'
}).addTo(map);

// Keep the precipitation radar layer from the class demo.
var radarUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi';
var radar = L.tileLayer.wms(radarUrl, {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true,
    attribution: 'Radar: Iowa Environmental Mesonet'
}).addTo(map);

// Download active NWS alerts and color them by severity.
var weatherAlertsUrl = 'https://api.weather.gov/alerts/active?region_type=land';
$.getJSON(weatherAlertsUrl, function(data) {
    L.geoJSON(data, {
        attribution: 'Alerts: National Weather Service',
        style: function(feature) {
            var alertColor = 'orange';
            if (feature.properties.severity === 'Severe') alertColor = 'red';
            if (feature.properties.severity === 'Extreme') alertColor = 'purple';
            if (feature.properties.severity === 'Minor') alertColor = 'green';
            return { color: alertColor, weight: 2, fillOpacity: 0.15 };
        },
        onEachFeature: function(feature, layer) {
            var popup = document.createElement('div');
            popup.textContent = feature.properties.headline;
            layer.bindPopup(popup);
        }
    }).addTo(map);
    document.getElementById('status').textContent =
        'Alert colors: Extreme = purple; Severe = red; Minor = green; Other = orange.';
}).fail(function() {
    document.getElementById('status').textContent =
        'Weather alerts could not load. Check your internet connection and refresh.';
});
