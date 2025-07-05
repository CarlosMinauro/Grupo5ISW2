export interface IUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role_id: number;
  parent_user_id?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRole {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccessLog {
  id: number;
  user_id: number;
  access_time: Date;
  action: string;
  firstaccess: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBudget {
  id: number;
  user_id: number;
  monthly_budget: number;
  category_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExpense {
  id?: number;
  user_id: number;
  date: Date;
  amount: number;
  description: string;
  recurring: boolean;
  category_id?: number | null;
  credit_card_id?: number | null;
  transaction_type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPasswordReset {
  id: number;
  usuarioId: number;
  token: string;
  created_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreditCard {
  id: number;
  user_id: number;
  card_number: string;
  card_holder_name: string;
  expiration_date?: Date | null;
  brand: string;
  bank: string;
  is_active: boolean;
  created_at: Date;
  cut_off_date?: Date | null;
  payment_due_date?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
} 