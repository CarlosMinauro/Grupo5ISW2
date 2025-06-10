import { Request, Response } from 'express';
import { BudgetService } from '../services/budget.service';
import { IBudget } from '../interfaces/models';
import { validationResult } from 'express-validator';

export class BudgetController {
  private budgetService: BudgetService;

  constructor() {
    this.budgetService = new BudgetService();
  }

  async createBudget(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const budgetData: Partial<IBudget> = {
        ...req.body,
        user_id: userId,
      };

      const budget = await this.budgetService.createBudget(budgetData);
      res.status(201).json({
        message: 'Budget created successfully',
        budget,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error creating budget',
      });
    }
  }

  async updateBudget(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { id } = req.params;
      const budget = await this.budgetService.updateBudget(Number(id), req.body);
      if (!budget) {
        res.status(404).json({ message: 'Budget not found' });
        return;
      }
      res.status(200).json({
        message: 'Budget updated successfully',
        budget,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error updating budget',
      });
    }
  }

  async deleteBudget(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.budgetService.deleteBudget(Number(id));
      if (!success) {
        res.status(404).json({ message: 'Budget not found' });
        return;
      }
      res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error deleting budget',
      });
    }
  }

  async getBudgets(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const budgets = await this.budgetService.getBudgetsByUser(userId);
      res.status(200).json({ budgets });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error fetching budgets',
      });
    }
  }

  async getBudgetByCategory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { categoryId } = req.params;
      const budget = await this.budgetService.getBudgetByUserAndCategory(
        userId,
        Number(categoryId)
      );
      if (!budget) {
        res.status(404).json({ message: 'Budget not found' });
        return;
      }
      res.status(200).json({ budget });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error fetching budget',
      });
    }
  }

  async getTotalBudget(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const total = await this.budgetService.getTotalBudgetByUser(userId);
      res.status(200).json({ total });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error fetching total budget',
      });
    }
  }
} 