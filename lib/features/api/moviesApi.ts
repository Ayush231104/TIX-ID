import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getMoviesListAction } from '@/actions/movieActions';
import type { Movie, MovieStatus, GenreType } from '@/types/index';

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getMoviesList: builder.query<Movie[], { limit?: number; status?: MovieStatus | 'upcoming'; genre?: GenreType; searchQuery?: string }>({
      queryFn: async (args) => {
        try {
          const result = await getMoviesListAction(args);
          if (!result.success) return { error: { message: result.error } };
          return { data: result.data as Movie[] };
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } };
          return { error: { message: 'An unexpected error occurred' } };
        }
      },
    }),
  }),
});

export const { useGetMoviesListQuery } = moviesApi;