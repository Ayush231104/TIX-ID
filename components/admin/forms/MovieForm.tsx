'use client'

import Image from 'next/image'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Typography from '@/components/ui/Typography'
import AdminDropdown from '@/components/admin/forms/AdminDropdown'
import { useCreateMovieMutation, useUpdateMovieMutation } from '@/lib/features/api/adminApi'
import type { AgeRating, GenreType, Movie, MovieInsert, MovieUpdate } from '@/types/index'
import { Constants } from '@/types/supabase'
import { createClient } from '@/utils/supabase/client'

type MovieFormValues = {
  name: string
  director: string
  duration_hour: string
  duration_minute: string
  age_rating: AgeRating
  genre: GenreType
}

type SubmitErrorKind = 'upload' | 'permission' | 'validation' | 'unknown'

type SubmitErrorState = {
  kind: SubmitErrorKind
  message: string
}

type MovieFormProps = {
  initialData?: Movie
  onSuccess?: () => void
}

function parseDuration(duration: string | null): { duration_hour: string; duration_minute: string } {
  if (!duration) {
    return { duration_hour: '', duration_minute: '' }
  }

  const normalized = duration.split('+')[0].split('-')[0]
  const [hour = '', minute = ''] = normalized.split(':')

  return {
    duration_hour: hour.padStart(2, '0').slice(0, 2),
    duration_minute: minute.padStart(2, '0').slice(0, 2),
  }
}

function getStorageObjectPathFromPublicUrl(publicUrl: string, expectedBucket: string): string | null {
  try {
    const parsed = new URL(publicUrl)
    const marker = '/storage/v1/object/public/'
    const markerIndex = parsed.pathname.indexOf(marker)

    if (markerIndex < 0) {
      return null
    }

    const fullObjectPath = parsed.pathname.slice(markerIndex + marker.length)
    const [bucket, ...rest] = fullObjectPath.split('/')

    if (!bucket || bucket !== expectedBucket || rest.length === 0) {
      return null
    }

    return decodeURIComponent(rest.join('/'))
  } catch {
    return null
  }
}

