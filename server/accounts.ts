import { API_BASE_URL, Account, AccountCreate, AccountUpdate, ValidationError } from './types';

export const getAccounts = async (token: string): Promise<Account[]> => {
  const response = await fetch(`${API_BASE_URL}/accounts/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }

  return response.json();
};

export const createAccount = async (token: string, accountData: AccountCreate): Promise<Account> => {
  const response = await fetch(`${API_BASE_URL}/accounts/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(accountData),
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to create account');
  }

  return response.json();
};

export const getAccountById = async (token: string, accountId: number): Promise<Account> => {
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch account');
  }

  return response.json();
};

export const updateAccount = async (token: string, accountId: number, accountData: AccountUpdate): Promise<Account> => {
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(accountData),
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to update account');
  }

  return response.json();
};

export const deleteAccount = async (token: string, accountId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to delete account');
  }
};