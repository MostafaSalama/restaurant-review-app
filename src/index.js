let app = new App();
window.onload = function () {
    const saveNewRestaurantButton = document.getElementById('save_restaurant_button');
    const minStarsElement = document.getElementById('rating_sort_1');
    const maxStartsElement = document.getElementById('rating_sort_2');
    const addReviewForm = document.getElementById('review_form');
    const displayUserRestaurantsCheckBox = document.getElementById('display_user_restaurants_checkbox');
    const searchRestaurantsInput = document.getElementById('search_restaurants_input')
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
        const username = document.getElementById('user_name_restaurant');
        const userReview = document.getElementById('user_new_restaurant_review');
        const stars = document.querySelector('[name="new_stars"]:checked');
        if (!restaurantName.value || !restaurantAddress.value) {
            alert('all inputs are required please fill them')
            return;
        }
        app.createNewRestaurant(restaurantName.value, restaurantAddress.value,
            {
            username: username.value,
            stars: stars.value,
            comment: userReview.value
        });

        // clear the form
        restaurantName.value = '';
        restaurantAddress.value = '';
        // close the model
        document.querySelector('.modal-overlay').style.display = 'none';

    })
    minStarsElement.addEventListener('change', starChange)
    maxStartsElement.addEventListener('change', starChange)

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

    /**
     * submit form when the user enter his own review
     * we need to append this data to the review of the restaurants
     */
    addReviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('user_new_review_name');
        const comment = document.getElementById('user_new_review_text');
        const stars = addReviewForm.querySelector(':checked');
        // a google restaurant
        if (App.currentRestaurant.vicinity) {
            App.currentRestaurant.reviews = [{
                author_name: username.value,
                text: comment.value,
                rating: parseInt(stars.value)
            }, ...App.currentRestaurant.reviews]
            UI.displayGoogleRestaurantReviews(App.currentRestaurant.reviews);
            username.value = '';
            comment.value = '';
            stars.value = '1';
            document.getElementById('restaurant_info').scrollIntoView({
                behavior: "smooth"
            });
            return;
        }
        App.currentRestaurant.userRatings =
            [{username: username.value, comment: comment.value, stars: parseInt(stars.value)},
                ...App.currentRestaurant.userRatings];
        App.currentRestaurant.calRating();
        UI.displayUserRestaurantReviews(App.currentRestaurant.userRatings);
        username.value = '';
        comment.value = '';
        stars.value = '1';
        document.getElementById('restaurant_info').scrollIntoView({
            behavior: "smooth"
        });
    })
    /**
     * if the user checks the checkbox
     * we need to display only user restaurants, else we display all restaurants
     */
    displayUserRestaurantsCheckBox.addEventListener('change', (e) => {
        app.displayUserRestaurantsOnly = e.target.checked;
        app.filterRestaurants();
    })
    searchRestaurantsInput.addEventListener('input', (e) => {
        app.searchRestaurantsFilterText = e.target.value;
        app.filterRestaurants();
    })
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
        zoom: 15,
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

