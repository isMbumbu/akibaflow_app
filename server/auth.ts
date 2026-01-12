import { API_BASE_URL, LoginRequest, Token, User, UserCreate, ValidationError } from './types';

export const login = async (credentials: LoginRequest): Promise<Token> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  formData.append('grant_type', credentials.grant_type || 'password');

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Login failed');
  }

  return response.json();
};

export const register = async (userData: UserCreate): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Registration failed');
  }

  return response.json();
};

export const whoami = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/whoami`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json();
};