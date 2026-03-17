import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './features/news/newsSlice';
import moviesReducer from './features/movies/moviesSlice';
import bookingReducer from './features/booking/bookingSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      news: newsReducer,
      movies: moviesReducer,
      booking: bookingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, 
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];