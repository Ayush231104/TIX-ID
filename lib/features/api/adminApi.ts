import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  type AdminScreenListItem,
  type AdminShowtimeListItem,
  type AdminTheaterListItem,
  deleteMovie,
  deleteNews,
  deleteScreen,
  deleteShowtime,
  deleteTheater,
  createNews,
  createScreen,
  createTheater,
  createMovie,
  createShowtime,
  getAdminBrands,
  getAdminCities,
  getAdminMovieById,
  getAdminMovies,
  getAdminNews,
  getAdminNewsById,
  getAdminRole,
  getAdminScreenById,
  getAdminScreensWithDetails,
  getAdminShowtimeById,
  getAdminShowtimesWithDetails,
  getAdminTheaterById,
  getAdminTheaters,
  getAdminTheatersWithDetails,
  getScreensByTheater,
  updateMovie,
  updateNews,
  updateScreen,
  updateShowtime,
  updateTheater,
} from '@/actions/adminActions'
import type {
  Brand,
  City,
  Movie,
  MovieInsert,
  MovieUpdate,
  News,
  NewsInsert,
  NewsUpdate,
  Screen,
  ScreenInsert,
  ScreenUpdate,
  Showtime,
  ShowtimeInsert,
  ShowtimeUpdate,
  Theater,
  TheaterInsert,
  TheaterUpdate,
  UserRole,
} from '@/types/index'

type AdminRole = Extract<UserRole, 'super_admin' | 'theater_admin'>

type RtkQueryError = {
  message: string
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fakeBaseQuery<RtkQueryError>(),
  tagTypes: [
    'AdminMovies',
    'AdminShowtimes',
    'AdminTheaters',
    'AdminScreens',
    'AdminRole',
    'AdminBrands',
    'AdminCities',
    'AdminNews',
  ],
  endpoints: (builder) => ({
    getAdminRole: builder.query<AdminRole, void>({
      queryFn: async () => {
        try {
          const result = await getAdminRole()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch admin role' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminRole'],
    }),

    getAdminMovies: builder.query<Movie[], void>({
      queryFn: async () => {
        try {
          const result = await getAdminMovies()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch movies' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminMovies'],
    }),

    getAdminMovieById: builder.query<Movie, string>({
      queryFn: async (id) => {
        try {
          const result = await getAdminMovieById(id)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch movie details' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: (result, error, id) => [{ type: 'AdminMovies', id }],
    }),

    getAdminNews: builder.query<News[], void>({
      queryFn: async () => {
        try {
          const result = await getAdminNews()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch news' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminNews'],
    }),

    getAdminNewsById: builder.query<News, string>({
      queryFn: async (id) => {
        try {
          const result = await getAdminNewsById(id)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch news details' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: (result, error, id) => [{ type: 'AdminNews', id }],
    }),

    getAdminTheaters: builder.query<Theater[], void>({
      queryFn: async () => {
        try {
          const result = await getAdminTheaters()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch theaters' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminTheaters'],
    }),

    getAdminTheatersWithDetails: builder.query<AdminTheaterListItem[], void>({
      queryFn: async () => {
        try {
          const result = await getAdminTheatersWithDetails()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch theaters' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminTheaters'],
    }),

    getAdminTheaterById: builder.query<Theater, string>({
      queryFn: async (id) => {
        try {
          const result = await getAdminTheaterById(id)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch theater details' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: (result, error, id) => [{ type: 'AdminTheaters', id }],
    }),

    getAdminBrands: builder.query<Brand[], void>({
      queryFn: async () => {
        try {
          const result = await getAdminBrands()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch brands' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminBrands'],
    }),

    getAdminCities: builder.query<City[], void>({
      queryFn: async () => {
        try {
          const result = await getAdminCities()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch cities' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminCities'],
    }),

    getScreensByTheater: builder.query<Screen[], string>({
      queryFn: async (theaterId) => {
        try {
          const result = await getScreensByTheater(theaterId)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch screens' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: (result) =>
        result
          ? [
              'AdminScreens',
              ...result.map((screen) => ({ type: 'AdminScreens' as const, id: screen.id })),
            ]
          : ['AdminScreens'],
    }),

    getAdminScreensWithDetails: builder.query<AdminScreenListItem[], void>({
      queryFn: async () => {
        try {
          const result = await getAdminScreensWithDetails()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch screens' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminScreens'],
    }),

    getAdminScreenById: builder.query<Screen, string>({
      queryFn: async (id) => {
        try {
          const result = await getAdminScreenById(id)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch screen details' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: (result, error, id) => [{ type: 'AdminScreens', id }],
    }),

    getAdminShowtimesWithDetails: builder.query<AdminShowtimeListItem[], void>({
      queryFn: async () => {
        try {
          const result = await getAdminShowtimesWithDetails()
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch showtimes' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['AdminShowtimes'],
    }),

    getAdminShowtimeById: builder.query<Showtime, string>({
      queryFn: async (id) => {
        try {
          const result = await getAdminShowtimeById(id)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to fetch showtime details' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: (result, error, id) => [{ type: 'AdminShowtimes', id }],
    }),

    createMovie: builder.mutation<Movie, MovieInsert>({
      queryFn: async (payload) => {
        try {
          const result = await createMovie(payload)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to create movie' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: ['AdminMovies'],
    }),

    updateMovie: builder.mutation<Movie, { id: string; data: MovieUpdate }>({
      queryFn: async ({ id, data }) => {
        try {
          const result = await updateMovie(id, data)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to update movie' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminMovies', id },
        'AdminMovies',
        'AdminShowtimes',
      ],
    }),

    deleteMovie: builder.mutation<null, string>({
      queryFn: async (id) => {
        try {
          const result = await deleteMovie(id)
          if (!result.success) {
            return { error: { message: result.error ?? 'Failed to delete movie' } }
          }
          return { data: null }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'AdminMovies', id },
        'AdminMovies',
        'AdminShowtimes',
      ],
    }),

    createNews: builder.mutation<News, NewsInsert>({
      queryFn: async (payload) => {
        try {
          const result = await createNews(payload)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to create news' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: ['AdminNews'],
    }),

    updateNews: builder.mutation<News, { id: string; data: NewsUpdate }>({
      queryFn: async ({ id, data }) => {
        try {
          const result = await updateNews(id, data)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to update news' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'AdminNews', id }, 'AdminNews'],
    }),

    deleteNews: builder.mutation<null, string>({
      queryFn: async (id) => {
        try {
          const result = await deleteNews(id)
          if (!result.success) {
            return { error: { message: result.error ?? 'Failed to delete news' } }
          }
          return { data: null }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'AdminNews', id }, 'AdminNews'],
    }),

    createTheater: builder.mutation<Theater, TheaterInsert>({
      queryFn: async (payload) => {
        try {
          const result = await createTheater(payload)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to create theater' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: ['AdminTheaters'],
    }),

    updateTheater: builder.mutation<Theater, { id: string; data: TheaterUpdate }>({
      queryFn: async ({ id, data }) => {
        try {
          const result = await updateTheater(id, data)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to update theater' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminTheaters', id },
        'AdminTheaters',
        'AdminScreens',
        'AdminShowtimes',
      ],
    }),

    deleteTheater: builder.mutation<null, string>({
      queryFn: async (id) => {
        try {
          const result = await deleteTheater(id)
          if (!result.success) {
            return { error: { message: result.error ?? 'Failed to delete theater' } }
          }
          return { data: null }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'AdminTheaters', id },
        'AdminTheaters',
        'AdminScreens',
        'AdminShowtimes',
      ],
    }),

    createScreen: builder.mutation<Screen, ScreenInsert>({
      queryFn: async (payload) => {
        try {
          const result = await createScreen(payload)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to create screen' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: ['AdminScreens'],
    }),

    updateScreen: builder.mutation<Screen, { id: string; data: ScreenUpdate }>({
      queryFn: async ({ id, data }) => {
        try {
          const result = await updateScreen(id, data)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to update screen' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'AdminScreens', id }, 'AdminScreens', 'AdminShowtimes'],
    }),

    deleteScreen: builder.mutation<null, string>({
      queryFn: async (id) => {
        try {
          const result = await deleteScreen(id)
          if (!result.success) {
            return { error: { message: result.error ?? 'Failed to delete screen' } }
          }
          return { data: null }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'AdminScreens', id }, 'AdminScreens', 'AdminShowtimes'],
    }),

    createShowtime: builder.mutation<Showtime, ShowtimeInsert>({
      queryFn: async (payload) => {
        try {
          const result = await createShowtime(payload)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to create showtime' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: ['AdminShowtimes'],
    }),

    updateShowtime: builder.mutation<Showtime, { id: string; data: ShowtimeUpdate }>({
      queryFn: async ({ id, data }) => {
        try {
          const result = await updateShowtime(id, data)
          if (!result.success || !result.data) {
            return { error: { message: result.error ?? 'Failed to update showtime' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'AdminShowtimes', id }, 'AdminShowtimes'],
    }),

    deleteShowtime: builder.mutation<null, string>({
      queryFn: async (id) => {
        try {
          const result = await deleteShowtime(id)
          if (!result.success) {
            return { error: { message: result.error ?? 'Failed to delete showtime' } }
          }
          return { data: null }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'AdminShowtimes', id }, 'AdminShowtimes'],
    }),
  }),
})

export const {
  useGetAdminRoleQuery,
  useGetAdminMoviesQuery,
  useGetAdminMovieByIdQuery,
  useGetAdminNewsQuery,
  useGetAdminNewsByIdQuery,
  useGetAdminTheatersQuery,
  useGetAdminTheatersWithDetailsQuery,
  useGetAdminTheaterByIdQuery,
  useGetAdminBrandsQuery,
  useGetAdminCitiesQuery,
  useGetScreensByTheaterQuery,
  useGetAdminScreensWithDetailsQuery,
  useGetAdminScreenByIdQuery,
  useGetAdminShowtimesWithDetailsQuery,
  useGetAdminShowtimeByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useCreateTheaterMutation,
  useUpdateTheaterMutation,
  useDeleteTheaterMutation,
  useCreateScreenMutation,
  useUpdateScreenMutation,
  useDeleteScreenMutation,
  useCreateShowtimeMutation,
  useUpdateShowtimeMutation,
  useDeleteShowtimeMutation,
} = adminApi
