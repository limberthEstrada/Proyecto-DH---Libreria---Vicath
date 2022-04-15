//Capturando elementos o input's de la página 💙
let nombreDelProducto = document.querySelector('#name')
let descripcion = document.querySelector('#description')
let descripcionDetallada = document.querySelector('#extended_description')
let precio = document.querySelector('#price')
let descuento = document.querySelector('#discount')
let stock = document.querySelector('#stock')
let stockMinimo = document.querySelector('#stock_min')
let stockMaximo = document.querySelector('#stock_max')
let categoria = document.querySelector('#category')
let color = document.querySelector('#color')
let marca = document.querySelector('#brand')
let image = document.querySelector('#image')
let formulario = document.querySelector('#formularioProd')

//Capturando los elementos que son para los errores 😍
let nombreError = document.querySelector('#nameError')
let descripcionError = document.querySelector('#descriptionError')
let descripcionDetalladaError = document.querySelector('#descriptionExtendedError')
let precioError = document.querySelector('#priceError')
let descuentoError = document.querySelector('#discountError')
let stockError = document.querySelector('#stockError')
let stockMinimoError = document.querySelector('#stockMinError')
let stockMaximoError = document.querySelector('#stockMaxError')
let categoriaError = document.querySelector('#categoryError')
let colorError = document.querySelector('#colorError')
let marcaError = document.querySelector('#brandError')
let erroresGeneralFormulario = document.querySelector('#erroresGeneral')
let imagenError = document.querySelector('#imageError')
let formularioError = document.querySelector("#formError")
//Objeto literal contenedor de todos los errores 👎
let errors = {}


//Estilo de errores por defecto 😀
let bordeColor = '-4px 4px 2px #ed9d9d'
let transicion = "0.5s ease all"
let colorLetraError = "black"

//Acá activamos los escuchadores ✅
nombreDelProducto.addEventListener("blur", nombreValidador)
image.addEventListener("change", imagenValidator)
descripcion.addEventListener("blur", descripcionValidador)
descripcionDetallada.addEventListener("blur", descripcionDetalladaValidator)
precio.addEventListener("blur", precioValidator)
descuento.addEventListener("blur", descuentoValidator)
stock.addEventListener("blur", stockGlobalValidator)
stockMinimo.addEventListener("blur", stockMinGlobalValidator)
stockMaximo.addEventListener("blur", stockMaxGlobalValidator)
categoria.addEventListener("blur", categoriaGlobalValidator)
color.addEventListener("blur", colorGlobalValidator)
marca.addEventListener("blur", marcaGlobalValidator)

//Acá va el escuchador del formulario en general
formulario.addEventListener("submit", function(evento)
{
    let listaErrores = document.querySelector('#erroresListaGeneral')
    if(Object.keys(errors).length >=1)
    {
        evento.preventDefault()
        

        //erroresGeneralFormulario.classList.remove("errores-general-off")
        
        //Ahora empieza la magia
        /*listaErrores.innerHTML = ""
        listaErrores.innerHTML += (errors.name) ? "<li>" + errors.name + "</li>" : ""
        listaErrores.innerHTML += (errors.images) ? "<li>" + errors.images + "</li>" : ""
        listaErrores.innerHTML += (errors.description) ? "<li>" + errors.description + "</li>" : ""
        listaErrores.innerHTML += (errors.descriptionExtended) ? "<li>" + errors.descriptionExtended + "</li>" : ""
        listaErrores.innerHTML += (errors.price) ?  "<li>" + errors.price + "</li>" : ""
        listaErrores.innerHTML += (errors.discount) ? "<li>" + errors.discount + "</li>" : ""
        listaErrores.innerHTML += (errors.stock) ? "<li>" + errors.stock + "</li>" : ""
        listaErrores.innerHTML += (errors.select) ? "<li>" + errors.select + "</li>" : ""
        */
        formularioError.innerHTML = "Fijate los errores que te marcan los campos"
        formularioError.classList.add('cambiando');
    }
    else{
        if(nombreDelProducto.value.length==0 || descripcion.value.length==0 || descripcionDetallada.value.length==0 || precio.value.length==0 || descuento.value.length==0 || stock.value.length==0 || stockMinimo.value.length==0 || stockMaximo.value.length==0 || categoria.value.length==0 || color.value.length==0 || marca.value.length==0)
        {
            evento.preventDefault()
            console.log("Entre vieja")
            
            formularioError.innerHTML = "Ningún campo debe quedar vacio, salvo las imágenes"
            formularioError.classList.add('cambiando');
        }
        else{
            formularioError.innerHTML = ""
            formularioError.classList.remove('cambiando');
            //erroresGeneralFormulario.classList.add("errores-general-off")
            formulario.submit()
        }
    }
})

