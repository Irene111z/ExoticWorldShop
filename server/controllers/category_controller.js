const {Category, Product} = require('../models/models')
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
    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
    
            if (!category) {
                return next(ApiError.notFound('Category not found'));
            }
    
            // Якщо категорія — головна (не має батьків)
            if (!category.parentId) {
                // Створюємо категорію за замовчуванням (якщо її ще немає)
                const defaultCategory = await Category.findOne({
                    where: { name: 'Без категорії' }
                });
    
                if (!defaultCategory) {
                    // Якщо категорії за замовчуванням не існує, створюємо її
                    await Category.create({
                        name: 'Без категорії',
                        parentId: null,
                        level: 0
                    });
                }
    
                // Переміщаємо всі товари з цієї категорії до категорії за замовчуванням
                await Product.update(
                    { categoryId: defaultCategory.id },
                    { where: { categoryId: id } }
                );
            } else {
                // Якщо категорія не головна, переносимо товари з підкатегорій до батьківської категорії
                const childCategories = await Category.findAll({
                    where: { parentId: id }
                });
    
                // Для кожної підкатегорії переносимо товари
                for (const childCategory of childCategories) {
                    // Переміщаємо всі товари в батьківську категорію
                    await Product.update(
                        { categoryId: category.id }, // Переносимо товари до батьківської категорії
                        { where: { categoryId: childCategory.id } }
                    );
    
                    // Видаляємо підкатегорію після перенесення товарів
                    await childCategory.destroy();
                }
            }
    
            // Видаляємо основну категорію
            await category.destroy();
    
            res.status(200).json({ message: 'Category and its subcategories deleted successfully, products moved to default category' });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    
    
    async getAllCategories(req, res, next) {
        try {
            // Функція для рекурсивного отримання підкатегорій
            const getCategoryTree = async (parentId = null) => {
                const categories = await Category.findAll({
                    where: { parentId },
                });
    
                // Для кожної категорії рекурсивно додаємо її підкатегорії
                for (const category of categories) {
                    // Рекурсивно додаємо підкатегорії для кожної категорії
                    category.dataValues.children = await getCategoryTree(category.id);
                }
    
                return categories;
            };
    
            // Отримуємо всі категорії починаючи з головних
            const categories = await getCategoryTree();
    
            if (!categories || categories.length === 0) {
                return next(ApiError.notFound('No categories found'));
            }
    
            res.status(200).json(categories);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    
    async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { name, newParentId } = req.body;
            const category = await Category.findByPk(id);
    
            if (!category) {
                return next(ApiError.notFound('Категорія не знайдена'));
            }
            if (name) {
                category.name = name;
            }
            if (newParentId !== undefined) {
                const newParent = newParentId ? await Category.findByPk(newParentId) : null;
    
                const checkCyclicDependency = async (parentId) => {
                    if (!parentId) return false;
    
                    const parentCategory = await Category.findByPk(parentId);
                    if (!parentCategory) return false;
    
                    if (parentCategory.id === category.id) return true;
    
                    return checkCyclicDependency(parentCategory.parentId);
                };
    
                const isCyclic = await checkCyclicDependency(newParentId);
                if (isCyclic) {
                    return next(ApiError.badRequest('Cannot set a category as a descendant of itself'));
                }
                if (newParent && newParent.id === category.id) {
                    return next(ApiError.badRequest('Category cannot be its own parent'));
                }
                category.parentId = newParent ? newParent.id : null;
                category.level = newParent ? newParent.level + 1 : 0;
            }
            await category.save();
            res.status(200).json(category);
        } 
        catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    
    
}

module.exports = new CategoryController()