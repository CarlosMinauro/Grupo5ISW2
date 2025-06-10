import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { ICategory } from '../interfaces/models';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: Partial<ICategory> = req.body;
      const category = await this.categoryService.createCategory(categoryData);
      res.status(201).json({
        message: 'Category created successfully',
        category,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error creating category',
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error updating category',
      });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.categoryService.deleteCategory(Number(id));
      if (!success) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error deleting category',
      });
    }
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json({ categories });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error fetching categories',
      });
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(Number(id));
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(200).json({ category });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error fetching category',
      });
    }
  }
} 