const product_service = require('../services/product_service')
const ApiError = require('../errors/ApiError')

class ProductController{
    // async createProduct(req, res, next){
    //     try{
    //         let {name, price, disc_price, description, quantity, categoryId, brandId, productFeatures} = req.body
            
    //         const {img} = req.files
    //         let fileName = uuid.v4()+".jpg"
    //         img.mv(path.resolve(__dirname, '..','static',fileName))
            
    //         const product = await Product.create({name, price, disc_price, description, quantity, categoryId, brandId, img:fileName})

    //         if(productFeatures){
    //             productFeatures = JSON.parse(productFeatures)
    //             productFeatures.forEach(i=>
    //                 ProductFeatures.create({
    //                    name: i.name,
    //                    description: i.description,
    //                    productId: product.id
    //                 })
    //             )
    //         }    
    //         return res.json(product)   
    //     }
    //     catch(error){
    //        next(ApiError.badRequest(error.message)) 
    //     }
    // }
    // async getAllProducts(req, res, next) {
    //     let { brandId, categoryId, limit, page } = req.query;
    //     page = page || 1;
    //     limit = limit || 12;
    //     let offset = page * limit - limit;
    //     let products;
    //     try {
    //         if (!brandId && !categoryId) {
    //             products = await Product.findAndCountAll({ limit, offset });
    //         }
        
    //         if (brandId && !categoryId) {
    //             products = await Product.findAndCountAll({ where: { brandId }, limit, offset });
    //         }
        
    //         if (!brandId && categoryId) {
    //             // Отримуємо всі підкатегорії для вказаної категорії
    //             const getSubcategories = async (parentId) => {
    //                 const subcategories = await Category.findAll({
    //                     where: { parentId }
    //                 });
        
    //                 let subcategoryIds = subcategories.map(subcat => subcat.id);
        
    //                 // Для кожної підкатегорії рекурсивно додаємо її підкатегорії
    //                 for (const subcategory of subcategories) {
    //                     const childSubcategoryIds = await getSubcategories(subcategory.id);
    //                     subcategoryIds = subcategoryIds.concat(childSubcategoryIds);
    //                 }
        
    //                 return subcategoryIds;
    //             };
        
    //             // Отримуємо всі підкатегорії, починаючи з вказаної категорії
    //             const subcategoryIds = await getSubcategories(categoryId);
        
    //             // Додаємо основну категорію та підкатегорії в пошуковий запит
    //             products = await Product.findAndCountAll({
    //                 where: {
    //                     categoryId: [categoryId, ...subcategoryIds]  // Шукаємо по основній категорії та підкатегоріям
    //                 },
    //                 limit,
    //                 offset
    //             });
    //         }
        
    //         if (brandId && categoryId) {
    //             // Отримуємо всі підкатегорії для вказаної категорії
    //             const subcategoryIds = await getSubcategories(categoryId);
        
    //             products = await Product.findAndCountAll({
    //                 where: {
    //                     brandId,
    //                     categoryId: [categoryId, ...subcategoryIds]  // Шукаємо по основній категорії та підкатегоріям
    //                 },
    //                 limit,
    //                 offset
    //             });
    //         }
        
    //         return res.json(products);
    //     } catch (error) {
    //         next(ApiError.badRequest(error.message)) 
    //     }

    // }
    // async getProduct(req, res, next){
    //     const {id} = req.params
    //     try {
    //         const product = await Product.findOne({where:{id}, include:[{model:ProductFeatures}]})
    //         return res.json(product)
    //     } catch (error) {
    //         next(ApiError.badRequest(error.message)) 
    //     }
        
    // }
    // async deleteProduct(req, res, next){
    //     const {id} = req.params
    //     try {
    //         const product = await Product.findByPk(id)
    //         if(!product)
    //         {
    //             return next(ApiError.badRequest("Товару не існує"))
    //         }
    //         await product.destroy()
    //         return res.status(200).json({message:"Товар видалено"})

    //     } catch (error) {
    //         next(ApiError.badRequest(error.message)) 
    //     }
    // }
    // async changeProduct(req, res, next){
    //     const {id} = req.params
    //     const {name, price, disc_price, description, quantity} = req.body
    //     try {
    //         const product = await Product.findByPk(id)
    //         if(!product){
    //             return next(ApiError.notFound("Товар не знайдено"))
    //         }
    //         if(name){
    //             product.name = name
    //         }
    //         if(price){
    //             product.price = price
    //         }
    //         if(disc_price){
    //             product.disc_price = disc_price
    //         }
    //         if(description){
    //             product.description = description
    //         }
    //         if(quantity){
    //             product.quantity = quantity
    //         }
    //         await product.save();
    //         return res.status(200).json(product);
    //     } catch (error) {
    //         next(ApiError.badRequest(error.message)) 
    //     }
    // }
    async createProduct(req, res, next){
        try {
            const product = await product_service.createProduct(req.body, req.files);
            res.status(200).json(product);
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async deleteProduct(req, res, next){
       try {
            await product_service.deleteProduct(req.params.id)
            return res.status(200).json({message:'Товар успішно видалено'})
       } catch (error) {
            next(ApiError.badRequest(error.message)) 
       }
    }
    async getAllProducts(req, res, next){
        try {
            const products = await product_service.getAllProducts(req.query)
            return res.status(200).json(products)
        } catch (error) {
             next(ApiError.badRequest(error.message)) 
        }
    }
    
    async getProduct(req, res, next){
        try {
            const product = await product_service.getProduct(req.params.id)
            return res.status(200).json(product)
        } catch (error) {
             next(ApiError.badRequest(error.message)) 
        }
    }

    async searchProductByName(req, res, next){
        try {
            const products = await product_service.searchProductByName(req.query)
            return res.status(200).json(products)
        } catch (error) {
             next(ApiError.badRequest(error.message)) 
        }
    }
    
    async changeProduct(req, res, next){
        try {
            const product = await product_service.changeProduct(req.params.id, req.body)
            return res.status(200).json(product)
        } catch (error) {
             next(ApiError.badRequest(error.message)) 
        }
    }
}

module.exports = new ProductController()