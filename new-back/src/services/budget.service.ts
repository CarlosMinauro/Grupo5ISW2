import { BudgetRepository } from '../repositories/budget.repository';
import { IBudget } from '../interfaces/models';

export class BudgetService {
  private budgetRepository: BudgetRepository;

  constructor() {
    this.budgetRepository = new BudgetRepository();
  }

  async createBudget(budgetData: Partial<IBudget>): Promise<IBudget> {
    return this.budgetRepository.create(budgetData);
  }

  async updateBudget(id: number, budgetData: Partial<IBudget>): Promise<IBudget | null> {
    return this.budgetRepository.update(id, budgetData);
  }

  async deleteBudget(id: number): Promise<boolean> {
    return this.budgetRepository.delete(id);
  }

  async getBudgetsByUser(userId: number): Promise<IBudget[]> {
    return this.budgetRepository.findByUserId(userId);
  }

  async getBudgetsByCategory(categoryId: number): Promise<IBudget[]> {
    return this.budgetRepository.findByCategoryId(categoryId);
  }

  async getBudgetByUserAndCategory(userId: number, categoryId: number): Promise<IBudget | null> {
    return this.budgetRepository.findByUserAndCategory(userId, categoryId);
  }

  async getTotalBudgetByUser(userId: number): Promise<number> {
    return this.budgetRepository.getTotalBudgetByUser(userId);
  }
} 