class App {
	constructor() {
		/** @type {[Restaurant]} */
		this.mapRestaurants = [];
		this.markers = [] ;
		this.userMarkers = [] ;
		this.userRestaurants = [] ;
		this.currrentLocation = '';
		this.newRestaurantName = '';
		this.newRestaurantAddress = '';
		this.newRestaurantPosition = {};
		this.filteredRestaurants = [] ;
		this.minStars = 1 ;
		this.maxStars= 5
	}
	setMap(map,position) {
		this.map = map;
		this.currrentLocation = position ;
		this.places =  new google.maps.places.PlacesService(map);
		let request = {
			location: this.currrentLocation,
			radius: 500,
			types: ['restaurant']
		}
		this.places.nearbySearch(request,(result,status)=>{
			if(status === 'OK') {
					this.findPlaces();
			}
		})
		this.addMapEvents();
	}

	addMapEvents() {
		this.map.addListener('rightclick', (e) => {
			this.newRestaurantPosition = e.latLng;
			this.showModal();
		});
		this.map.addListener('dragend',()=>{
			this.findPlaces()
		})
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
		this.userRestaurants.push(restaurant);
		const marker = new google.maps.Marker({
			map: this.map,
			position: restPosition,
			id:restaurant.id,
			placesId:restaurant.id
		});
		this.userMarkers.push(marker) ;
	}
	findPlaces(){
		this.clearRestaurants();
		this.clearMarkers();
		const bounds = {
			bounds: this.map.getBounds(),
			types: ['restaurant']
		}
			this.places.nearbySearch(bounds, (results,status)=> {
				console.log(status)
				if(status === "OK"){
					results.forEach(restaurant=>{
						console.log(restaurant);
						this.mapRestaurants.push(restaurant) ;
						this.makeRestaurantMarker(restaurant)
					})
					this.filterRestaurants();
				}

			})
		}

	makeRestaurantMarker(restaurant) {
		const marker = new google.maps.Marker({
			map:this.map,
			placeId:restaurant.id,
			id:restaurant.id,
			position:restaurant.geometry.location,
			zIndex:5
		})
		this.markers.push(marker);
	}
	clearRestaurants(){
		this.mapRestaurants = [] ;
	}
	clearMarkers(){
		this.markers.forEach(mark=>mark.setMap(null));
		this.markers = [] ;
	}
	filterRestaurants(){
		this.filteredRestaurants = this.mapRestaurants.filter(rest=>rest.rating >= this.minStars && rest.rating <=this.maxStars);
		UI.displayRestaurant(this.filteredRestaurants) ;
	}
}
