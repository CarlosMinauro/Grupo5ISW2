/**
 * Interfaces para los modelos de la aplicación
 * 
 * Estas interfaces siguen el Principio de Segregación de Interfaces (ISP) al definir
 * interfaces separadas para diferentes tipos de datos, permitiendo que los clientes
 * dependan solo de las interfaces que necesitan.
 * 
 * Las interfaces también soportan el Principio de Sustitución de Liskov (LSP) al
 * garantizar que cualquier implementación de estas interfaces pueda ser utilizada
 * de manera intercambiable sin romper el comportamiento de la aplicación.
 */

export interface IUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IRole {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface IExpense {
  id: number;
  amount: number;
  description: string;
  date: Date;
  category_id: number;
  user_id: number;
  recurring: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IBudget {
  id: number;
  monthly_budget: number;
  category_id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICategory {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface IAccessLog {
  id: number;
  user_id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

export interface Card {
  id: number;
  user_id: number;
  card_number: string;
  card_holder_name: string;
  expiration_date: Date | null;
  brand: string;
  bank: string;
  is_active: boolean;
  created_at: Date;
  cut_off_date: Date | null;
  payment_due_date: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdditionalUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  parent_user_id: number;
} 