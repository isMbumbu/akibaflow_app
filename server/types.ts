// API Types based on OpenAPI spec

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  user_type?: string;
  phone_number?: string;
  active?: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  initial_balance: string;
  current_balance: string;
  currency: string;
  type: 'checking' | 'savings' | 'credit';
  is_active: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface AccountCreate {
  name: string;
  initial_balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'credit';
}

export interface AccountUpdate {
  name?: string;
  currency?: string;
  type?: 'checking' | 'savings' | 'credit';
  is_active?: boolean;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  transaction_type: 'INCOME' | 'EXPENSE';
  account_id: number;
  category_id: number;
  description: string;
  transaction_date: string;
  is_automated: boolean;
  raw_text: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreate {
  amount: number;
  transaction_type: 'INCOME' | 'EXPENSE';
  account_id: number;
  category_id: number;
  description: string;
  transaction_date: string;
}

export interface TransactionUpdate {
  category_id?: number;
  description?: string;
  transaction_date?: string;
}

export interface Category {
  id: number;
  name: string;
  system_name: string;
  is_custom: boolean;
  user_id: number;
}

export interface CategoryCreate {
  name: string;
  system_name: string;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

// API Base URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';