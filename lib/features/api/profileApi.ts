import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { getProfile, updateProfile, uploadAvatar } from '@/actions/profileActions'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profile']['Row']

type UpdateProfileInput = {
  first_name?: string | null
  last_name?: string | null
  mobile_no?: string | null
  age?: number | null
  address?: string | null
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      queryFn: async () => {
        try {
          const result = await getProfile()
          if (!result.success || !result.data) {
            return { error: { message: result.error || 'Failed to fetch profile' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<Profile, UpdateProfileInput>({
      queryFn: async (input) => {
        try {
          const result = await updateProfile(input)
          if (!result.success || !result.data) {
            return { error: { message: result.error || 'Failed to update profile' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: ['Profile'],
    }),

    uploadAvatar: builder.mutation<string, FormData>({
      queryFn: async (formData) => {
        try {
          const result = await uploadAvatar(formData)
          if (!result.success || !result.data) {
            return { error: { message: result.error || 'Failed to upload avatar' } }
          }
          return { data: result.data }
        } catch (error) {
          if (error instanceof Error) return { error: { message: error.message } }
          return { error: { message: 'An unexpected error occurred' } }
        }
      },
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const { useGetProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation } = profileApi
