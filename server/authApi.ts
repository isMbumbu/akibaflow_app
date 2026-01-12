import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, LoginRequest, Token, User } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // If we have a token, add it to headers
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Token, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
          grant_type: credentials.grant_type || 'password',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
    whoami: builder.query<User, void>({
      query: () => '/auth/whoami',
    }),
    register: builder.mutation<User, any>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useWhoamiQuery, useRegisterMutation } = authApi;