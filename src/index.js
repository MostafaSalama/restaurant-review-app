let app = new App();
window.onload = function () {
    const saveNewRestaurantButton = document.getElementById('save_restaurant_button');
    const minStarsElement = document.getElementById('rating_sort_1');
    const maxStartsElement = document.getElementById('rating_sort_2');

    getUserPosition().then(currentPosition => {
        const [map, userLocation] = initMap(currentPosition)
        console.log(map);
        app.setMap(map, userLocation);
    }).catch(err => {
        console.log(err);
        // display error message when user deny access to his location
        const locationErrorElement = document.querySelector('.location-error');
        console.log(locationErrorElement);
        locationErrorElement.style.display = 'block';
    })

    /**
     * event listeners
     */
    saveNewRestaurantButton.addEventListener('click', () => {
        const restaurantName = document.getElementById('restaurant_name');
        const restaurantAddress = document.getElementById('restaurant_address');
        if (!restaurantName.value || !restaurantAddress.value) {
            alert('all inputs are required please fill them')
            return;
        }
        app.createNewRestaurant(restaurantName.value, restaurantAddress.value);

        // clear the form
        restaurantName.value = '';
        restaurantAddress.value = '';
        // close the model
        document.querySelector('.modal-overlay').style.display = 'none';

    })
    minStarsElement.addEventListener('change',starChange)
    maxStartsElement.addEventListener('change',starChange)
    function starChange() {
        const minValue = parseInt(minStarsElement.value);
        const maxValue = parseInt(maxStartsElement.value);

        if ((minValue >= 1 && minValue <= 5)
            && (maxValue >= 1 && maxValue <= 5)
            && minValue <= maxValue) {
            app.minStars = minValue;
            app.maxStars = maxValue;
            app.filterRestaurants()
        }
    }
}

/**
 * get the user location with geolocation API
 * using promises
 * @returns {Promise<Position>}
 */
function getUserPosition() {
    return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

/**
 * create and return a new google map
 * @param position {Position}
 */
function initMap(position) {
    const userLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: userLocation
    });
    const marker = new google.maps.Marker({
        position: userLocation,
        map,
        icon: {
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
    setTimeout(() => {
        marker.setAnimation(null);
    }, 500)
    return [map, userLocation];
}

