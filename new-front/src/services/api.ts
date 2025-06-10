import axios from 'axios';
import { LoginCredentials, RegisterData, ApiResponse, User, Expense, Budget, Category } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const expenseService = {
  getExpenses: async (creditCardId?: number): Promise<ApiResponse<Expense[]>> => {
    console.log('Obteniendo gastos...', creditCardId ? `para tarjeta ${creditCardId}` : 'para todas las tarjetas');
    const response = await api.get('/api/expenses', {
      params: { creditCardId }
    });
    console.log('Respuesta del servidor:', response.data);
    // Ensure the response data matches the database structure
    const expenses = response.data.expenses.map((expense: any) => {
      console.log('Procesando gasto:', expense);
      return {
        id: Number(expense.id),
        user_id: Number(expense.user_id),
        category_id: Number(expense.category_id),
        amount: Number(expense.amount),
        description: String(expense.description),
        date: String(expense.date),
        recurring: Boolean(expense.recurring),
        credit_card_id: expense.credit_card_id ? Number(expense.credit_card_id) : undefined,
        createdAt: expense.createdAt ? new Date(expense.createdAt) : undefined,
        updatedAt: expense.updatedAt ? new Date(expense.updatedAt) : undefined,
      };
    });
    console.log('Gastos procesados:', expenses);
    return { success: true, message: 'Expenses fetched successfully', data: expenses };
  },

  createExpense: async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Expense>> => {
    const response = await api.post('/api/expenses', {
      ...expense,
      amount: Number(expense.amount),
      category_id: Number(expense.category_id),
      user_id: Number(expense.user_id),
      credit_card_id: expense.credit_card_id,
      description: String(expense.description).trim(),
      date: String(expense.date),
      recurring: Boolean(expense.recurring),
    });
    // Transform the response to match the expected format
    return {
      success: true,
      message: response.data.message,
      data: {
        id: Number(response.data.expense.id),
        user_id: Number(response.data.expense.user_id),
        category_id: Number(response.data.expense.category_id),
        amount: Number(response.data.expense.amount),
        description: String(response.data.expense.description),
        date: String(response.data.expense.date),
        recurring: Boolean(response.data.expense.recurring),
        createdAt: response.data.expense.createdAt ? new Date(response.data.expense.createdAt) : undefined,
        updatedAt: response.data.expense.updatedAt ? new Date(response.data.expense.updatedAt) : undefined,
      }
    };
  },

  updateExpense: async (id: number, expense: Partial<Expense>): Promise<ApiResponse<Expense>> => {
    const response = await api.put(`/api/expenses/${id}`, {
      ...expense,
      amount: expense.amount ? Number(expense.amount) : undefined,
      category_id: expense.category_id ? Number(expense.category_id) : undefined,
      user_id: expense.user_id ? Number(expense.user_id) : undefined,
      description: expense.description ? String(expense.description).trim() : undefined,
      date: expense.date ? String(expense.date) : undefined,
      recurring: expense.recurring !== undefined ? Boolean(expense.recurring) : undefined,
    });
    // Wrap the response data in the ApiResponse format
    return {
      success: true,
      message: response.data.message || 'Expense updated successfully',
      data: response.data.expense,
    };
  },

  deleteExpense: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await api.delete(`/api/expenses/${id}`);
      console.log('Respuesta del servidor en deleteExpense:', response);
      return {
        success: true,
        message: response.data.message || 'Expense deleted successfully',
        data: true
      };
    } catch (error: any) {
      console.error('Error en deleteExpense:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting expense',
        data: false
      };
    }
  },
};

export const budgetService = {
  getBudgets: async (): Promise<ApiResponse<Budget[]>> => {
    const response = await api.get('/api/budgets');
    // Ensure the response data matches the database structure
    const budgets = response.data.budgets.map((budget: any) => ({
      id: Number(budget.id),
      user_id: Number(budget.user_id),
      category_id: Number(budget.category_id),
      monthly_budget: Number(budget.monthly_budget),
      createdAt: budget.createdAt ? new Date(budget.createdAt) : undefined,
      updatedAt: budget.updatedAt ? new Date(budget.updatedAt) : undefined,
    }));
    return { success: true, message: 'Budgets fetched successfully', data: budgets };
  },

  createBudget: async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Budget>> => {
    const response = await api.post('/api/budgets', {
      ...budget,
      monthly_budget: Number(budget.monthly_budget),
      category_id: Number(budget.category_id),
      user_id: Number(budget.user_id),
    });
    // Transform the response to match the expected format
    return {
      success: true,
      message: response.data.message,
      data: {
        id: Number(response.data.budget.id),
        user_id: Number(response.data.budget.user_id),
        category_id: Number(response.data.budget.category_id),
        monthly_budget: Number(response.data.budget.monthly_budget),
        createdAt: response.data.budget.createdAt ? new Date(response.data.budget.createdAt) : undefined,
        updatedAt: response.data.budget.updatedAt ? new Date(response.data.budget.updatedAt) : undefined,
      }
    };
  },

  updateBudget: async (id: number, budget: Partial<Budget>): Promise<ApiResponse<Budget>> => {
    const response = await api.put(`/api/budgets/${id}`, {
      ...budget,
      monthly_budget: budget.monthly_budget ? Number(budget.monthly_budget) : undefined,
      category_id: budget.category_id ? Number(budget.category_id) : undefined,
      user_id: budget.user_id ? Number(budget.user_id) : undefined,
    });
    // Wrap the response data in the ApiResponse format
    return {
      success: true,
      message: response.data.message || 'Budget updated successfully',
      data: response.data.budget,
    };
  },

  deleteBudget: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await api.delete(`/api/budgets/${id}`);
      console.log('Respuesta del servidor en deleteBudget:', response);
      return {
        success: true,
        message: response.data.message || 'Budget deleted successfully',
        data: true
      };
    } catch (error: any) {
      console.error('Error en deleteBudget:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting budget',
        data: false
      };
    }
  },
};

export const categoryService = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/api/categories');
    // Ensure the response data matches the database structure
    const categories = response.data.categories.map((category: any) => ({
      id: Number(category.id),
      name: String(category.name),
      createdAt: category.createdAt ? new Date(category.createdAt) : undefined,
      updatedAt: category.updatedAt ? new Date(category.updatedAt) : undefined,
    }));
    return { success: true, message: 'Categories fetched successfully', data: categories };
  },
};

export default api; 