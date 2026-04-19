import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './features/slice/newsSlice';
import moviesReducer from './features/slice/moviesSlice';
import bookingReducer from './features/slice/bookingSlice';
import authReducer from './features/slice/authSlice';
import { newsApi } from './features/api/newsApi';
import { moviesApi } from './features/api/moviesApi';
import { bookingApi } from './features/api/bookingApi';
import { adminApi } from '@/lib/features/api/adminApi';
import { profileApi } from './features/api/profileApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      news: newsReducer,
      movies: moviesReducer,
      booking: bookingReducer,
      auth: authReducer,

      [newsApi.reducerPath]: newsApi.reducer,
      [moviesApi.reducerPath]: moviesApi.reducer,
      [bookingApi.reducerPath]: bookingApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, 
      })
      .concat(newsApi.middleware)
      .concat(moviesApi.middleware)
      .concat(bookingApi.middleware)
      .concat(adminApi.middleware)
      .concat(profileApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];