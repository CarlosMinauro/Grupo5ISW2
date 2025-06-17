"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
class CategoryController {
    constructor() {
        this.categoryService = new category_service_1.CategoryService();
    }
    async createCategory(req, res) {
        try {
            const categoryData = req.body;
            const category = await this.categoryService.createCategory(categoryData);
            res.status(201).json({
                message: 'Category created successfully',
                category,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error creating category',
            });
        }
    }
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await this.categoryService.updateCategory(Number(id), req.body);
            if (!category) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            res.status(200).json({
                message: 'Category updated successfully',
                category,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error updating category',
            });
        }
    }
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const success = await this.categoryService.deleteCategory(Number(id));
            if (!success) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            res.status(200).json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error deleting category',
            });
        }
    }
    async getCategories(_req, res) {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json({ categories });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error fetching categories',
            });
        }
    }
    async getCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(Number(id));
            if (!category) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
            res.status(200).json({ category });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error fetching category',
            });
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map