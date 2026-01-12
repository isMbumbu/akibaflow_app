import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { accountsApi } from './server/accountsApi';
import { authApi } from './server/authApi';
import { categoriesApi } from './server/categoriesApi';
import { transactionsApi } from './server/transactionsApi';
import { User } from './server/types';

// Web-compatible storage
const createWebStorage = () => {
  if (typeof window !== 'undefined') {
    return {
      getItem: (key: string) => {
        return Promise.resolve(localStorage.getItem(key));
      },
      setItem: (key: string, value: string) => {
        return Promise.resolve(localStorage.setItem(key, value));
      },
      removeItem: (key: string) => {
        return Promise.resolve(localStorage.removeItem(key));
      },
    };
  }
  return AsyncStorage;
};

const storage = createWebStorage();

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: { payload: { user: User; token: string } }) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

export const { setAuth, clearAuth } = authSlice.actions;

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [accountsApi.reducerPath]: accountsApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware, accountsApi.middleware, transactionsApi.middleware, categoriesApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;