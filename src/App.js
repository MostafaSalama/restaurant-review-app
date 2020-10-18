class App {
	constructor() {
		/** @type {[Restaurant]} */
		this.resturants = [];
		this.newRestaurantName = '';
		this.newRestaurantAddress = '';
		this.newRestaurantPosition = {};
	}
	setMap(map) {
		this.map = map;
		this.addMapEvents();
	}

	addMapEvents() {
		this.map.addListener('rightclick', (e) => {
			this.newRestaurantPosition = e.latLng;
			this.showModal();
		});
	}

	showModal() {
		document.querySelector('.modal-overlay').style.display = 'block';
	}

	createNewRestaurant(restaurantName, restaurantAddress) {
		this.newRestaurantName = restaurantName;
		this.newRestaurantAddress = restaurantAddress;
		this.addNewRestaurant();
	}

	addNewRestaurant() {
		const restPosition = {
			lat: this.newRestaurantPosition.lat(),
			lng: this.newRestaurantPosition.lng(),
		};
		const { newRestaurantName, newRestaurantAddress } = this;
		const restaurant = new Restaurant(
			newRestaurantName,
			newRestaurantAddress,
			restPosition,
		);
		this.resturants.push(restaurant);
		const marker = new google.maps.Marker({
			map: this.map,
			position: restPosition,
		});
	}
}
