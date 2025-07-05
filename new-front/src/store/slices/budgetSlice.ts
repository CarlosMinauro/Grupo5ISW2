import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../index';
import { API_URL } from '../../config';

export interface Budget {
  id: number;
  user_id: number;
  monthly_budget: number;
  category_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BudgetState {
  budgets: Budget[];
  totalBudget: number;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  totalBudget: 0,
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/budgets`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar presupuestos');
    }
  }
);

export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/budgets`, budget);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear presupuesto');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, ...budget }: Budget, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/budgets/${id}`, budget);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar presupuesto');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/budgets/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar presupuesto');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
        state.totalBudget = action.payload.reduce((total: number, budget: Budget) => total + budget.monthly_budget, 0);
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.push(action.payload);
        state.totalBudget += action.payload.monthly_budget;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.budgets.findIndex(budget => budget.id === action.payload.id);
        if (index !== -1) {
          state.totalBudget -= state.budgets[index].monthly_budget;
          state.budgets[index] = action.payload;
          state.totalBudget += action.payload.monthly_budget;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.loading = false;
        const budget = state.budgets.find(b => b.id === action.payload);
        if (budget) {
          state.totalBudget -= budget.monthly_budget;
          state.budgets = state.budgets.filter(b => b.id !== action.payload);
        }
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = budgetSlice.actions;
export default budgetSlice.reducer; 