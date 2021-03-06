function processSVData(data, status) {
    console.log(`status for sv is ${status}`)
    if (status === 'OK') {
        console.log(data);
        document.getElementById('panorama_viewer').style.display = 'block';
        let panorama = new google.maps.StreetViewPanorama(document.getElementById('panorama_viewer'));
        panorama.setPano(data.location.pano);
        panorama.setPov({
            position:data.location.latLng,
            heading: 440,
            pitch: 0
        });
        panorama.setVisible(true);
    }
    else {
        document.getElementById('panorama_viewer').style.display = 'none';
    }
}

class UI {
    static displayRestaurant(restaurants, places, position = 'afterbegin') {
        console.log(restaurants);
        const containerList = document.getElementById('restaurant_list_container');
        UI.clear(containerList)
        restaurants.forEach(restaurant => {
            const li = document.createElement('li');
            li.className = 'list-group-item item';
            li.addEventListener('click', () => {
                App.currentRestaurant = restaurant;
                document.getElementById('restaurant_reviews').style.display = 'block';
                document.getElementById('rest_info_name').scrollIntoView({behavior: "smooth"})
                UI.displayRestaurantInfo(restaurant)
                if (restaurant.address) {
                    UI.displayUserRestaurantReviews(restaurant.userRatings);
                }
                if (restaurant.vicinity) {
                    let sv = new window.google.maps.StreetViewService();
                    sv.getPanorama({
                        location: restaurant.geometry.location,
                        radius: 50
                    }, processSVData);
                    if (restaurant.reviews) {
                        UI.displayGoogleRestaurantReviews(restaurant.reviews);
                        return;
                    }
                    places.getDetails({
                        placeId: restaurant.place_id
                    }, (place, status) => {

                        if (status !== google.maps.places.PlacesServiceStatus.OK) {
                            return;
                        }

                        restaurant.reviews = place.reviews;
                        UI.displayGoogleRestaurantReviews(place.reviews);
                    })

                }
            })
            li.innerHTML = UI.createRestaurantHTMLContent(restaurant);
            containerList.insertAdjacentElement(position, li);
        })

    }

    static clear(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    static createRestaurantHTMLContent(restaurant) {
        const {photos} = restaurant;
        let starContent = UI.getRatingContent(Math.round(restaurant.rating));

        const imageSrc = photos ? photos[0].getUrl() + '.png' : 'images/food.svg'
        console.log(imageSrc);
        let str = `
        <div class="restaurant-container">
         <div class="image-container">
            <img src="${imageSrc}" alt="${restaurant.name}">
         </div>
        <div class="restaurant-body">
        <p>${restaurant.name}</p>
        <p>${starContent}</p>
        </div>
     </div>
        `
        return str;
    }

    static getRatingContent(rating) {
        let starContent = '';
        for (let i = 0; i < rating; i++) {
            starContent += '<span class="fa fa-star checked"></span>'
        }
        for (let i = 0; i < 5 - rating; i++) {
            starContent += '<span class="fa fa-star"></span>'
        }
        return starContent;
    }

    static displayRestaurantInfo(restaurant) {
        const nameElement = document.getElementById('rest_info_name');
        const addressElement = document.getElementById('rest_info_address');
        nameElement.innerText = restaurant.name;
        addressElement.innerText = restaurant.address || restaurant.vicinity;

    }

    static displayGoogleRestaurantReviews(reviews) {
        const reviewsElement = document.getElementById('reviews');
        reviewsElement.innerHTML = '';
        for (let review of reviews) {
            const {author_name, text, rating} = review;
            UI.displayReview(author_name, text, rating);
        }
    }

    static displayReview(authorName, text, rating) {
        const reviewsElement = document.getElementById('reviews');
        const li = document.createElement('li');
        li.className = 'list-group-item mt-5';
        const nameElement = document.createElement('p');
        nameElement.className = 'text-white bg-primary p-4 font-weight-bold';
        nameElement.innerText = authorName;
        const textElement = document.createElement('p');
        textElement.innerText = text;
        const ratingElement = document.createElement('p');
        ratingElement.innerHTML = UI.getRatingContent(rating);
        li.appendChild(nameElement);
        li.appendChild(textElement);
        li.appendChild(ratingElement);
        reviewsElement.appendChild(li);
    }

    static displayUserRestaurantReviews(userRatings) {
        const reviewsElement = document.getElementById('reviews');
        reviewsElement.innerHTML = '';
        for (let userRating of userRatings) {
            UI.displayReview(userRating.username, userRating.comment, userRating.stars);
        }
    }
}