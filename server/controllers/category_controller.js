const {Category} = require('../models/models')
const ApiError = require('../errors/ApiError')

class CategoryController{
    async createCategory(req, res, next){
        try {
            const { name, parentId } = req.body
            const parentCategory = parentId ? await Category.findByPk(parentId) : null;
            const level = parentCategory ? parentCategory.level + 1 : 0;
            const category = await Category.create({
                name,
                parentId: parentCategory ? parentCategory.id : null,
                level
            });
            return res.status(201).json(category)
          } 
          catch (error) {
            next(ApiError.internal(error.message));
          }
    }
    async deleteCategory(req, res, next){
        try {
            const {id} = req.params
            const category = await Category.findByPk(id)

            if(!category){
                return next(ApiError.notFound('Category not found'))
            }
            const childCategories = await Category.findAll({ where: { parentId: id } });
            if (childCategories.length > 0) {
                return next(ApiError.forbidden('Cannot delete category with child categories'));
            }

            await category.destroy()
            res.status(200).json({ message: 'Category deleted successfully' })
        } 
        catch (error) {
            next(ApiError.internal(error.message))
        }
    }
    async getAllCategories(req, res, next){
        try {
            const categories = await Category.findAll({
                include:{
                    model: Category,
                    as: 'children',
                }
            })
            return res.status(200).json(categories)
        } 
        catch (error) {
            next(ApiError.internal(error.message))
        }
    }
    async updateCategory(req, res, next){
        try {
            const {id} = req.params
            const {name, newParentId} = req.body
            const category = await Category.findByPk(id)
        
            if(!category){
                return next(ApiError.notFound('Category not found'))
            }
            if (name) {
                category.name = name
                await category.save()
            }
            if (newParentId !== undefined) {
                const newParent = newParentId ? await Category.findByPk(newParentId) : null
                category.parentId = newParent ? newParent.id : null;
                category.level = newParent ? newParent.level + 1 : 0;
                await category.save();
            }
    
            res.status(200).json(category)
        } 
        catch (error) {
            next(ApiError.internal(error.message))
        }
    }
}

module.exports = new CategoryController()