//Para quitar el error general
/*let body = document.querySelector("body")
body.addEventListener("click", function()
{
    erroresGeneralFormulario.classList.remove("errores-general")
    erroresGeneralFormulario.classList.add("errores-general-off")
})*/

//Funciones - validadores 😜
function validatorGeneric(input, divError)
{
        input.style.boxShadow = bordeColor
        input.style.transition += transicion
        input.style.color += colorLetraError
        divError.classList.add('cambiando');
}

function removiendoCambiosGeneric(input, divError)
{
        divError.innerHTML = ""
        input.style.boxShadow = ""
        input.style.transition = ""
        input.style.color = ""
        divError.classList.remove('cambiando');
}

function nombreValidador()
{
    if(nombreDelProducto.value.length == 0)
    {
        let error = "El nombre del producto no puede quedar vacio"
        errors.name = error
        nombreError.innerHTML = error
        validatorGeneric(nombreDelProducto, nombreError)
    }
    else
    {
        if(nombreDelProducto.value.length < 5)
        {
            let error = "El nombre del producto debe ser mayor a 5 caracteres"
            errors.name = error
            nombreError.innerHTML = error
            validatorGeneric(nombreDelProducto, nombreError)
        }
        else
        {
            console.log("entre papa")
            delete errors.name
            removiendoCambiosGeneric(nombreDelProducto, nombreError)
        }
    }
}

function imagenValidator()
{
    let arrayDeImagenes = image.files
    let cantidadDeImagenesConErrorDeFormato = 0

    if(image.files.length > 4)
    {
        let error = "Amigo, se te aviso que eran 4 imágenes como máximo"
        errors.images = error //agregarlo en el submit
        imagenError.innerHTML = error
        validatorGeneric(image, imagenError)
    }
    else{
        for (let i = 0; i < arrayDeImagenes.length; i++) {
            if(arrayDeImagenes[i].type != 'image/jpeg' && arrayDeImagenes[i].type != 'image/png')
            {
                cantidadDeImagenesConErrorDeFormato++;
            }
        }
        if(cantidadDeImagenesConErrorDeFormato>0)
        {
            let error = "De preferencia se necesitan imágenes con formato PNG y JPG"
            errors.images = error //agregarlo en el submit
            imagenError.innerHTML = error
            validatorGeneric(image, imagenError)
        }
        else{
            delete errors.images
            removiendoCambiosGeneric(image, imagenError)
        }
    }
}

function descripcionValidador()
{
    if(descripcion.value.length == 0)
    {
        let error = "La descripción no puede quedar vacia"
        errors.description = error
        descripcionError.innerHTML = error
        validatorGeneric(descripcion, descripcionError)
    }
    else
        {
            delete errors.description
            removiendoCambiosGeneric(descripcion, descripcionError)
        }
}

function descripcionDetalladaValidator()
{
    if(descripcionDetallada.value.length == 0)
    {
        let error = "La descripción detallada no puede quedar vacia"
        errors.descriptionExtended = error
        descripcionDetalladaError.innerHTML = error
        validatorGeneric(descripcionDetallada, descripcionDetalladaError)
    }
    else{
        if(descripcionDetallada.value.length < 8)
        {
            let error = "La descripción detallada debe tener más de 8 cáracteres"
            errors.descriptionExtended = error
            descripcionDetalladaError.innerHTML = error
            validatorGeneric(descripcionDetallada, descripcionDetalladaError)
        }
        else
        {
            delete errors.descriptionExtended
            removiendoCambiosGeneric(descripcionDetallada, descripcionDetalladaError)
        }
    }
}

