import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, Transaction, TransactionCreate, TransactionUpdate } from './types';

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
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
    getTransactions: builder.query<Transaction[], { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 100 }) => `/transactions?skip=${skip}&limit=${limit}`,
    }),
    createTransaction: builder.mutation<Transaction, TransactionCreate>({
      query: (transaction) => ({
        url: '/transactions',
        method: 'POST',
        body: transaction,
      }),
    }),
    updateTransaction: builder.mutation<Transaction, { id: number; transaction: TransactionUpdate }>({
      query: ({ id, transaction }) => ({
        url: `/transactions/${id}`,
        method: 'PATCH',
        body: transaction,
      }),
    }),
    deleteTransaction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetTransactionsQuery, useCreateTransactionMutation, useUpdateTransactionMutation, useDeleteTransactionMutation } = transactionsApi;