import { ExpenseRepository } from '../repositories/expense.repository';
import { IExpense } from '../interfaces/models';

export class ExpenseService {
  private static instance: ExpenseService;
  private expenseRepository: ExpenseRepository;

  private constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  public static getInstance(): ExpenseService {
    if (!ExpenseService.instance) {
      ExpenseService.instance = new ExpenseService();
    }
    return ExpenseService.instance;
  }

  async createExpense(expenseData: Partial<IExpense>): Promise<IExpense> {
    console.log('Creando gasto con datos:', expenseData);
    if (!expenseData.credit_card_id) {
      throw new Error('El ID de la tarjeta es requerido');
    }
    return this.expenseRepository.create(expenseData);
  }

  async updateExpense(id: number, expenseData: Partial<IExpense>): Promise<IExpense | null> {
    return this.expenseRepository.update(id, expenseData);
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenseRepository.delete(id);
  }

  async getExpensesByUser(userId: number, creditCardId?: number): Promise<IExpense[]> {
    console.log('ExpenseService: Obteniendo gastos para usuario:', userId, creditCardId ? `y tarjeta ${creditCardId}` : '');
    if (!creditCardId) {
      throw new Error('El ID de la tarjeta es requerido');
    }
    const expenses = await this.expenseRepository.findByUserId(userId, creditCardId);
    console.log('ExpenseService: Gastos encontrados:', expenses.length);
    return expenses;
  }

  async getExpensesByCategory(categoryId: number): Promise<IExpense[]> {
    return this.expenseRepository.findByCategoryId(categoryId);
  }

  async getExpensesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<IExpense[]> {
    return this.expenseRepository.findByDateRange(userId, startDate, endDate);
  }

  async getTotalExpensesByCategory(userId: number, startDate: Date, endDate: Date): Promise<any[]> {
    return this.expenseRepository.getTotalExpensesByCategory(userId, startDate, endDate);
  }
} 