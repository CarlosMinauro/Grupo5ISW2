import axios from 'axios';
import { API_URL } from '../config';
import api from './api';

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
  totalPaid: number;
}

export class AccountStatusService {
  private static instance: AccountStatusService;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL.replace(/\/$/, '')}/api/account-status`;
    console.log('AccountStatusService base URL:', this.baseUrl);
  }

  public static getInstance(): AccountStatusService {
    if (!AccountStatusService.instance) {
      AccountStatusService.instance = new AccountStatusService();
    }
    return AccountStatusService.instance;
  }

  async getMonthlyStatus(month: number, year: number, creditCardId?: number): Promise<MonthlyStatus> {
    try {
      console.log('Fetching monthly status from URL:', `${this.baseUrl}/monthly`);
      const params: any = { month, year };
      if (creditCardId) params.credit_card_id = creditCardId;
      const response = await axios.get(`${this.baseUrl}/monthly`, {
        params,
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly status:', error);
      if (axios.isAxiosError(error)) {
        console.error('Request URL:', error.config?.url);
        console.error('Request params:', error.config?.params);
      }
      throw new Error('Error fetching monthly status');
    }
  }

  async getMontoPorVencer(dias = 7) {
    const response = await api.get(`/api/account-status/por-vencer?dias=${dias}`);
    return response.data;
  }
}

export const getMontoPorVencer = async (dias = 7) => {
  const response = await api.get(`/api/account-status/por-vencer?dias=${dias}`);
  return response.data;
};

export const updateProfile = async (profileData: { name?: string; email?: string; password?: string }) => {
  const response = await api.put('/api/users/profile', profileData);
  return response.data;
}; 