// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
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
  category_id: number;
  monthly_budget: number;
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
  category_id: number;
  amount: number;
  description: string;
  date: string;
  recurring: boolean;
  credit_card_id?: number;
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
  expiry_date: string;
  card_holder_name: string;
  // Add other card properties as needed
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
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
} 