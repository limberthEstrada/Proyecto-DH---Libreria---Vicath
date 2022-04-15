const {body, param} = require('express-validator');

const path = require('path');

const errors = [
    body('email').notEmpty().withMessage("No debe estar vacio").bail().isEmail().withMessage("Debe ser un e-mail válido")
]

module.exports = errors;