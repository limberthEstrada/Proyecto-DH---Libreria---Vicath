const { body } = require("express-validator")
const path = require("path")

const errors = [
    body("name").notEmpty().withMessage("El nombre no puede estar vacio").bail().isLength({min:5}).withMessage("El nombre del producto debe ser mayor a 5 caracteres"),
    body("image").custom((value, {req}) => {
        if(req.files.length>4)
        {
            throw new Error("Amigo, te dije que eran 4 imágenes D:")
        }
        else {let extensionesValidas = [".png", ".jpg"]
        let fileExtension = ""
        let contadorDeErrores = 0
        for (let i = 0; i < req.files.length; i++) {
            fileExtension = path.extname(req.files[i].originalname)
            if(!extensionesValidas.includes(fileExtension))
            {
                contadorDeErrores++
            }
        }
        if(contadorDeErrores>0)
        {
            throw new Error("Los formatos de imagen validos son .png y jpg")
        }
        else
        {
            return true
        }}
    }),
    body("description").notEmpty().withMessage("La descripcion no puede estar vacia"),
    body("extended_description").notEmpty().withMessage("La descripción extendida no puede estar vacia").bail().isLength({min:8}).withMessage("La descripción extendida debe ser mayor a los 8 caracteres"),
    body("price").notEmpty().withMessage("El precio no puede estar vacio").bail().custom(value => {
        if(isNaN(value))
        {
            throw new Error("Debe ser un precio válido")
        }
        else{
            if(value < 0)
            {
                throw new Error("El precio no puede ser negativo")
            }
            else{
                return true
            }
        }
    }),
    body("discount").notEmpty().withMessage("El descuento no puede estar vacio").bail().custom(value => {
        if(isNaN(value))
        {
            throw new Error("Debe ser un descuento válido")
        }
        else{
            if(value < 0)
            {
                throw new Error("El descuento no puede ser negativo")
            }
            else{
                if(value > 100)
                {
                    throw new Error("El descuento no puede superar el 100%")
                }
                else{
                    return true
                }
            }
        }
    }),
    body("stock").notEmpty().withMessage("El stock no puede quedar vacio").bail().custom(value => {
        if(isNaN(value))
        {
            throw new Error("Debe ser un stock válido")
        }
        else{
            if(value < 0)
            {
                throw new Error("El stock no puede ser negativo")
            }
            else{
                return true
            }
        }
    }),
    body("stock_min").notEmpty().withMessage("El stock minimo no puede quedar vacio").bail().custom(value => {
        if(isNaN(value))
        {
            throw new Error("Debe ser un stock minimo válido")
        }
        else{
            if(value < 0)
            {
                throw new Error("El stock minimo no puede ser negativo")
            }
            else{
                return true
            }
        }
    }),
    body("stock_max").notEmpty().withMessage("El stock máximo no puede quedar vacio").bail().custom(value => {
        if(isNaN(value))
        {
            throw new Error("Debe ser un stock máximo válido")
        }
        else{
            if(value < 0)
            {
                throw new Error("El stock máximo no puede ser negativo")
            }
            else{
                return true
            }
        }
    }),
    body("category").notEmpty().withMessage("Debe seleccionar una categoria"),
    body("color").notEmpty().withMessage("Debe seleccionar un color"),
    body("brand").notEmpty().withMessage("Debe seleccionar una marca")
]

module.exports = errors;