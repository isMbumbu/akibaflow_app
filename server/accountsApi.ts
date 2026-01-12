import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, Account, AccountCreate, AccountUpdate } from './types';

export const accountsApi = createApi({
  reducerPath: 'accountsApi',
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
    getAccounts: builder.query<Account[], void>({
      query: () => '/accounts/',
    }),
    createAccount: builder.mutation<Account, AccountCreate>({
      query: (account) => ({
        url: '/accounts/',
        method: 'POST',
        body: account,
      }),
    }),
    updateAccount: builder.mutation<Account, { id: number; account: AccountUpdate }>({
      query: ({ id, account }) => ({
        url: `/accounts/${id}`,
        method: 'PATCH',
        body: account,
      }),
    }),
    deleteAccount: builder.mutation<void, number>({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetAccountsQuery, useCreateAccountMutation, useUpdateAccountMutation, useDeleteAccountMutation } = accountsApi;