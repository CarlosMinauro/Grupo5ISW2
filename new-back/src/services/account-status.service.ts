import { Expense, Category } from '../models';
import { Op } from 'sequelize';

export interface MonthlyStatus {
  month: number;
  year: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: {
    categoryId: number;
    categoryName: string;
    amount: number;
  }[];
  totalPaid: number;
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

      // Calcular total pagado (type 'payment')
      const totalPaid = expenses
        .filter(expense => expense.transaction_type === 'payment')
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

      // Calcular gastos totales (type 'expense')
      const totalExpenses = expenses
        .filter(expense => expense.transaction_type === 'expense')
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

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
        totalExpenses,
        balance: totalPaid - totalExpenses,
        expensesByCategory,
        totalPaid
      };
    } catch (error) {
      console.error('Error en getMonthlyStatus:', error);
      throw error;
    }
  }
} 