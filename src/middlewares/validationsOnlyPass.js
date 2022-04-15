const {body, param} = require('express-validator');

const path = require('path');

const errors = [
    body('contrasenia').notEmpty().withMessage("La contraseña no puede quedar vacia").isLength({min:8}).withMessage("La contraseña debe tener por lo menos 8 digitos"),
    body('contrasenia2').notEmpty().withMessage("Debe confirmar contraseña").isLength({min:8}).withMessage("La recontraseña debe tener por lo menos 8 digitos")
]

module.exports = errors;