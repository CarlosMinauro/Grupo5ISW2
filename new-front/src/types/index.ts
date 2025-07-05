// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash?: string;
  role_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Budget Types
export interface Budget {
  id: number;
  user_id: number;
  monthly_budget: number;
  category_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  totalBudget: number;
}

// Expense Types
export interface Expense {
  id: number;
  user_id: number;
  date: Date;
  amount: number;
  description: string;
  recurring: boolean;
  category_id?: number | null;
  credit_card_id?: number;
  transaction_type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  totalExpenses: number;
}

// Card Types
export interface Card {
  id: number;
  user_id: number;
  card_number: string;
  card_holder_name: string;
  expiration_date?: Date | null;
  brand: string;
  bank: string;
  is_active: boolean;
  created_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Root State Type
export interface RootState {
  auth: AuthState;
  budgets: BudgetState;
  expenses: ExpenseState;
  categories: CategoryState;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
} 