export default function MovieForm({ initialData, onSuccess }: MovieFormProps) {
  const [createMovie, { isLoading: isCreating }] = useCreateMovieMutation()
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [blobPreviewUrl, setBlobPreviewUrl] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<SubmitErrorState | null>(null)

  const supabase = createClient()
  const isEditing = Boolean(initialData)

  const defaultValues = useMemo<MovieFormValues>(() => {
    const parsedDuration = parseDuration(initialData?.duration ?? null)

    return {
      name: initialData?.name ?? '',
      director: initialData?.director ?? '',
      duration_hour: parsedDuration.duration_hour,
      duration_minute: parsedDuration.duration_minute,
      age_rating: (initialData?.age_rating as MovieFormValues['age_rating']) ?? 'U',
      genre: ((initialData?.genre?.toLowerCase() as MovieFormValues['genre']) ?? 'action'),
    }
  }, [initialData])

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovieFormValues>({ defaultValues })

  useEffect(() => {
    reset(defaultValues)
    setSelectedImage(null)

    if (blobPreviewUrl) {
      URL.revokeObjectURL(blobPreviewUrl)
      setBlobPreviewUrl(null)
    }
  }, [defaultValues, reset])

  useEffect(() => {
    return () => {
      if (blobPreviewUrl) {
        URL.revokeObjectURL(blobPreviewUrl)
      }
    }
  }, [blobPreviewUrl])

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSubmitError(null)

    if (blobPreviewUrl) {
      URL.revokeObjectURL(blobPreviewUrl)
    }

    if (!file) {
      setSelectedImage(null)
      setBlobPreviewUrl(null)
      return
    }

    setSelectedImage(file)
    setBlobPreviewUrl(URL.createObjectURL(file))
  }

  const onSubmit = async (values: MovieFormValues) => {
    setSubmitError(null)
    const existingImageUrl = initialData?.movie_img ?? null
    let movieImageUrl: string | null = existingImageUrl

    if (selectedImage) {
      if (existingImageUrl) {
        const oldObjectPath = getStorageObjectPathFromPublicUrl(existingImageUrl, 'movies_imgs')
        if (oldObjectPath) {
          const { error: removeError } = await supabase.storage.from('movies_imgs').remove([oldObjectPath])
          if (removeError) {
            setSubmitError({ kind: 'upload', message: removeError.message })
            toast.error(removeError.message)
            return
          }
        }
      }

      const rawExt = selectedImage.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const safeExt = rawExt.replace(/[^a-z0-9]/g, '') || 'jpg'
      const filePath = `movies/${crypto.randomUUID()}.${safeExt}`

      const { error: uploadError } = await supabase.storage
        .from('movies_imgs')
        .upload(filePath, selectedImage, { upsert: false })

      if (uploadError) {
        setSubmitError({ kind: 'upload', message: uploadError.message })
        toast.error(uploadError.message)
        return
      }

      const { data: publicData } = supabase.storage.from('movies_imgs').getPublicUrl(filePath)
      movieImageUrl = publicData.publicUrl
    }

    const payload: MovieInsert | MovieUpdate = {
      name: values.name.trim(),
      director: values.director.trim(),
      duration: `${values.duration_hour}:${values.duration_minute}:00+00`,
      age_rating: values.age_rating,
      genre: values.genre,
      movie_img: movieImageUrl,
      ...(isEditing ? {} : { movies_status: 'upcoming', audience_score: null }),
    }

    const result = isEditing && initialData
      ? await updateMovie({ id: initialData.id, data: payload as MovieUpdate })
      : await createMovie(payload as MovieInsert)

    if ('error' in result) {
      const errorMessage =
        typeof result.error === 'object' && result.error !== null && 'message' in result.error
          ? String(result.error.message)
          : isEditing ? 'Failed to update movie' : 'Failed to create movie'

      const lowerError = errorMessage.toLowerCase()
      const isPermissionError =
        lowerError.includes('row-level security') ||
        lowerError.includes('permission denied') ||
        lowerError.includes('not allowed')
      const isValidationError =
        lowerError.includes('invalid input syntax') ||
        lowerError.includes('violates') ||
        lowerError.includes('check constraint')

      if (isPermissionError) {
        setSubmitError({ kind: 'permission', message: errorMessage })
      } else if (isValidationError) {
        setSubmitError({ kind: 'validation', message: errorMessage })
      } else {
        setSubmitError({ kind: 'unknown', message: errorMessage })
      }

      toast.error(errorMessage)
      return
    }

    toast.success(isEditing ? 'Movie updated successfully' : 'Movie added successfully')
    setSelectedImage(null)
    if (blobPreviewUrl) {
      URL.revokeObjectURL(blobPreviewUrl)
      setBlobPreviewUrl(null)
    }
    setSubmitError(null)
    reset(defaultValues)
    onSuccess?.()
  }

  const bannerTitleByKind: Record<SubmitErrorKind, string> = {
    upload: 'Image Upload Error',
    permission: 'Permission Error',
    validation: 'Validation Error',
    unknown: 'Submission Error',
  }

  const previewUrl = blobPreviewUrl ?? initialData?.movie_img ?? null
  const isSubmitting = isCreating || isUpdating

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid max-w-3xl gap-5">
      {submitError ? (
        <div className="rounded-lg border border-sweet-red/40 bg-sweet-red/10 px-4 py-3">
          <Typography variant="body-default" color="sweet-red" className="font-medium">
            {bannerTitleByKind[submitError.kind]}
          </Typography>
          <Typography variant="body-small" color="shade-700" className="mt-1">
            {submitError.message}
          </Typography>
        </div>
      ) : null}

      <div className="grid gap-2">
        <label htmlFor="name">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
            Movie Name
          </Typography>
        </label>
        <input id="name" type="text" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('name', { required: 'Movie name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })} />
        {errors.name ? <Typography variant="body-small" color="sweet-red">{errors.name.message}</Typography> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="director">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
            Director
          </Typography>
        </label>
        <input id="director" type="text" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('director', { required: 'Director is required', minLength: { value: 2, message: 'Minimum 2 characters' } })} />
        {errors.director ? <Typography variant="body-small" color="sweet-red">{errors.director.message}</Typography> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="duration_hour">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
            Duration
          </Typography>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="duration_hour"
            control={control}
            rules={{ required: 'Hour is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Hour"
                placeholder="Hour"
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue)}
                optionsMaxHeightClass="max-h-60"
                options={Array.from({ length: 24 }, (_, index) => {
                  const hour = String(index).padStart(2, '0')
                  return { label: hour, value: hour }
                })}
              />
            )}
          />

          <Controller
            name="duration_minute"
            control={control}
            rules={{ required: 'Minute is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Minute"
                placeholder="Minute"
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue)}
                optionsMaxHeightClass="max-h-60"
                options={Array.from({ length: 60 }, (_, index) => {
                  const minute = String(index).padStart(2, '0')
                  return { label: minute, value: minute }
                })}
              />
            )}
          />
        </div>
        {errors.duration_hour ? <Typography variant="body-small" color="sweet-red">{errors.duration_hour.message}</Typography> : null}
        {!errors.duration_hour && errors.duration_minute ? <Typography variant="body-small" color="sweet-red">{errors.duration_minute.message}</Typography> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="movie_img">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
            Movie Image
          </Typography>
        </label>
        <input
          id="movie_img"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleImageChange}
          className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 file:mr-4 file:rounded-md file:border-0 file:bg-royal-blue-default file:px-3 file:py-2 file:text-white"
        />
        <Typography variant="body-small" color="shade-600">
          {selectedImage ? `Selected: ${selectedImage.name}` : previewUrl ? 'Using existing image' : 'No image selected'}
        </Typography>
        {previewUrl ? (
          <div className="relative h-40 w-28 overflow-hidden rounded-lg border border-shade-300">
            <Image src={previewUrl} alt="Selected movie preview" fill className="object-cover" />
          </div>
        ) : null}
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="age_rating">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
              Age Rating
            </Typography>
          </label>
          <Controller
            name="age_rating"
            control={control}
            rules={{ required: 'Age rating is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Age Rating"
                placeholder="Select age rating"
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue as AgeRating)}
                optionsMaxHeightClass="max-h-60"
                options={Constants.public.Enums.age_rating_enum.map((rating) => ({
                  label: rating,
                  value: rating,
                }))}
              />
            )}
          />
          {errors.age_rating ? <Typography variant="body-small" color="sweet-red">{errors.age_rating.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="genre">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
              Genre
            </Typography>
          </label>
          <Controller
            name="genre"
            control={control}
            rules={{ required: 'Genre is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Genre"
                placeholder="Select genre"
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue as GenreType)}
                optionsMaxHeightClass="max-h-60"
                options={Constants.public.Enums.genre_enum.map((genre) => ({
                  label: genre,
                  value: genre,
                }))}
              />
            )}
          />
          {errors.genre ? <Typography variant="body-small" color="sweet-red">{errors.genre.message}</Typography> : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-royal-blue-default px-6 py-3 text-white transition hover:bg-royal-blue-hover disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
      >
        <Typography as="span" variant="body-default" color="white" className="font-medium">
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Movie' : 'Add Movie'}
        </Typography>
      </button>
    </form>
  )
}
