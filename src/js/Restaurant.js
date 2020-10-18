class Restaurant {
	/**
	 *
	 * @param name {string}
	 * @param address {string}
	 * @param position {{lat:number,lng:number}}
	 * @param ratings {[]}
	 */
	constructor(name, address, position, ratings = []) {
		this.name = name;
		this.address = address;
		this.position = position;
		this.ratings = [];
	}
}