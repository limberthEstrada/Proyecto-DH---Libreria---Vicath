const imgPrincipal = document.querySelector(".prodPrincipal")
const imgHijas = document.querySelectorAll(".prodHija img")


imgHijas.forEach(hija => {
    hija.addEventListener("click", function()
    {
        let imgPrincipalCopy = imgPrincipal.getAttribute("src")
        imgPrincipal.setAttribute("src", this.getAttribute("src"))
        this.setAttribute("src", imgPrincipalCopy)
        
    })
})