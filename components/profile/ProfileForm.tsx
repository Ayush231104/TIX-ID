'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useGetProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation } from '@/lib/features/api/profileApi'
import Typography from '@/components/ui/Typography'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profile']['Row']

type ProfileFormValues = {
  first_name: string | null
  last_name: string | null
  email: string | null
  mobile_no: string | null
  age: number | null
  address: string | null
}

export default function ProfileForm() {
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation()
  const [uploadAvatarMutation, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      first_name: null,
      last_name: null,
      email: null,
      mobile_no: null,
      age: null,
      address: null,
    },
  })

  // Set form defaults when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        mobile_no: profile.mobile_no || '',
        age: profile.age || null,
        address: profile.address || '',
      })

      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url)
      }
    }
  }, [profile, reset])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validMimes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Show local preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload avatar
    setSelectedFile(file)
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const result = await uploadAvatarMutation(formData).unwrap()
      toast.success('Avatar uploaded successfully')
      setSelectedFile(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar'
      toast.error(errorMessage)
    }
  }

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updateData = {
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        mobile_no: data.mobile_no || null,
        age: data.age || null,
        address: data.address || null,
      }

      await updateProfile(updateData).unwrap()
      toast.success('Profile updated successfully')
      reset(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      toast.error(errorMessage)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Typography color="shade-600">Loading profile...</Typography>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center py-12">
        <Typography color="sweet-red">Failed to load profile</Typography>
      </div>
    )
  }

  const isSubmitting = isUpdatingProfile || isUploadingAvatar

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div
          onClick={handleAvatarClick}
          className="relative size-32 cursor-pointer overflow-hidden rounded-full border-2 border-shade-300 hover:border-royal-blue-default transition-colors"
        >
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Profile"
              fill
              className="object-cover"
              onError={() => setAvatarPreview(null)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#F5F6F8]">
              <Typography variant="h1" color="shade-400">
                {profile?.first_name?.charAt(0).toUpperCase() || 'U'}
              </Typography>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploadingAvatar}
        />

        <div className="text-center">
          <Typography variant="body-default" color="shade-600" className="mb-1">
            Click the circle to upload a new avatar
          </Typography>
          {isUploadingAvatar && (
            <Typography variant="body-small" color="sky-blue">
              Uploading avatar...
            </Typography>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* First Name & Last Name */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block mb-2">
              <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
                First Name
              </Typography>
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="Enter first name"
              {...register('first_name', {
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'First name must be less than 50 characters',
                },
              })}
              className="w-full rounded-lg border border-shade-300 px-4 py-3 text-shade-900 placeholder-shade-400 focus:border-royal-blue-default focus:outline-none transition-colors"
            />
            {errors.first_name && (
              <Typography variant="body-small" color="sweet-red" className="mt-1">
                {errors.first_name.message}
              </Typography>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block mb-2">
              <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
                Last Name
              </Typography>
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="Enter last name"
              {...register('last_name', {
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Last name must be less than 50 characters',
                },
              })}
              className="w-full rounded-lg border border-shade-300 px-4 py-3 text-shade-900 placeholder-shade-400 focus:border-royal-blue-default focus:outline-none transition-colors"
            />
            {errors.last_name && (
              <Typography variant="body-small" color="sweet-red" className="mt-1">
                {errors.last_name.message}
              </Typography>
            )}
          </div>
        </div>

        {/* Email (Disabled) */}
        <div>
          <label htmlFor="email" className="block mb-2">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
              Email
            </Typography>
          </label>
          <input
            id="email"
            type="email"
            disabled
            {...register('email')}
            className="w-full rounded-lg border border-shade-300 px-4 py-3 text-shade-600 bg-shade-100 cursor-not-allowed"
          />
          <Typography variant="body-small" color="shade-600" className="mt-1">
            Email cannot be changed. Contact support to update.
          </Typography>
        </div>

        {/* Mobile Number & Age */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="mobile_no" className="block mb-2">
              <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
                Mobile Number
              </Typography>
            </label>
            <input
              id="mobile_no"
              type="tel"
              placeholder="Enter mobile number"
              {...register('mobile_no', {
                pattern: {
                  value: /^\d{10,}$/,
                  message: 'Mobile number must be at least 10 digits',
                },
              })}
              className="w-full rounded-lg border border-shade-300 px-4 py-3 text-shade-900 placeholder-shade-400 focus:border-royal-blue-default focus:outline-none transition-colors"
            />
            {errors.mobile_no && (
              <Typography variant="body-small" color="sweet-red" className="mt-1">
                {errors.mobile_no.message}
              </Typography>
            )}
          </div>

          <div>
            <label htmlFor="age" className="block mb-2">
              <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
                Age
              </Typography>
            </label>
            <input
              id="age"
              type="number"
              placeholder="Enter age"
              {...register('age', {
                min: {
                  value: 13,
                  message: 'Age must be at least 13',
                },
                max: {
                  value: 120,
                  message: 'Age must be less than or equal to 120',
                },
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-shade-300 px-4 py-3 text-shade-900 placeholder-shade-400 focus:border-royal-blue-default focus:outline-none transition-colors"
            />
            {errors.age && (
              <Typography variant="body-small" color="sweet-red" className="mt-1">
                {errors.age.message}
              </Typography>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block mb-2">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
              Address
            </Typography>
          </label>
          <textarea
            id="address"
            placeholder="Enter your address"
            rows={3}
            {...register('address', {
              maxLength: {
                value: 200,
                message: 'Address must be less than 200 characters',
              },
            })}
            className="w-full rounded-lg border border-shade-300 px-4 py-3 text-shade-900 placeholder-shade-400 focus:border-royal-blue-default focus:outline-none transition-colors resize-none"
          />
          {errors.address && (
            <Typography variant="body-small" color="sweet-red" className="mt-1">
              {errors.address.message}
            </Typography>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="w-full md:w-fit inline-flex items-center justify-center rounded-lg bg-royal-blue-default px-6 py-3 text-white transition hover:bg-royal-blue-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Typography as="span" variant="body-default" color="white" className="font-medium">
          {isSubmitting ? 'Saving...' : 'Update Profile'}
        </Typography>
      </button>
    </form>
  )
}
