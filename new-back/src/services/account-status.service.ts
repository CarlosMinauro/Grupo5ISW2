import { Expense, Category, Budget } from '../models';
import { Op } from 'sequelize';

export interface MonthlyStatus {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: {
    categoryId: number;
    categoryName: string;
    amount: number;
  }[];
}

export class AccountStatusService {
  private static instance: AccountStatusService;

  private constructor() {}

  public static getInstance(): AccountStatusService {
    if (!AccountStatusService.instance) {
      AccountStatusService.instance = new AccountStatusService();
    }
    return AccountStatusService.instance;
  }

  async getMonthlyStatus(month: number, year: number, userId: number, creditCardId?: number): Promise<MonthlyStatus> {
    try {
      // Asegurarse de que las fechas sean válidas
      if (month < 1 || month > 12) {
        throw new Error('Mes inválido');
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      console.log('Buscando gastos entre:', startDate, 'y', endDate);

      const expenseWhere: any = {
        user_id: userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      };
      if (creditCardId) {
        expenseWhere.credit_card_id = creditCardId;
      }

      const expenses = await Expense.findAll({
        where: expenseWhere,
        include: [{
          model: Category,
          attributes: ['id', 'name']
        }]
      });

      console.log('Gastos encontrados:', expenses.length);

      const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      
      // Fetch all budgets for the user
      console.log('Fetching all budgets for user:', userId);
      const budgets = await Budget.findAll({
        where: {
          user_id: userId,
        },
      });

      console.log('Presupuestos encontrados:', budgets.length);
      console.log('Presupuestos data:', JSON.stringify(budgets));

      // Sum the monthly_budget for all fetched budgets
      const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.monthly_budget), 0);

      console.log('Total presupuesto calculado:', totalBudget);

      // Assign totalBudget to totalIncome
      const totalIncome = totalBudget;

      const expensesByCategory = expenses.reduce((acc, expense) => {
        const categoryId = expense.Category.id;
        const existingCategory = acc.find(cat => cat.categoryId === categoryId);

        if (existingCategory) {
          existingCategory.amount += Number(expense.amount);
        } else {
          acc.push({
            categoryId,
            categoryName: expense.Category.name,
            amount: Number(expense.amount)
          });
        }

        return acc;
      }, [] as { categoryId: number; categoryName: string; amount: number }[]);

      return {
        month,
        year,
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        expensesByCategory
      };
    } catch (error) {
      console.error('Error en getMonthlyStatus:', error);
      throw error;
    }
  }
} 