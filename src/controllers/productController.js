const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const db = require("../database/models");
const { Op } = require("sequelize");
const {validationResult} = require("express-validator")
const moment = require("moment")
const fs = require('fs');
const path = require('path')

let categories = db.category.findAll();

const productController = {

    all:(req,res)=>{
        let productos=db.product.findAll({
            include: [{association: "images"}],
            where:
            {
                deleted: 0
            }
        })

        Promise.all([productos,categories])
        .then(function([productos,categories]){
            res.render("./products/results",{productos, categories})
        })
        .catch(function(error)
        {
            console.log(error)
        })
    },

    search:(req,res)=>{
        let productos;
        let cantidadTotal; //es para el paginado, para poder dividir en páginas

        if(req.query.category == "")
        {
            console.log("-------------------------------------------")
            console.log("entre vieja")
            productos = db.product.findAll({
            where: {
                
                [Op.and]: [
                    {
                        name: {[Op.like]: "%" + req.query.busqueda + "%"}
                    },
                    {
                        deleted: 0
                    }
                ]
            },
            include: [{association: "images"}],
            limit: 6,
            offset: (req.query.pagina ? (req.query.pagina-1)*6 : 0)
        })
    
        cantidadTotal = db.product.findAll({
            where: {
                [Op.and]: [
                    {
                        name: {[Op.like]: "%" + req.query.busqueda + "%"}
                    },
                    {
                        deleted: 0
                    }/*,
                    {

                        //category_id: req.query.category ? Number(req.query.category) : ""
                    }*/
                ]
            },
            include: [{association: "images"}],
        })
    }
        else{
            productos = db.product.findAll({
                where: {
                    
                    [Op.and]: [
                        {
                            name: {[Op.like]: "%" + req.query.busqueda + "%"}
                        },
                        {
                            deleted: 0
                        },
                        {
                            category_id: Number(req.query.category)
                        }
                    ]
                },
                include: [{association: "images"}],
                limit: 6,
                offset: (req.query.pagina ? (req.query.pagina-1)*6 : 0)
            })

            cantidadTotal = db.product.findAll({
                where: {
                    [Op.and]: [
                        {
                            name: {[Op.like]: "%" + req.query.busqueda + "%"}
                        },
                        {
                            deleted: 0
                        },
                        {
    
                            category_id: Number(req.query.category)
                        }
                    ]
                },
                include: [{association: "images"}],
            })
        }
       

        Promise.all([productos, cantidadTotal, categories])
        .then(function([productos, cantidadTotal, categories])
        {
            return res.render("./products/results", {productos, cantidadTotal, categories})
        })
        .catch(error => {
            console.log(error)
        })
    },

    filter:(req,res)=>{
        let productos = db.product.findAll({
            include: [{association: "images"},
            {
                association: "brand", 
                where: {
                        name: {[Op.like]: req.query.marcas}
                        
                    },
                required: (req.query.marcas != "") ? true : false
            }, 
            {
                association: "color",
                where: {
                    
                        name: {[Op.like]: req.query.colores}
                     
                },
                required: (req.query.colores != "") ? true : false
            }
                    ],
            where: {
                [Op.and]: [
                    {
                        price: {[Op.gte]: req.query.precio}
                    },
                    {
                        deleted: 0
                    }
                ]
            }
        })

        Promise.all([productos,categories])

        .then(function([productos,categories])
        {
            //Creo que no se puede redireccionar al home. Si queremos hacer ese efecto
            //dinamica hace falta ver React, no se :V
            return res.render("./products/results", {productos,categories})
        })
        .catch(error => {
            console.log(error)
        })
    },

    news: (req, res)=>{
        let productos = db.product.findAll({
            where: {
                [Op.and]: [
                    {
                        createdAt: {[Op.gte]: moment().subtract(15, 'days').toDate()}
                    },
                    {
                        deleted: 0
                    }
                ]
                //Lo que hace es a la fecha actual le resta 15
                //dias y compara con la fecha que esta en el registro, significa que aún es una novedad
            },
            include: [
                {association: "images"}
            ]
        })

        Promise.all([productos,categories])
        .then(function([productos,categories])
        {
            return res.render("./products/results", {productos,categories})
        })
        .catch(err => {
            console.log(err)
        })
    },

    category:(req,res)=>{
        
        let productos = db.product.findAll({
            include: [{association: "images"},{association: "category"}],
            where:
            {
                [Op.and]: [
                    {
                        category_id: req.params.categoria
                    },
                    {
                        deleted: 0
                    }
                ]
            }
        })

        Promise.all([productos,categories])
        .then(function([productos, categories])
        {
            return res.render("./products/results",{productos, categories})
        })
        .catch(err => {
            console.log(err)
        })
    },

    viewProducts:(req,res) =>{
        db.product.findAll({
            include: [
                {association: "category"}
            ],
            where:{
                deleted:0
            }
        })
        .then( products => 
            res.render("./products/listProducts",{products})
            )
        },
        
    viewProductAdd: (req,res) =>{
        let categoriesOrder =  db.category.findAll(
                {
                    order: [
                        ['name','ASC']
                ]
            }
            );
        let brands = db.brand.findAll(
                {
                    order: [
                    ['name','ASC']
                ]
            }
            );
        let colors = db.color.findAll(
                {
                    order: [
                        ['name','ASC']
                    ]
                }
                );
                
        Promise.all([categoriesOrder,brands,colors])
        .then(function([categories,brands,colors])
        {
            res.render('./products/productAdd', {brands,categories,colors})           
        })
        .catch(err => {
            res.send(error)
        })
    },

    productAdd: (req,res) =>{

        const resultadosValidaciones = validationResult(req)
        let images= []
        let categoriesOrder =  db.category.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        let brands = db.brand.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        let colors = db.color.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        if(!resultadosValidaciones.isEmpty())
        {
            Promise.all([categoriesOrder,brands,colors])
            .then(function([categories,brands,colors]) 
            {
                
                return res.render('./products/productAdd', {errors: resultadosValidaciones.mapped(), oldData: req.body, idUsuario: req.params.id, categories, brands, colors})
            }
            )
        }
        else
        {
            if(req.files != undefined){
                for(let i = 0 ; i<req.files.length;i++){
                    images.push(req.files[i].filename)
                }
            }
            db.product.create({
                name:req.body.name,
                price:req.body.price,
                description: req.body.description,
                stock:req.body.stock,
                stock_min: req.body.stock_min,
                stock_max: req.body.stock_max,
                extended_description: req.body.extended_description,
                price: Number(req.body.price),
                discount:Number(req.body.discount),
                category_id: req.body.category,
                brand_id: req.body.brand,
                color_id: req.body.color,
                deleted: 0,
            })
            .then( product =>{
                
                if ( images.length != 0){
                    for(let i = 0 ; i<images.length;i++){
                        db.image.create({
                            name: images[i],
                            product_id: product.id
                        })
                    }
                }else{
                    
                        db.image.create({
                            name: "defaultProduct.png",
                            product_id: product.id
                        })
                    
                }
    
                res.redirect('/products/viewProducts')
            })
            .catch(error => res.send(error))
            
        }
       
    },

    viewProductEdit:(req,res)=>{
        let product = db.product.findByPk(req.params.id);
        let categoriesOrder =  db.category.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        let brands = db.brand.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        let colors = db.color.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        Promise.all([product,categoriesOrder,brands,colors])
        .then(function([producto,categories,brands,colors])
        {
            res.render('./products/productEdit', {producto,brands,categories,colors})
        })
        .catch(err => {
             res.send(error)
        })
                        
    },
    
    productEdit:(req,res)=>{
        const resultadosValidaciones = validationResult(req)
        let images= []
        let producto = db.product.findByPk(req.params.id);

        let categoriesOrder =  db.category.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        let brands = db.brand.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        let colors = db.color.findAll(
            {
                order: [
                    ['name','ASC']
                ]
            }
        );

        if(!resultadosValidaciones.isEmpty())
        {
            Promise.all([producto, categoriesOrder,brands,colors])
            .then(function([producto, categories,brands,colors]) 
            {
                
                return res.render('./products/productEdit', {errors: resultadosValidaciones.mapped(), oldData: req.body, idUsuario: req.params.id, categories, brands, colors, producto})
            }
            )
        }
        else{
            if(req.files != undefined){
                for(let i = 0 ; i<req.files.length;i++){
                    images.push(req.files[i].filename)
                }
            }
            db.product.update({
                name:req.body.name,
                price:req.body.price,
                description: req.body.description,
                stock:req.body.stock,
                stock_min: req.body.stock_min,
                stock_max: req.body.stock_max,
                extended_description: req.body.extended_description,
                price: Number(req.body.price),
                discount:Number(req.body.discount),
                category_id: req.body.category,
                brand_id: req.body.brand,
                color_id: req.body.color,
                deleted: 0,
            },
            {
                where: {id:req.params.id}
            })
            .then( product =>{
                if ( images.length != 0){
    
                    db.image.destroy(
                        {
                            where: { product_id: req.params.id },
                            force: true
                        })
    
                    for(let i = 0 ; i<images.length;i++){
                        db.image.create(
                        {
                            name: images[i],
                            product_id: req.params.id
                        })
                    }
                }
                res.redirect('/products/viewProducts')
            })
            .catch(error => res.send(error))
            
        }
        
    },

    productDetail:(req, res)=>{
        let detailProd = db.product.findByPk(req.params.id,
         {
             include: [{association: "images"}]
         })

        Promise.all([detailProd,categories])
        .then(function([detailProd, categories])
        {
         return res.render("./products/productDetail", {detailProd, categories})
        })
        .catch(function(error)
        {
            console.log(error)
        })
         
    },

    productDetailAdmin:(req, res)=>{
        db.product.findByPk(req.params.id,
         {
             include: [{association: "images"},{association: "brand"},{association: "category"},{association: "color"}]
         })
        .then(function(producto)
            {
                return res.render("./products/productDetailAdmin", {producto})
            })
        .catch(function(error)
        {
            console.log(error)
        })
         
     },
    
    productDelete:(req,res)=>{
        db.product.findByPk(req.params.id, {
            include: [{association: "images"}]
        })
        .then(function(product)
        {

            /*for (let i = 0; i < product.images.length; i++) {
                
                fs.unlinkSync(path.resolve(__dirname, '../../public/images/', product.images[i].name));
            }*/
            
            db.product.update({
                deleted: 1,
            },
            {
                where: {id:req.params.id}
            })
            .then( () => {
                res.redirect('/products/viewProducts')
            })
        })
        .catch(err => {
            console.log(err)
        })
        
        
    },

    cart: (req,res) =>{
        db.category.findAll()
        .then(function(categories)
        {
            return res.render("./products/cart", {categories});
        })
        .catch(err => {
            console.log(err)
        })
        
    }
    
}

module.exports = productController;