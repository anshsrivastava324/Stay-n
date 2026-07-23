//js for leaflet
// var map = L.map('map').setView([26.723652, 83.426095], 13.5);

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// var marker = L.marker([26.723652, 83.426095]).addTo(map);


//js for mapbox
// let mapToken1 = "<%= process.env.MAP_TOKEN %>";
const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 13 // starting zoom
});



const marker = new mapboxgl.Marker({ color: '#fe424d'})
    .setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h3>${listing.location}</h3><p><i>Exact location will be provided after booking</i></p>`))
    .addTo(map);