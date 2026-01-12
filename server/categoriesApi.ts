import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, Category, CategoryCreate } from './types';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
    }),
    createCategory: builder.mutation<Category, CategoryCreate>({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoriesApi;