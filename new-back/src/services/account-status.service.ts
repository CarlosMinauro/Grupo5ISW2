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

      // Use date strings for DATEONLY field comparison
      const startDateStr = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const endDateStr = `${year}-${month.toString().padStart(2, '0')}-${lastDayOfMonth.toString().padStart(2, '0')}`;

      const expenses = await Expense.findAll({
        where: {
          user_id: userId,
          credit_card_id: creditCardId,
          date: {
            [Op.gte]: startDateStr,
            [Op.lte]: endDateStr
          }
        },
        include: [{
          model: Category,
          attributes: ['id', 'name']
        }]
      });

      // Asegurarse de que expenses sea un array
      const expensesArray = expenses || [];

      // Calcular total pagado (type 'payment')
      const totalPaid = expensesArray
        .filter(expense => expense.transaction_type === 'payment')
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

      // Calcular gastos totales (type 'expense')
      const totalExpenses = expensesArray
        .filter(expense => expense.transaction_type === 'expense')
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

      const expensesByCategory = expensesArray.reduce((acc, expense) => {
        const categoryId = expense.Category?.id || 0;
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