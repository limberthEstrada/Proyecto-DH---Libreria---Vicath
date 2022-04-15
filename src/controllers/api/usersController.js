const db = require('../../database/models');
const { Op } = require("sequelize");
const moment = require("moment")
const {validationResult} = require('express-validator');
const bcript = require('bcryptjs');

const userController = {
    users: (req, res) => {

        let pagina = Number(req.query.page)

        db.user.findAndCountAll({
            attributes: ['id', 'first_name', 'email'],
            distinct: true,
            limit: 5,
            offset: (pagina ? (pagina-1)*5 : 0)
        })
        .then(function(userResponse)
        {
            let arrayUser = []
            userResponse.rows.forEach(element => {
                let userObject = {...element.dataValues, detail:'/api/users/'+element.dataValues.id}
                arrayUser.push(userObject)
            });
            let estructura = {
                count: userResponse.count,
                users: arrayUser,
                previous: pagina > 1 ? '/api/users/?page='+(pagina-1) : null,
                next: pagina < (userResponse.count/5) ? '/api/users/?page='+(pagina+1) : null
            }

            return res.json(estructura)
        })
    },

    usersDetail: (req, res) => {
        db.user.findByPk(req.params.id)
        .then(function(user)
        {
            let estructura = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                avatar: '/images/users/'+user.avatar
            }

            return res.json(estructura)
        })
    }
}

module.exports = userController;