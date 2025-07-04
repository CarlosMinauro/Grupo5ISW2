import { api } from './api';
import { Card } from '../interfaces/models';
import { ApiResponse } from '../types';

export const cardService = {
  getCards: async (): Promise<ApiResponse<Card[]>> => {
    const response = await api.get('/api/cards');
    return {
      success: true,
      message: 'Cards fetched successfully',
      data: response.data.cards.map((card: any) => ({
        id: Number(card.id),
        user_id: Number(card.user_id),
        card_number: String(card.card_number),
        card_holder_name: String(card.card_holder_name),
        expiration_date: card.expiration_date ? new Date(card.expiration_date) : null,
        brand: String(card.brand),
        bank: String(card.bank),
        is_active: Boolean(card.is_active),
        created_at: new Date(card.created_at),
        createdAt: card.createdAt ? new Date(card.createdAt) : undefined,
        updatedAt: card.updatedAt ? new Date(card.updatedAt) : undefined,
      }))
    };
  },

  createCard: async (cardData: Partial<Card>): Promise<ApiResponse<Card>> => {
    const response = await api.post('/api/cards', cardData);
    return {
      success: true,
      message: 'Card created successfully',
      data: {
        id: Number(response.data.card.id),
        user_id: Number(response.data.card.user_id),
        card_number: String(response.data.card.card_number),
        card_holder_name: String(response.data.card.card_holder_name),
        expiration_date: response.data.card.expiration_date ? new Date(response.data.card.expiration_date) : null,
        brand: String(response.data.card.brand),
        bank: String(response.data.card.bank),
        is_active: Boolean(response.data.card.is_active),
        created_at: new Date(response.data.card.created_at),
        cut_off_date: response.data.card.cut_off_date ? new Date(response.data.card.cut_off_date) : null,
        payment_due_date: response.data.card.payment_due_date ? new Date(response.data.card.payment_due_date) : null,
        createdAt: response.data.card.createdAt ? new Date(response.data.card.createdAt) : undefined,
        updatedAt: response.data.card.updatedAt ? new Date(response.data.card.updatedAt) : undefined,
      }
    };
  },

  updateCard: async (id: number, cardData: Partial<Card>): Promise<ApiResponse<Card>> => {
    const response = await api.put(`/api/cards/${id}`, cardData);
    return {
      success: true,
      message: 'Card updated successfully',
      data: {
        id: Number(response.data.card.id),
        user_id: Number(response.data.card.user_id),
        card_number: String(response.data.card.card_number),
        card_holder_name: String(response.data.card.card_holder_name),
        expiration_date: response.data.card.expiration_date ? new Date(response.data.card.expiration_date) : null,
        brand: String(response.data.card.brand),
        bank: String(response.data.card.bank),
        is_active: Boolean(response.data.card.is_active),
        created_at: new Date(response.data.card.created_at),
        cut_off_date: response.data.card.cut_off_date ? new Date(response.data.card.cut_off_date) : null,
        payment_due_date: response.data.card.payment_due_date ? new Date(response.data.card.payment_due_date) : null,
        createdAt: response.data.card.createdAt ? new Date(response.data.card.createdAt) : undefined,
        updatedAt: response.data.card.updatedAt ? new Date(response.data.card.updatedAt) : undefined,
      }
    };
  },

  deleteCard: async (id: number): Promise<ApiResponse<void>> => {
    await api.delete(`/api/cards/${id}`);
    return {
      success: true,
      message: 'Card deleted successfully',
      data: undefined
    };
  }
}; 