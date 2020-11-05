class Restaurant {
	/**
	 *
	 * @param name {string}
	 * @param address {string}
	 * @param position {{lat:number,lng:number}}
	 */
	constructor(name, address, position) {
		this.name = name;
		this.address = address;
		this.position = position;
		this.userRatings = [] ;
		this.rating = 0 ;
		this.id = window.generateRandomId()
	}
}
