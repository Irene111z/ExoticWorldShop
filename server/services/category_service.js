const category_repository = require('../repositories/category_repository')

class CategoryService{
    async createCategory(data) {
        const { name, parentId } = data;
    
        let parentCategory = null;
    
        if (parentId) {
            parentCategory = await category_repository.getCategoryById(parentId);
        }
    
        let level = 0;
        if (parentCategory) {
            level = parentCategory.level + 1;
        }
    
        return category_repository.addCategory({
            name,
            parentId: parentCategory ? parentCategory.id : null,
            level,
        });
    }
    
    async deleteCategory(id){
        const category = await category_repository.getCategoryById(id);
        if (!category){
            throw new Error('Категорія не знайдена');
        }
        if (!category.parentId) {
            let defaultCategory = await category_repository.getCategoryByName('Без категорії');
            if (!defaultCategory) {
                defaultCategory = await category_repository.createCategory({
                    name: 'Без категорії',
                    parentId: null,
                    level: 0,
                });
            }
            await category_repository.updateProductCategory(id, defaultCategory.id);
        } else {
            const subCategories = await category_repository.getSubcategoriesByParentId(id)
            for (const subcat of subCategories) {
                await category_repository.updateProductCategory(subcat.id, category.parentId)
                await category_repository.deleteCategory(subcat)
            }
        }
        await category_repository.deleteCategory(category);
    }
    async getAllCategories(){
        // const getCategoryTree = async (parentId = null) => {
        //     const categories = await category_repository.getSubcategoriesByParentId(parentId);

        //     for (const category of categories) {
        //         category.dataValues.children = await getCategoryTree(category.id)
        //     }
        //     return categories
        // };

        // return await getCategoryTree()
        return await category_repository.getAllCategories()
    }
    async updateCategory(id, name, newParentId){
        const category = await category_repository.getCategoryById(id)
        if (!category) {
            throw new Error('Категорія не знайдена')
        }
        if (name) category.name = name
        if (newParentId !== undefined) {
            const newParent = newParentId ? await category_repository.getCategoryById(newParentId) : null

            const checkCyclicDependency = async (parentId) => {
                if (!parentId) return false
                const parentCategory = await category_repository.getCategoryById(parentId);
                if (!parentCategory) return false
                if (parentCategory.id === category.id) return true
                return checkCyclicDependency(parentCategory.parentId)
            }
            const isCyclic = await checkCyclicDependency(newParentId);
            if (isCyclic) {
                throw ApiError.badRequest('Cannot set a category as a descendant of itself');
            }

            if (newParent && newParent.id === category.id) {
                throw ApiError.badRequest('Category cannot be its own parent');
            }

            category.parentId = newParent ? newParent.id : null;
            category.level = newParent ? newParent.level + 1 : 0;
        }
        return await category_repository.updateCategory(category);
    }
}

module.exports = new CategoryService()