import { API_BASE_URL, Transaction, TransactionCreate, TransactionUpdate, ValidationError } from './types';

export const getTransactions = async (token: string, skip = 0, limit = 100): Promise<Transaction[]> => {
  const response = await fetch(`${API_BASE_URL}/transactions?skip=${skip}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return response.json();
};

export const createTransaction = async (token: string, transactionData: TransactionCreate): Promise<Transaction> => {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to create transaction');
  }

  return response.json();
};

export const getTransactionById = async (token: string, transactionId: number): Promise<Transaction> => {
  const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transaction');
  }

  return response.json();
};

export const updateTransaction = async (token: string, transactionId: number, transactionData: TransactionUpdate): Promise<Transaction> => {
  const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to update transaction');
  }

  return response.json();
};

export const deleteTransaction = async (token: string, transactionId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to delete transaction');
  }
};