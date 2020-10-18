document.addEventListener('DOMContentLoaded',()=>{
   const closeButton = document.getElementById('close_modal_button');
   const closeModalIcon = document.getElementById('close_modal');
   closeButton.addEventListener("click", closeModel)
   closeModalIcon.addEventListener("click", closeModel)
});
function closeModel() {
    document.querySelector('.modal-overlay').style.display = 'none' ;
}
