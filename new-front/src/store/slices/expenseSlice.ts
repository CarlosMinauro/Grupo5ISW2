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
import { Expense } from '../../types';
import { expenseService } from '../../services/api';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  totalExpenses: number;
}

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
  totalExpenses: 0
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenses();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching expenses');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expenseData: Partial<Expense>, { rejectWithValue }) => {
    try {
      const response = await expenseService.createExpense(expenseData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error creating expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, expenseData }: { id: number; expenseData: Partial<Expense> }, { rejectWithValue }) => {
    try {
      const response = await expenseService.updateExpense(id, expenseData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: number, { rejectWithValue }) => {
    try {
      await expenseService.deleteExpense(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.data;
        state.totalExpenses = action.payload.data.reduce((total: number, expense: Expense) => {
          if (expense.transaction_type === 'expense') {
            return total + expense.amount;
          }
          return total;
        }, 0);
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
        state.expenses.push(action.payload.data);
        if (action.payload.data.transaction_type === 'expense') {
          state.totalExpenses += action.payload.data.amount;
        }
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
        const index = state.expenses.findIndex(expense => expense.id === action.payload.data.id);
        if (index !== -1) {
          if (state.expenses[index].transaction_type === 'expense') {
            state.totalExpenses -= state.expenses[index].amount;
          }
          state.expenses[index] = action.payload.data;
          if (action.payload.data.transaction_type === 'expense') {
            state.totalExpenses += action.payload.data.amount;
          }
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
        if (expense && expense.transaction_type === 'expense') {
          state.totalExpenses -= expense.amount;
        }
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default expenseSlice.reducer; 