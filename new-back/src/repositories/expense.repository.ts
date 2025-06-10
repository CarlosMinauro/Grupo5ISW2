import { BaseRepository } from './base.repository';
import Expense from '../models/expense.model';
import { IExpense } from '../interfaces/models';
import { Op, Sequelize } from 'sequelize';
import Category from '../models/category.model';
import CreditCard from '../models/creditCard.model';

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor() {
    super(Expense);
  }

  async findByUserId(userId: number, creditCardId?: number): Promise<Expense[]> {
    console.log('Buscando gastos para usuario:', userId, creditCardId ? `y tarjeta ${creditCardId}` : '');
    const where: any = { user_id: userId };
    if (creditCardId) {
      where.credit_card_id = creditCardId;
    }
    console.log('Condiciones de búsqueda:', where);
    const expenses = await this.model.findAll({
      where,
      include: [
        {
          model: Category,
          attributes: ['id', 'name']
        },
        {
          model: CreditCard,
          attributes: ['id', 'card_number', 'brand']
        }
      ],
      order: [['date', 'DESC']]
    });
    console.log('Gastos encontrados:', expenses.length);
    return expenses;
  }

  async findByCategoryId(categoryId: number): Promise<Expense[]> {
    return this.findBy({ category_id: categoryId } as Partial<IExpense>);
  }

  async findByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Expense[]> {
    return this.model.findAll({
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: ['Category'],
    });
  }

  async getTotalExpensesByCategory(userId: number, startDate: Date, endDate: Date): Promise<any[]> {
    return this.model.findAll({
      attributes: [
        'category_id',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
      ],
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ['category_id'],
      include: ['Category'],
    });
  }
} 