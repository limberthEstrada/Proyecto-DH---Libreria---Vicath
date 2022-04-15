let logoHamburguesa = document.querySelector(".burger-menu")
let menuDesplegable = document.querySelector(".menuDeOpciones")
logoHamburguesa.addEventListener("click", function()
{
    menuDesplegable.classList.toggle("active")
})