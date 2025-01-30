// MAPBOX SCRIPT
mapboxgl.accessToken = mapToken;

// Log coordinates to check their validity
console.log("Coordinates:", coordinates);

if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates, // Ensure coordinates is a valid array
    zoom: 9,
  });

  // Create a marker with a red color
  const marker = new mapboxgl.Marker({
    color: 'red'
  })
    .setLngLat(coordinates)
    .addTo(map);
}