'use client'

import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Typography from '@/components/ui/Typography'
import AdminDropdown from '@/components/admin/forms/AdminDropdown'
import {
  useCreateScreenMutation,
  useGetAdminTheatersQuery,
  useUpdateScreenMutation,
} from '@/lib/features/api/adminApi'
import type { Screen, ScreenInsert, ScreenUpdate } from '@/types/index'

type ScreenFormValues = {
  theater_id: string
  name: string
  type: string
  seat_row: string
  seat_col: string
}

type ScreenFormProps = {
  initialData?: Screen
  onSuccess?: () => void
}

export default function ScreenForm({ initialData, onSuccess }: ScreenFormProps) {
  const { data: theaters = [] } = useGetAdminTheatersQuery()
  const [createScreen, { isLoading: isCreating }] = useCreateScreenMutation()
  const [updateScreen, { isLoading: isUpdating }] = useUpdateScreenMutation()

  const defaultValues = useMemo<ScreenFormValues>(() => ({
    theater_id: initialData?.theater_id ?? '',
    name: initialData?.name ?? '',
    type: initialData?.type ?? '',
    seat_row: initialData?.seat_row?.toString() ?? '',
    seat_col: initialData?.seat_col?.toString() ?? '',
  }), [initialData])

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScreenFormValues>({ defaultValues })

  const seatRowValue = watch('seat_row')
  const seatColValue = watch('seat_col')
  const isEditing = Boolean(initialData)

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const totalSeats = useMemo(() => {
    const rows = Number(seatRowValue || 0)
    const cols = Number(seatColValue || 0)
    return rows * cols
  }, [seatRowValue, seatColValue])

  const onSubmit = async (values: ScreenFormValues) => {
    const payload: ScreenInsert | ScreenUpdate = {
      theater_id: values.theater_id,
      name: values.name.trim(),
      type: values.type.trim(),
      seat_row: Number(values.seat_row),
      seat_col: Number(values.seat_col),
      total_seats: Number(values.seat_row) * Number(values.seat_col),
    }

    const result = isEditing && initialData
      ? await updateScreen({ id: initialData.id, data: payload as ScreenUpdate })
      : await createScreen(payload as ScreenInsert)

    if ('error' in result) {
      const errorMessage =
        typeof result.error === 'object' && result.error !== null && 'message' in result.error
          ? String(result.error.message)
          : isEditing ? 'Failed to update screen' : 'Failed to create screen'

      toast.error(errorMessage)
      return
    }

    toast.success(isEditing ? 'Screen updated successfully' : 'Screen added successfully')
    reset(defaultValues)
    onSuccess?.()
  }

  const isSubmitting = isCreating || isUpdating

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid max-w-4xl gap-5">
      <div className="grid gap-2">
        <label htmlFor="theater_id">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Theater</Typography>
        </label>
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

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="name"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Screen Name</Typography></label>
          <input id="name" type="text" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('name', { required: 'Screen name is required' })} />
          {errors.name ? <Typography variant="body-small" color="sweet-red">{errors.name.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="type"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Screen Type</Typography></label>
          <input id="type" type="text" placeholder="e.g. IMAX, 2D, 3D" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('type', { required: 'Screen type is required' })} />
          {errors.type ? <Typography variant="body-small" color="sweet-red">{errors.type.message}</Typography> : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="seat_row"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Seat Rows</Typography></label>
          <input id="seat_row" type="number" min="1" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('seat_row', { required: 'Seat rows is required' })} />
          {errors.seat_row ? <Typography variant="body-small" color="sweet-red">{errors.seat_row.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="seat_col"><Typography as="span" variant="body-default" color="shade-800" className="font-medium">Seat Columns</Typography></label>
          <input id="seat_col" type="number" min="1" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('seat_col', { required: 'Seat columns is required' })} />
          {errors.seat_col ? <Typography variant="body-small" color="sweet-red">{errors.seat_col.message}</Typography> : null}
        </div>
      </div>

      <div className="rounded-lg border border-shade-200 bg-shade-100 px-4 py-3">
        <Typography variant="body-default" color="shade-700">
          Total Seats: {totalSeats}
        </Typography>
      </div>

      <button type="submit" disabled={isSubmitting} className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-royal-blue-default px-6 py-3 text-white transition hover:bg-royal-blue-hover disabled:cursor-not-allowed disabled:opacity-60 md:w-fit">
        <Typography as="span" variant="body-default" color="white" className="font-medium">{isSubmitting ? 'Saving...' : isEditing ? 'Update Screen' : 'Add Screen'}</Typography>
      </button>
    </form>
  )
}
