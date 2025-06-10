"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_repository_1 = require("../repositories/category.repository");
class CategoryService {
    constructor() {
        this.categoryRepository = new category_repository_1.CategoryRepository();
    }
    async createCategory(categoryData) {
        const existingCategory = await this.categoryRepository.findByName(categoryData.name);
        if (existingCategory) {
            throw new Error('Category with this name already exists');
        }
        return this.categoryRepository.create(categoryData);
    }
    async updateCategory(id, categoryData) {
        if (categoryData.name) {
            const existingCategory = await this.categoryRepository.findByName(categoryData.name);
            if (existingCategory && existingCategory.id !== id) {
                throw new Error('Category with this name already exists');
            }
        }
        return this.categoryRepository.update(id, categoryData);
    }
    async deleteCategory(id) {
        return this.categoryRepository.delete(id);
    }
    async getAllCategories() {
        return this.categoryRepository.findAll();
    }
    async getCategoryById(id) {
        return this.categoryRepository.findById(id);
    }
    async getCategoriesByIds(ids) {
        return this.categoryRepository.findByIds(ids);
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map