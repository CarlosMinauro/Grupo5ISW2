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

      if (!creditCardId) {
        throw new Error('El ID de la tarjeta es requerido');
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      console.log('AccountStatusService: Attempting to fetch expenses between:', startDate, 'and', endDate);
      console.log('AccountStatusService: For user:', userId, 'and credit card:', creditCardId);

      const expenses = await Expense.findAll({
        where: {
          user_id: userId,
          credit_card_id: creditCardId,
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [{
          model: Category,
          attributes: ['id', 'name']
        }]
      });

      console.log('AccountStatusService: Expenses found:', expenses.length);

      const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      
      // Fetch all budgets for the user
      console.log('AccountStatusService: Attempting to fetch budgets for user:', userId);
      const budgets = await Budget.findAll({
        where: {
          user_id: userId,
        },
      });

      console.log('AccountStatusService: Budgets found:', budgets.length);
      console.log('AccountStatusService: Budgets data:', JSON.stringify(budgets));

      // Sum the monthly_budget for all fetched budgets
      const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.monthly_budget), 0);

      console.log('AccountStatusService: Total budget calculated:', totalBudget);

      // Assign totalBudget to totalIncome
      const totalIncome = totalBudget;

      console.log('AccountStatusService: Processing expenses by category');
      const expensesByCategory = expenses.reduce((acc, expense) => {
        const categoryId = expense.Category?.id || 0; // Default to 0 or a special ID for uncategorized
        const categoryName = expense.Category?.name || 'Uncategorized';
        
        const existingCategory = acc.find(cat => cat.categoryId === categoryId);

        if (existingCategory) {
          existingCategory.amount += Number(expense.amount);
        } else {
          acc.push({
            categoryId,
            categoryName,
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