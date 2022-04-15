//Con esto accedemos al boton por medio de la id que le definimos en el HTML 🎈
const btnSwitch = document.querySelector('#switch'); 

//Con el addEventListener vamos a escuchar el "click" 🎅, hace click y ejecuta la funcion
btnSwitch.addEventListener('click', () => {
    //Lo que hace la funcion es cambiar de "CLASE" a nuestra etiqueta body 😋
	document.body.classList.toggle('dark');
    

    //Con active cambiamos de estado, y asi aplicara un nuevo estado del boton, etc.
	btnSwitch.classList.toggle('active');


    //Guardamos el modo en localStorage
    if(document.body.classList.contains("dark"))
    {
        localStorage.setItem("dark-mode", "true")
    }
    else{
        localStorage.setItem("dark-mode", "false")
    }
});

//Obtenemos el darkmode infinito
if(localStorage.getItem("dark-mode") === "true")
{
    document.body.classList.add('dark');
    btnSwitch.classList.add('active');
}
else
{
    document.body.classList.remove('dark');
    btnSwitch.classList.remove('active');
}