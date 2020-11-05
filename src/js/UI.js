
class UI {
    static displayRestaurant(restaurants,position='afterbegin'){
        console.log(restaurants);
        const containerList = document.getElementById('restaurant_list_container');
        UI.clear(containerList)
        restaurants.forEach(restaurant=>{
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = UI.createRestaurantHTMLContent(restaurant) ;
            containerList.insertAdjacentElement(position,li);
        })

    }
    static clear(element){
        while(element.firstChild){
            element.removeChild(element.firstChild)
        }
    }

    static createRestaurantHTMLContent(restaurant) {
        const {photos} = restaurant ;
        let starContent = UI.getRatingContent(Math.round(restaurant.rating));

        // const imageSrc = photos? photos[0].getUrl({ maxWidth: 100}) : 'images/food.svg'
        const imageSrc = 'images/food.svg'
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
        for(let i =0 ; i<rating;i++){
            starContent+='<span class="fa fa-star checked"></span>'
        }
        for(let i = 0 ; i<5-rating;i++) {
            starContent+='<span class="fa fa-star"></span>'
        }
        return starContent ;
    }
}