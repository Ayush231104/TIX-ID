'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Typography from '@/components/ui/Typography'
import AdminDropdown from '@/components/admin/forms/AdminDropdown'
import {
  useCreateShowtimeMutation,
  useGetAdminMoviesQuery,
  useGetAdminTheatersQuery,
  useGetScreensByTheaterQuery,
  useUpdateShowtimeMutation,
} from '@/lib/features/api/adminApi'
import type { Showtime, ShowtimeInsert, ShowtimeUpdate } from '@/types/index'

type ShowtimeFormValues = {
  theater_id: string
  screen_id: string
  movie_id: string
  show_time: string
  price: string
}

type ShowtimeFormProps = {
  initialData?: Showtime
  onSuccess?: () => void
}

function toDatetimeLocal(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export default function ShowtimeForm({ initialData, onSuccess }: ShowtimeFormProps) {
  const firstRenderRef = useRef(true)
  const defaultValues = useMemo<ShowtimeFormValues>(() => ({
    theater_id: initialData?.theater_id ?? '',
    screen_id: initialData?.screen_id ?? '',
    movie_id: initialData?.movie_id ?? '',
    show_time: toDatetimeLocal(initialData?.show_time ?? null),
    price: initialData?.price?.toString() ?? '',
  }), [initialData])

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm<ShowtimeFormValues>({ defaultValues })

  const selectedTheaterId = watch('theater_id')
  const { data: theaters = [] } = useGetAdminTheatersQuery()
  const { data: movies = [] } = useGetAdminMoviesQuery()
  const { data: screens = [] } = useGetScreensByTheaterQuery(selectedTheaterId, { skip: !selectedTheaterId })
  const [createShowtime, { isLoading: isCreating }] = useCreateShowtimeMutation()
  const [updateShowtime, { isLoading: isUpdating }] = useUpdateShowtimeMutation()
  const isEditing = Boolean(initialData)

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    resetField('screen_id')
  }, [selectedTheaterId, resetField])

  const onSubmit = async (values: ShowtimeFormValues) => {
    const payload: ShowtimeInsert | ShowtimeUpdate = {
      theater_id: values.theater_id,
      screen_id: values.screen_id,
      movie_id: values.movie_id,
      show_time: new Date(values.show_time).toISOString(),
      price: Number(values.price),
      is_active: true,
    }

    const result = isEditing && initialData
      ? await updateShowtime({ id: initialData.id, data: payload as ShowtimeUpdate })
      : await createShowtime(payload as ShowtimeInsert)

    if ('error' in result) {
      const errorMessage =
        typeof result.error === 'object' && result.error !== null && 'message' in result.error
          ? String(result.error.message)
          : isEditing ? 'Failed to update showtime' : 'Failed to create showtime'

      toast.error(errorMessage)
      return
    }

    toast.success(isEditing ? 'Showtime updated successfully' : 'Showtime added successfully')
    reset(defaultValues)
    onSuccess?.()
  }

  const isSubmitting = isCreating || isUpdating

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid max-w-4xl gap-5">
      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="theater_id"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Theater</Typography></label>
          <Controller
            name="theater_id"
            control={control}
            rules={{ required: 'Theater is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Theater"
                placeholder="Select theater"
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue)}
                optionsMaxHeightClass="max-h-60"
                options={theaters.map((theater) => ({ label: theater.name, value: theater.id }))}
              />
            )}
          />
          {errors.theater_id ? <Typography variant="body-small" color="sweet-red">{errors.theater_id.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="screen_id"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Screen</Typography></label>
          <Controller
            name="screen_id"
            control={control}
            rules={{ required: 'Screen is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Screen"
                placeholder={selectedTheaterId ? 'Select screen' : 'Select theater first'}
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue)}
                optionsMaxHeightClass="max-h-60"
                options={screens.map((screen) => ({ label: screen.name, value: screen.id }))}
                disabled={!selectedTheaterId}
              />
            )}
          />
          {errors.screen_id ? <Typography variant="body-small" color="sweet-red">{errors.screen_id.message}</Typography> : null}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="movie_id"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Movie</Typography></label>
        <Controller
          name="movie_id"
          control={control}
          rules={{ required: 'Movie is required' }}
          render={({ field }) => (
            <AdminDropdown
              title="Movie"
              placeholder="Select movie"
              value={field.value ?? null}
              onSelect={(nextValue) => field.onChange(nextValue)}
              optionsMaxHeightClass="max-h-60"
              options={movies.map((movie) => ({ label: movie.name, value: movie.id }))}
            />
          )}
        />
        {errors.movie_id ? <Typography variant="body-small" color="sweet-red">{errors.movie_id.message}</Typography> : null}
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="show_time"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Show Time</Typography></label>
          <input id="show_time" type="datetime-local" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('show_time', { required: 'Show time is required' })} />
          {errors.show_time ? <Typography variant="body-small" color="sweet-red">{errors.show_time.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="price"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Ticket Price</Typography></label>
          <input id="price" type="number" step="1" min="0" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('price', { required: 'Price is required' })} />
          {errors.price ? <Typography variant="body-small" color="sweet-red">{errors.price.message}</Typography> : null}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-royal-blue-default px-6 py-3 text-white transition hover:bg-royal-blue-hover disabled:cursor-not-allowed disabled:opacity-60 md:w-fit">
        <Typography as="span" variant="body-default" color="white" className="font-medium">{isSubmitting ? 'Saving...' : isEditing ? 'Update Showtime' : 'Add Showtime'}</Typography>
      </button>
    </form>
  )
}
