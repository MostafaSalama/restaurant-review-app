class App {
    static currentRestaurant = null;

    constructor() {
        /** @type {[Restaurant]} */
        this.mapRestaurants = [];
        this.markers = [];
        this.userMarkers = [];
        this.userRestaurants = [];
        this.currentRestaurants = [];
        this.currrentLocation = '';
        this.newRestaurantName = '';
        this.newRestaurantAddress = '';
        this.newRestaurantPosition = {};
        this.filteredRestaurants = [];
        this.minStars = 1;
        this.maxStars = 5
        this.displayUserRestaurantsOnly = false;
        this.displayUserRestaurantsOnlyElement = document.getElementById('display_user_restaurants_checkbox');
        this.searchRestaurantsFilterText = '';
    }

    async setMap(map, position) {
        this.map = map;
        this.currrentLocation = position;
        await this.initUserRestaurants();
        this.addMapEvents();

        this.places = new google.maps.places.PlacesService(map);
        let request = {
            location: this.currrentLocation,
            radius: 500,
            types: ['restaurant']
        }
        this.places.nearbySearch(request, (result, status) => {
            if (status === 'OK') {
                this.findPlaces();
            }
        })
    }

    addMapEvents() {
        this.map.addListener('rightclick', (e) => {
            this.newRestaurantPosition = e.latLng;
            console.log(this.newRestaurantPosition)
            this.showModal();
        });
        this.map.addListener('dragend', () => {
            this.findPlaces()
        })
    }

    showModal() {
        document.querySelector('.modal-overlay').style.display = 'block';
    }

    createNewRestaurant(restaurantName, restaurantAddress,review) {
        this.newRestaurantName = restaurantName;
        this.newRestaurantAddress = restaurantAddress;
        this.addNewRestaurant(review);
    }

    addNewRestaurant(review) {
        const restPosition = {
            lat: this.newRestaurantPosition.lat(),
            lng: this.newRestaurantPosition.lng(),
        };
        const {newRestaurantName, newRestaurantAddress} = this;
        const restaurant = new Restaurant(
            newRestaurantName,
            newRestaurantAddress,
            restPosition,
        );
        restaurant.userRatings.push(review);
        restaurant.calRating() ;
        this.userRestaurants.push(restaurant);
        const marker = new google.maps.Marker({
            map: this.map,
            position: restPosition,
            id: restaurant.id,
            placesId: restaurant.id
        });
        this.userMarkers.push(marker);
        this.filterRestaurants();
    }

    findPlaces() {
        this.displayUserRestaurantsOnly = false;
        this.displayUserRestaurantsOnlyElement.checked = false;
        this.clearRestaurants();
        this.clearMarkers();
        const bounds = {
            bounds: this.map.getBounds(),
            types: ['restaurant']
        }
        this.places.nearbySearch(bounds, (results, status) => {
            console.log(status)
            if (status === "OK") {
                results.forEach(restaurant => {
                    console.log(restaurant);
                    this.mapRestaurants.push(restaurant);
                    this.makeRestaurantMarker(restaurant)
                })
                this.filterRestaurants();
            }

        })
    }

    makeRestaurantMarker(restaurant) {
        const marker = new google.maps.Marker({
            map: this.map,
            placeId: restaurant.id,
            id: restaurant.id,
            position: restaurant.geometry.location,
            zIndex: 5
        })
        this.markers.push(marker);
    }

    clearRestaurants() {
        this.mapRestaurants = [];
    }

    clearMarkers() {
        this.markers.forEach(mark => mark.setMap(null));
        this.markers = [];
    }

    filterRestaurants() {
        this.filteredRestaurants = this.mapRestaurants.filter(rest => rest.rating >= this.minStars && rest.rating <= this.maxStars);
        this.filteredUserRestaurants = this.userRestaurants.filter(rest => rest.rating >= this.minStars && rest.rating <= this.maxStars);
        this.currentRestaurants = [...this.filteredUserRestaurants, ...this.filteredRestaurants];
        if (this.displayUserRestaurantsOnly) {
            this.currentRestaurants = [...this.filteredUserRestaurants];
            this.clearMarkers();
        }
        console.log(this.searchRestaurantsFilterText);
        this.currentRestaurants =
            this.currentRestaurants.
            filter(rest => rest.name.toLowerCase().includes(this.searchRestaurantsFilterText.toLowerCase()))
        UI.displayRestaurant(this.currentRestaurants, this.places);
    }

    async initUserRestaurants() {
        const response = await fetch('/data/restaurants.json');
        const rests = await response.json();
        for (let rest of rests) {
            const r = new Restaurant(rest.restaurantName, rest.address, rest.location);
            r.userRatings = rest.ratings;
            r.calRating();
            const marker = new google.maps.Marker({
                map: this.map,
                position: r.position,
                id: r.id,
                placesId: r.id
            });
            console.log(r);
            this.userRestaurants.push(r);
            this.userMarkers.push(marker);
            UI.displayRestaurant([...this.userRestaurants, ...this.mapRestaurants,], this.places)
        }
    }
}
