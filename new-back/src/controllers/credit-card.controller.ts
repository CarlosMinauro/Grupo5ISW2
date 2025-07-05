import { Request, Response } from 'express';
import { CreditCardService } from '../services/credit-card.service';
import moment from 'moment';
import CreditCard from '../models/credit-card.model';

export class CreditCardController {
  private creditCardService: CreditCardService;

  constructor() {
    this.creditCardService = new CreditCardService();
  }

  async getCards(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const cards = await this.creditCardService.getCardsByUser(user.id);
      // Mapear campos para que coincidan con lo que espera el frontend
      const mappedCards = cards.map(card => ({
        id: card.id,
        user_id: card.user_id,
        card_number: card.card_number,
        expiry_date: card.expiration_date instanceof Date
          ? moment(card.expiration_date).format('YYYY-MM-DD')
          : card.expiration_date,
        card_holder_name: card.card_holder_name,
        brand: card.brand,
        bank: card.bank,
        is_active: card.is_active,
        created_at: card.created_at instanceof Date
          ? card.created_at.toISOString()
          : card.created_at,
        cut_off_date: card.cut_off_date ? moment(card.cut_off_date).format('YYYY-MM-DD') : null,
        payment_due_date: card.payment_due_date ? moment(card.payment_due_date).format('YYYY-MM-DD') : null,
      }));
      return res.json({ cards: mappedCards });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching cards' });
    }
  }

  async addCard(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const { card_number, card_holder_name, expiry_date, brand, bank, cut_off_date, payment_due_date } = req.body;
      if (!card_number || !card_holder_name || !expiry_date) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }
      // Convertir MM/YY a Date (último día del mes)
      let expiration_date: Date | null = null;
      if (expiry_date) {
        const parsed = moment(expiry_date, 'MM/YY');
        if (!parsed.isValid()) {
          return res.status(400).json({ message: 'Formato de fecha inválido. Use MM/YY.' });
        }
        expiration_date = parsed.endOf('month').toDate();
      }
      const cardData = {
        user_id: user.id,
        card_number,
        card_holder_name,
        expiration_date,
        brand,
        bank,
        is_active: true,
        created_at: new Date(),
        cut_off_date: cut_off_date ? new Date(cut_off_date) : null,
        payment_due_date: payment_due_date ? new Date(payment_due_date) : null,
      };
      const newCard = await this.creditCardService.createCard(cardData);
      const mappedCard = {
        id: newCard.id,
        user_id: newCard.user_id,
        card_number: newCard.card_number,
        expiry_date: newCard.expiration_date instanceof Date ? newCard.expiration_date.toISOString().slice(0, 10) : newCard.expiration_date,
        card_holder_name: newCard.card_holder_name,
        brand: newCard.brand,
        bank: newCard.bank,
        is_active: newCard.is_active,
        created_at: newCard.created_at instanceof Date ? newCard.created_at.toISOString() : newCard.created_at,
        cut_off_date: newCard.cut_off_date ? moment(newCard.cut_off_date).format('YYYY-MM-DD') : null,
        payment_due_date: newCard.payment_due_date ? moment(newCard.payment_due_date).format('YYYY-MM-DD') : null,
      };
      return res.status(201).json({ card: mappedCard });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error adding card' });
    }
  }

  async editCard(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const { id } = req.params;
      const { card_number, card_holder_name, expiry_date, brand, bank, cut_off_date, payment_due_date, is_active } = req.body;
      let expiration_date: Date | null = null;
      if (expiry_date) {
        const parsed = moment(expiry_date, 'MM/YY');
        if (!parsed.isValid()) {
          return res.status(400).json({ message: 'Formato de fecha inválido. Use MM/YY.' });
        }
        expiration_date = parsed.endOf('month').toDate();
      }
      const cardData = {
        card_number,
        card_holder_name,
        expiration_date,
        brand,
        bank,
        cut_off_date: cut_off_date ? new Date(cut_off_date) : null,
        payment_due_date: payment_due_date ? new Date(payment_due_date) : null,
        is_active,
      };
      const updatedCard = await this.creditCardService.updateCard(Number(id), cardData);
      if (!updatedCard) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }
      const mappedCard = {
        id: updatedCard.id,
        user_id: updatedCard.user_id,
        card_number: updatedCard.card_number,
        expiry_date: updatedCard.expiration_date instanceof Date ? updatedCard.expiration_date.toISOString().slice(0, 10) : updatedCard.expiration_date,
        card_holder_name: updatedCard.card_holder_name,
        brand: updatedCard.brand,
        bank: updatedCard.bank,
        is_active: updatedCard.is_active,
        created_at: updatedCard.created_at instanceof Date ? updatedCard.created_at.toISOString() : updatedCard.created_at,
        cut_off_date: updatedCard.cut_off_date ? moment(updatedCard.cut_off_date).format('YYYY-MM-DD') : null,
        payment_due_date: updatedCard.payment_due_date ? moment(updatedCard.payment_due_date).format('YYYY-MM-DD') : null,
      };
      return res.json({ card: mappedCard });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error editando tarjeta' });
    }
  }

  async getAmountDue(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const { id } = req.params;
      const card = await this.creditCardService.getCardById(Number(id));
      if (!card) {
        return res.status(404).json({ message: 'Tarjeta no encontrada' });
      }
      // Buscar gastos asociados a la tarjeta cuyo payment_due_date esté en los próximos 7 días
      const now = new Date();
      const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const expenses = await this.creditCardService.getExpensesDueSoon(user.id, Number(id), now, in7days);
      const amountDue = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      return res.json({ amountDue, expenses });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error obteniendo monto por vencer' });
    }
  }

  async deleteCard(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const { id } = req.params;
      const card = await this.creditCardService.getCardById(Number(id));
      if (!card || card.user_id !== user.id) {
        return res.status(404).json({ message: 'Tarjeta no encontrada o no autorizada' });
      }
      const cardInstance = await CreditCard.findByPk(Number(id));
      if (cardInstance) await cardInstance.destroy();
      return res.json({ message: 'Tarjeta eliminada correctamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error eliminando tarjeta' });
    }
  }
} 