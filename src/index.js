window.onload = function () {
            getUserPosition().then(position=>{
                const map = new google.maps.Map(document.getElementById('map'),{
                    zoom:15,
                    center : {lat:position.coords.latitude,lng:position.coords.longitude}
                });
            }).catch(err=>{
                // display error message when user deny access to his location
                const locationErrorElement  = document.querySelector('.location-error');
                locationErrorElement.style.display = 'block' ;
            })
}
function getUserPosition() {
        return new Promise((resolve, reject) => {
            window.navigator.geolocation.getCurrentPosition(resolve,reject)
        })
}
function initMap(location) {

}
