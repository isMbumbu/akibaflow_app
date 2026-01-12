import { API_BASE_URL, User, UserCreate, UserUpdate, ValidationError } from './types';

export const getUsers = async (token: string, offset = 0, limit = 100): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/user?offset=${offset}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const createUser = async (token: string, userData: UserCreate & { user_type?: string; is_superuser?: boolean }): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to create user');
  }

  return response.json();
};

export const getUserById = async (token: string, userId: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
};

export const updateUser = async (token: string, userId: number, userData: UserUpdate): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to update user');
  }

  return response.json();
};

export const searchUsers = async (token: string, query: string, offset = 0, limit = 100): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/user/search?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search users');
  }

  return response.json();
};