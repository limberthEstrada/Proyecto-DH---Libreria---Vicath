const db = require('../../database/models');

const apiUserController = {

    getUsers: (req, res) => {
        db.user.findAll()
        .then(function(users)
            {
                let usersApi = [];
                for (let user of users) {
                    let newUser = {
                        id: user.id,
                        name: user.first_name,
                        email: user.email,
                        details: "/api/users/"+ user.id
                    }
                    usersApi.push(newUser);
                }
                let result = {
                    count: users.length,
                    users: usersApi
                }
                return res.json(result)
            })
    },
    getUserById:(req, res) => {
        db.user.findByPk(req.params.id)
        .then(function(user)
            {
                let newUser = {
                        id: user.id,
                        name: user.first_name,
                        lastname: user.last_name,
                        avatar: "/images/users/"+user.avatar,
                        email: user.email,
                        phoneNumber: user.phone_number
                }
                
                return res.json(newUser)
            })
    }
}

module.exports = apiUserController;