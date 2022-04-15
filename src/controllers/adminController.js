const db = require('../../src/database/models');
const { Op } = require("sequelize");
const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const bcript = require('bcryptjs');

const adminController = {
    eliminarUsuario: (req,res) =>{
        
        db.user.findByPk(req.params.id)
        .then(function(user)
        {
            //return res.send(path.resolve(__dirname, '../../public/images/users', user.avatar))
            /*
            fs.unlinkSync(path.resolve(__dirname, '../../public/images/users', user.avatar));
            */

            db.user.destroy({
                where: {
                    id: req.params.id
                },
                force: true
            })
            .then(function(usuario)
            {
                return res.redirect("/admin/users")
            })
            .catch(function(error)
            {
                console.log(error)
            })
        })
        .catch(err => {
            console.log(err)
        })
        
    },

    viewRegisterUser:(req,res)=>{
        db.rol.findAll()
        .then(roles => {
            res.render('./users/createUserAdmin', {roles})
        })
        .catch(err =>
            {
                console.log("-----------------------------")
                console.log(err)
            })
        
    },

    registerUser:(req,res)=>{

        const resultadosValidaciones = validationResult(req);
        let contraseñaEncriptada;        
        if(!resultadosValidaciones.isEmpty())
        {
            db.rol.findAll()
            .then(function(roles)
            {
            return res.render('./users/createUserAdmin', {errors: resultadosValidaciones.mapped(), usuarioDatos: req.body, roles})
            })
        }

        db.user.findOne({
            where: {
                email: {[Op.like]: req.body.email}
            }
        })
        .then(user =>{
            if(user != null){
                db.rol.findAll()
                .then(function(roles)
                {
                return res.render('./users/createUserAdmin',{errors: {
                    email: { msg:"Este mail ya esta registrado" }}, usuarioDatos: req.body, roles})
                })
                }
            else{
                if(req.body.contrasenia == req.body.contrasenia2 ){
                    contraseñaEncriptada = bcript.hashSync(req.body.contrasenia,12) 
                    db.user.create({
                        avatar: req.file? req.file.filename: "default.jpg",
                        first_name: req.body.nombre,
                        last_name: req.body.apellido,
                        phone_number: req.body.telefono,
                        email: req.body.email,
                        password: contraseñaEncriptada,
                        rol_id:req.body.rol ? req.body.rol : 1
                    })
                    .then(res.redirect("/admin/users"))
                    .catch(error => res.send (error))
                }else{
                    db.rol.findAll()
                    .then(function(roles)
                    {
                    return res.render('./users/createUserAdmin',{errors: {
                        contrasenia: {
                            msg:"Las contraseñas no coinciden"
                        }
                    },usuarioDatos: req.body, roles})
                    })
                }
            
                
                }
            })
        },

    editVistaUser: (req,res)=>{

        let roles = db.rol.findAll()
        let user = db.user.findByPk(req.params.id)
        Promise.all([roles, user])
        .then(function([roles, user])
        {
            return res.render('./users/updateUserAdmin', {usuarioDatos: user, roles})
        })
        
    },

    editUserAdmin: (req,res)=>{
        const resultadosValidaciones = validationResult(req);
                
        if(!resultadosValidaciones.isEmpty())
        {
            db.user.findByPk(req.params.id)
            .then(function(user)
            {
            return res.render('./users/editPerfil', {errors: resultadosValidaciones.mapped(), usuarioDatos: user})
            })
        }
        else{
            
            db.user.findByPk(req.params.id)
            .then(function(user)
            {
                db.user.update({
                    first_name: req.body.nombre,
                    last_name: req.body.apellido,
                    avatar: (req.file)?req.file.filename:user.avatar,
                    phone_number: req.body.telefono,
                    email: req.body.email,
                    rol_id: req.body.rol
                }, {
                    where: {id: req.params.id}
                })
                .then(function(respuestaUpdate)
            {
                return res.redirect("/admin/users")
            })
                .catch(error => res.send (error))
                 })
            .catch(err => {
                console.log(err)
            })
            
            
            
        }
    },
    
    listarUsuarios: (req,res) =>{
        db.user.findAll(
            {
                include: [{association: "rol"}]
            }
        )
        .then(function(usuarios)
        {
            
            return res.render("./users/listUsers", {usuarios})
        })
        .catch(function()
        {
            console.log("no sirve pa")
        })

    }
}

module.exports = adminController;