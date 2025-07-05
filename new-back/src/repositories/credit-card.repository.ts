import { BaseRepository } from './base.repository';
import CreditCard from '../models/credit-card.model';
import { ICreditCard } from '../interfaces/models';

export class CreditCardRepository extends BaseRepository<CreditCard> {
  constructor() {
    super(CreditCard);
  }

  async findByUserId(userId: number): Promise<CreditCard[]> {
    return this.findBy({ user_id: userId } as Partial<ICreditCard>);
  }
} 