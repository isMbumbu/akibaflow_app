import { API_BASE_URL, Category, CategoryCreate, ValidationError } from './types';

export const getCategories = async (token: string): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
};

export const createCategory = async (token: string, categoryData: CategoryCreate): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error: ValidationError = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Failed to create category');
  }

  return response.json();
};

export const getCategoryById = async (token: string, categoryId: number): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }

  return response.json();
};