import { BaseRepository } from './base.repository';
import Budget from '../models/budget.model';
import { IBudget } from '../interfaces/models';

export class BudgetRepository extends BaseRepository<Budget> {
  constructor() {
    super(Budget);
  }

  async findByUserId(userId: number): Promise<Budget[]> {
    return this.findBy({ user_id: userId } as Partial<IBudget>);
  }

  async findByCategoryId(categoryId: number): Promise<Budget[]> {
    return this.findBy({ category_id: categoryId } as Partial<IBudget>);
  }

  async findByUserAndCategory(userId: number, categoryId: number): Promise<Budget | null> {
    return this.findOne({
      user_id: userId,
      category_id: categoryId,
    } as Partial<IBudget>);
  }

  async getTotalBudgetByUser(userId: number): Promise<number> {
    const result = await this.model.sum('monthly_budget', {
      where: { user_id: userId },
    });
    return result || 0;
  }
} 