function precioValidator()
{
    if(precio.value.length == 0)
    {
        let error = "Debe ingresar algo en el campo de precio"
        errors.price = error
        precioError.innerHTML = error
        validatorGeneric(precio, precioError)
    }
    else
    {
        if(validator.isNumeric(precio.value) && (precio.value < 0)) //isDecimal es mejor
        {
            let error = "El precio no puede ser un negativo"
            errors.price = error
            precioError.innerHTML = error
            validatorGeneric(precio, precioError)
        }
        else
        {
            delete errors.price
            removiendoCambiosGeneric(precio, precioError)
        }
    }
    
}

function descuentoValidator()
{
    if(descuento.value.length == 0)
    {
        let error = "Debe ingresar algo en el campo de descuento"
        errors.discount = error
        descuentoError.innerHTML = error
        validatorGeneric(descuento, descuentoError)
    }
    else
    {
        if(validator.isNumeric(descuento.value) && (descuento.value < 0)) //isDecimal es mejor
        {
            let error = "El descuento no puede ser un negativo"
            errors.discount = error
            descuentoError.innerHTML = error
            validatorGeneric(descuento, descuentoError)
        }
        else{
            if(validator.isNumeric(descuento.value) && (descuento.value > 100))
            {
                let error = "El descuento no puede ser superior a 100"
                errors.discount = error
                descuentoError.innerHTML = error
                validatorGeneric(descuento, descuentoError)
            }
            else
            {
                delete errors.discount
                removiendoCambiosGeneric(descuento, descuentoError)
            }   
        }
    }
    
}

function stockNormalValidator()
{
    if(stock.value.length == 0)
    {
        let error = "Debe ingresar algo en el campo de stock"
        errors.stock = error
        stockError.innerHTML = error
        stock.style.boxShadow = bordeColor
    }
    else
    {
        if(validator.isNumeric(stock.value) && (stock.value < 0)) //isDecimal es mejor
        {
            let error = "El stock ingresado no puede ser un negativo"
            errors.stock = error
            stockError.innerHTML = error
            stock.style.boxShadow = bordeColor
        }
        else
        {
            stockError.innerHTML = ""
            stock.style.boxShadow = ""
        }
    }
    
}

function stockGlobalValidator()
{
    stockValidator(stock, stockError)
}

function stockMinGlobalValidator()
{
    stockValidator(stockMinimo, stockMinimoError)
}

function stockMaxGlobalValidator()
{
    stockValidator(stockMaximo, stockMaximoError)
}

function stockValidator(input, divError)
{
    if(input.value.length == 0)
    {
        let error = "Debe ingresar algo en el campo de stock"
        errors.stock = error
        divError.innerHTML = error
        validatorGeneric(input, divError)
    }
    else
    {
        if(validator.isNumeric(input.value) && (input.value < 0)) //isDecimal es mejor
        {
            let error = "El stock ingresado no puede ser un negativo"
            errors.stock = error
            divError.innerHTML = error
            validatorGeneric(input, divError)
        }
        else
        {
            delete errors.stock
            removiendoCambiosGeneric(input, divError)
        }
    }
    
}

function categoriaGlobalValidator()
{
    
    selectValidator(categoria, categoriaError)  
}

function colorGlobalValidator()
{
    selectValidator(color, colorError)
}

function marcaGlobalValidator()
{
    selectValidator(marca, marcaError)
}

function selectValidator(input, divError) //ojo con el select 
{
    if(input.value == "")
    {
        let error = "Debe seleccionar algo"
        errors.select = error
        divError.innerHTML = error
        validatorGeneric(input, divError)
    }
    else
        {
            delete errors.select
            removiendoCambiosGeneric(input, divError)
        }
}
