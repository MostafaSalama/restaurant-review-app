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
		/**
		 * @type {number}
		 */
		this.rating = this.calRating() ;
		this.id = window.generateRandomId()
	}
	calRating(){
		let sum = 0 ;
		for(let rating of this.userRatings) {
			sum+=rating.stars;
		}
		this.rating = sum / this.userRatings.length || 0 ;
	}
}
