import { Request, Response } from 'express';
import { ExpenseService } from '../services/expense.service';
import { IExpense } from '../interfaces/models';
import { validationResult } from 'express-validator';

export class ExpenseController {
  private static instance: ExpenseController;
  private expenseService: ExpenseService;

  private constructor() {
    this.expenseService = ExpenseService.getInstance();
  }

  public static getInstance(): ExpenseController {
    if (!ExpenseController.instance) {
      ExpenseController.instance = new ExpenseController();
    }
    return ExpenseController.instance;
  }

  async createExpense(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const expenseData: Partial<IExpense> = {
        ...req.body,
        user_id: userId,
      };

      const expense = await this.expenseService.createExpense(expenseData);
      res.status(201).json({
        message: 'Expense created successfully',
        expense,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error creating expense',
      });
    }
  }

  async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const creditCardId = req.query.credit_card_id ? Number(req.query.credit_card_id) : undefined;
      
      if (!creditCardId) {
        res.status(400).json({ message: 'El ID de la tarjeta es requerido' });
        return;
      }

      console.log('Obteniendo gastos para usuario:', userId, `y tarjeta ${creditCardId}`);
      console.log('Query params:', req.query);
      
      const expenses = await this.expenseService.getExpensesByUser(userId, creditCardId);
      console.log('Gastos encontrados:', expenses.length);
      console.log('Detalle de gastos:', JSON.stringify(expenses, null, 2));
      
      res.status(200).json({ expenses });
    } catch (error: any) {
      console.error('Error al obtener gastos:', error);
      res.status(500).json({
        message: error.message || 'Error fetching expenses',
      });
    }
  }

  async updateExpense(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { id } = req.params;
      const expenseData = req.body;
      const expense = await this.expenseService.updateExpense(Number(id), expenseData);
      if (expense) {
        res.status(200).json({
          message: 'Expense updated successfully',
          expense,
        });
      } else {
        res.status(404).json({
          message: 'Expense not found',
        });
      }
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error updating expense',
      });
    }
  }

  async deleteExpense(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.expenseService.deleteExpense(Number(id));
      if (success) {
        res.status(200).json({
          message: 'Expense deleted successfully',
        });
      } else {
        res.status(404).json({
          message: 'Expense not found',
        });
      }
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error deleting expense',
      });
    }
  }

  async getExpensesByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({ message: 'startDate and endDate are required query parameters.' });
        return;
      }

      const expenses = await this.expenseService.getExpensesByDateRange(
        userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.status(200).json({ expenses });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Error fetching expenses by date range',
      });
    }
  }

  async getTotalExpensesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({ message: 'startDate and endDate are required query parameters.' });
        return;
      }

      const totalExpenses = await this.expenseService.getTotalExpensesByCategory(
        userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.status(200).json({ totalExpenses });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Error fetching total expenses by category',
      });
    }
  }
} 