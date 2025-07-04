import CreditCard from '../models/credit-card.model';
import { ICreditCard } from '../interfaces/models';
import Expense from '../models/expense.model';

export class CreditCardService {
  async getCardsByUser(userId: number): Promise<ICreditCard[]> {
    return CreditCard.findAll({ where: { user_id: userId } });
  }

  async createCard(cardData: Partial<ICreditCard>): Promise<ICreditCard> {
    return CreditCard.create(cardData as any);
  }

  async getCardById(cardId: number): Promise<ICreditCard | null> {
    return CreditCard.findByPk(cardId);
  }

  async updateCard(cardId: number, cardData: Partial<ICreditCard>): Promise<ICreditCard | null> {
    const card = await CreditCard.findByPk(cardId);
    if (!card) return null;
    await card.update(cardData as any);
    return card;
  }

  async getExpensesDueSoon(userId: number, cardId: number, from: Date, to: Date) {
    return Expense.findAll({
      where: {
        user_id: userId,
        credit_card_id: cardId,
        date: {
          [require('sequelize').Op.between]: [from, to],
        },
      },
    });
  }
} 