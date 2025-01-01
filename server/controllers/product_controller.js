const uuid = require('uuid')
const path = require('path')
const {Product, ProductFeatures} = require('../models/models')
const ApiError = require('../errors/ApiError')

class ProductController{
    async createProduct(req, res, next){
        try{
            let {name, price, disc_price, description, quantity, subCategoryId, brandId, productFeatures} = req.body
            
            const {img} = req.files
            let fileName = uuid.v4()+".jpg"
            img.mv(path.resolve(__dirname, '..','static',fileName))
            
            const product = await Product.create({name, price, disc_price, description, quantity, subCategoryId, brandId, img:fileName})

            if(productFeatures){
                productFeatures = JSON.parse(productFeatures)
                productFeatures.forEach(i=>
                    ProductFeatures.create({
                       name: i.name,
                       description: i.description,
                       productId: product.id
                    })
                )
            }    
            return res.json(product)   
        }
        catch(e){
           next(ApiError.badRequest(e.message)) 
        }
    }
    async getAllProducts(req, res){
        let {brandId, subCategoryId, limit, page} = req.query
        page = page || 1
        limit = limit || 12
        let offset = page*limit - limit
        let products

        if(!brandId && !subCategoryId){
            products = await Product.findAndCountAll({limit, offset})
        }
        if(brandId && !subCategoryId){
            products = await Product.findAndCountAll({where:{brandId},limit, offset})
        }
        if(!brandId && subCategoryId){
            products = await Product.findAndCountAll({where:{subCategoryId},limit, offset})
        }
        if(brandId && subCategoryId){
            products = await Product.findAndCountAll({where:{brandId, subCategoryId},limit, offset})
        }
        return res.json(products)
    }
    async getProduct(req, res){
        const {id} = req.params
        const product = await Product.findOne({where:{id}, include:[{model:ProductFeatures}]})
        return res.json(product)
    }
    async deleteProduct(req, res){
        
    }
}

module.exports = new ProductController()