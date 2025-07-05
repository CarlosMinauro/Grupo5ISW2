import { CategoryRepository } from '../repositories/category.repository';
import { ICategory } from '../interfaces/models';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findByName(categoryData.name!);
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
    return this.categoryRepository.create(categoryData);
  }

  async updateCategory(id: number, categoryData: Partial<ICategory>): Promise<ICategory | null> {
    if (categoryData.name) {
      const existingCategory = await this.categoryRepository.findByName(categoryData.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new Error('Category with this name already exists');
      }
    }
    return this.categoryRepository.update(id, categoryData);
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categoryRepository.delete(id);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: number): Promise<ICategory | null> {
    return this.categoryRepository.findById(id);
  }

  async getCategoriesByIds(ids: number[]): Promise<ICategory[]> {
    return this.categoryRepository.findByIds(ids);
  }
} 