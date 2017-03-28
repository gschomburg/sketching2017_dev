mapboxgl.accessToken = 'pk.eyJ1IjoiZ3NjaG9tYnVyZyIsImEiOiJKaVdWQjdrIn0.bfF-vwtkKeCC2OX05I9b1w';
var map = new mapboxgl.Map({
    container: 'map',
   	center:[-83.044,42.330],
   	zoom: 15.5,
   	scrollZoom: false,
   	dragPan: true, //turn off phone scrolling. maybe
    pitch: 60,
    bearing: -55,
    style: 'mapbox://styles/gschomburg/ciz06k3mh00092rplhlbuw7uy'
});

// the 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#feec6e',
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
            },
            'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
            },
            'fill-extrusion-opacity': .9
        }
    });
});