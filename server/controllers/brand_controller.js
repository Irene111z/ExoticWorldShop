const {Brand} = require('../models/models')
const ApiError = require('../errors/ApiError')

class BrandController{
    async createBrand(req, res){
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }
    async deleteBrand(req, res){
        
    }
    async getAllBrands(req, res){
        const brands = await Brand.findAll()
        return res.json(brands)
    }
}

module.exports = new BrandController()