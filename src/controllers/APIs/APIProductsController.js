const db = require('../../database/models');

const apiProductController = {

    getProducts: (req, res) => {

        let products = db.product.findAll({
            include: [{association: "images"},{association: "category"}],
            where:
            {
                deleted: 0
            }
        })

        let categories = db.category.findAll()

        Promise.all([products,categories])
        .then(function([products,categories]){
            let countCategories = {}
            for (let category of categories) {
                countCategories[category.name] = 0
            }

            let productsApi = [];
            for (let product of products) {
                let newProduct = {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    details: "/api/products/"+ product.id
                }
                productsApi.push(newProduct);
                countCategories[product.category.name] += 1
            }
            let result = {
                count: products.length,
                countByCategory: countCategories,
                products: productsApi
            }
            return res.json(result)
        })
    },

    getProductById:(req, res) => {

        db.product.findByPk( req.params.id,{
            include: [{association: "images"},{association: "category"}]
        })
        .then(function(product)
            {
                let newProduct = {
                        id: product.id,
                        name: product.name,
                        stock: product.stock,
                        stock_min: product.stock_min,
                        stock_max: product.stock_max,
                        price: product.price,
                        discount: product.discount,
                        description: product.description,
                        extended_description: product.extended_description,
                        image: "/images/"+product.images[0].name
                        
                }
                
                return res.json(newProduct)
            })
    }
}

module.exports = apiProductController;