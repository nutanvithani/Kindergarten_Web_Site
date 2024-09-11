/*counter*/
(function () {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;
  //I'm adding this section so I don't have to keep updating this pen every year :-)
  //remove this if you don't need it
  let today = new Date(),
    dd = String(today.getDate()).padStart(2, "0"),
    mm = String(today.getMonth() + 1).padStart(2, "0"),
    yyyy = today.getFullYear(),
    nextYear = yyyy + 1,
    dayMonth = "09/30/",
    birthday = dayMonth + yyyy;
  //end
  const countDown = new Date(birthday).getTime(),
    x = setInterval(function () {
      const now = new Date().getTime(),
        distance = countDown - now;
      document.getElementById("days").innerText = Math.floor(distance / (day)),
        document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
        document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
        document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
    }, 0)
}());

/*map*/
mapboxgl.accessToken = 'pk.eyJ1IjoiYXltYW5zIiwiYSI6ImNrdzViYTVjMTBuaGIzMG8wdW02b2dqZGMifQ.iopJkQ7QLqyBXTcgeALv-Q';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10', // Black and white theme
            projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
            zoom: 1.5,
            center: [-90, 40]
        });

        // The following values can be changed to control rotation speed:

        // At low zooms, complete a revolution every two minutes.
        const secondsPerRevolution = 120;
        // Above zoom level 5, do not rotate.
        const maxSpinZoom = 5;
        // Rotate at intermediate speeds between zoom levels 3 and 5.
        const slowSpinZoom = 3;

        let userInteracting = false;
        let spinEnabled = true;
      map.on('style.load', () => {
  map.setFog({
    color: 'rgb(186, 210, 235)', // Lower atmosphere
    'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
    'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
    'space-color': 'rgb(0, 0, 0)', // Background color
    'star-intensity': 0.2 // Background star brightness (default 0.35 at low zoooms )
  });
});
        function spinGlobe() {
            const zoom = map.getZoom();
            if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
                let distancePerSecond = 360 / secondsPerRevolution;
                if (zoom > slowSpinZoom) {
                    // Slow spinning at higher zooms
                    const zoomDif =
                        (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                    distancePerSecond *= zoomDif;
                }
                const center = map.getCenter();
                center.lng -= distancePerSecond;
                // Smoothly animate the map over one second.
                // When this animation is complete, it calls a 'moveend' event.
                map.easeTo({ center, duration: 1000, easing: (n) => n });
            }
        }

        // Pause spinning on interaction
        map.on('mousedown', () => {
            userInteracting = true;
        });

        // Restart spinning the globe when interaction is complete
        map.on('mouseup', () => {
            userInteracting = false;
            spinGlobe();
        });

        // These events account for cases where the mouse has moved
        // off the map, so 'mouseup' will not be fired.
        map.on('dragend', () => {
            userInteracting = false;
            spinGlobe();
        });
        map.on('pitchend', () => {
            userInteracting = false;
            spinGlobe();
        });
        map.on('rotateend', () => {
            userInteracting = false;
            spinGlobe();
        });

        // When animation is complete, start spinning if there is no ongoing interaction
        map.on('moveend', () => {
            spinGlobe();
        });

        spinGlobe();

        // Add black markers
        const cities = [
            { name: 'Los Angeles', coordinates: [-118.2437, 34.0522] },
            { name: 'San Francisco', coordinates: [-122.4194, 37.7749] },
            { name: 'New York City', coordinates: [-74.0060, 40.7128] },
            { name: 'Dallas', coordinates: [-96.7970, 32.7767] },
            { name: 'Mexico City', coordinates: [-99.1332, 19.4326] },
            { name: 'London', coordinates: [-0.1276, 51.5074] },
            { name: 'Paris', coordinates: [2.3522, 48.8566] }, // Changed from France to Paris for precise coordinates
            { name: 'Dubai', coordinates: [55.2708, 25.2048] },
            { name: 'Tokyo', coordinates: [139.6917, 35.6895] }
        ];

        cities.forEach(city => {
            new mapboxgl.Marker({ color: 'black' })
                .setLngLat(city.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(city.name)) // Add popup with city name
                .addTo(map);
        });