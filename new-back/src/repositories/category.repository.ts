import { BaseRepository } from './base.repository';
import Category from '../models/category.model';
import { ICategory } from '../interfaces/models';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(Category);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.findOne({ name } as Partial<ICategory>);
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return this.model.findAll({
      where: {
        id: ids,
      },
    });
  }
} 