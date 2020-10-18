window.onload = function () {
            let app = new App();
            getUserPosition().then(position=>{
                const map = initMap(position)
                app.setMap(map) ;
            }).catch(err=>{
                // display error message when user deny access to his location
                const locationErrorElement  = document.querySelector('.location-error');
                locationErrorElement.style.display = 'block' ;
            })
}

/**
 * get the user location with geolocation API
 * using promises
 * @returns {Promise<Position>}
 */
function getUserPosition() {
        return new Promise((resolve, reject) => {
            window.navigator.geolocation.getCurrentPosition(resolve,reject)
        })
}

/**
 * create and return a new google map
 * @param position {Position}
 */
function initMap(position) {
    const userLocation = {lat:position.coords.latitude,lng:position.coords.longitude};
    const map = new google.maps.Map(document.getElementById('map'),{
        zoom:15,
        center :userLocation
    });
    const marker = new google.maps.Marker({
        position:userLocation,
        map,
        icon :{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: 0.5,
            scale: 20,
            strokeColor: 'blue',
            strokeWeight: 1,
            zIndex: 1
        }
    })
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(()=>{
        marker.setAnimation(null) ;
    },500)
    return map ;
}
