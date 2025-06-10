/**
 * Slice de Redux para Gastos
 * 
 * Este módulo implementa un slice de Redux para gestionar el estado relacionado
 * con gastos, siguiendo varios principios SOLID y patrones de diseño:
 * 
 * 1. Principio de Responsabilidad Única (SRP): El slice es responsable solo
 *    de gestionar el estado y las acciones relacionadas con gastos.
 * 
 * 2. Principio Abierto/Cerrado (OCP): El slice está abierto para extensión
 *    a través de nuevas acciones y reducers, pero cerrado para modificación
 *    de la funcionalidad existente.
 * 
 * 3. Principio de Segregación de Interfaces (ISP): La interfaz de estado
 *    solo incluye propiedades relevantes para los gastos.
 * 
 * 4. Principio de Inversión de Dependencias (DIP): El slice depende de
 *    abstracciones (interfaz IExpense) en lugar de implementaciones concretas.
 * 
 * El módulo también implementa:
 * - Patrón Factory: Las funciones createAsyncThunk actúan como fábricas para crear acciones
 * - Patrón Command: Cada acción representa un comando que puede ser ejecutado
 * - Patrón Observer: Sistema de suscripción de Redux para cambios de estado
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../index';

export interface Expense {
  id: number;
  user_id: number;
  date: string;
  amount: number;
  description: string;
  recurring: boolean;
  category_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExpenseState {
  expenses: Expense[];
  totalExpenses: number;
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  totalExpenses: 0,
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar gastos');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/expenses`, expense);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear gasto');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, ...expense }: Expense, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/expenses/${id}`, expense);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar gasto');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar gasto');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
        state.totalExpenses = action.payload.reduce((total: number, expense: Expense) => total + expense.amount, 0);
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
        state.totalExpenses += action.payload.amount;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.totalExpenses -= state.expenses[index].amount;
          state.expenses[index] = action.payload;
          state.totalExpenses += action.payload.amount;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        const expense = state.expenses.find(e => e.id === action.payload);
        if (expense) {
          state.totalExpenses -= expense.amount;
          state.expenses = state.expenses.filter(e => e.id !== action.payload);
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer; 