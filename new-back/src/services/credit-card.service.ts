import CreditCard from '../models/credit-card.model';
import { ICreditCard } from '../interfaces/models';

export class CreditCardService {
  async getCardsByUser(userId: number): Promise<ICreditCard[]> {
    return CreditCard.findAll({ where: { user_id: userId } });
  }

  async createCard(cardData: Partial<ICreditCard>): Promise<ICreditCard> {
    return CreditCard.create(cardData as any);
  }
} 