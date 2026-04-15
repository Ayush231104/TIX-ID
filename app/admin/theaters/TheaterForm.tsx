'use client'

import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Typography from '@/components/ui/Typography'
import AdminDropdown from '@/components/admin/forms/AdminDropdown'
import {
  useCreateTheaterMutation,
  useGetAdminBrandsQuery,
  useGetAdminCitiesQuery,
  useUpdateTheaterMutation,
} from '@/lib/features/api/adminApi'
import type { Theater, TheaterInsert, TheaterUpdate } from '@/types/index'

type TheaterFormValues = {
  name: string
  address: string
  brand_id: string
  city_id: string
  latitude: string
  longitude: string
}

type TheaterFormProps = {
  initialData?: Theater
  onSuccess?: () => void
}

export default function TheaterForm({ initialData, onSuccess }: TheaterFormProps) {
  const { data: brands = [] } = useGetAdminBrandsQuery()
  const { data: cities = [] } = useGetAdminCitiesQuery()

  const [createTheater, { isLoading: isCreating }] = useCreateTheaterMutation()
  const [updateTheater, { isLoading: isUpdating }] = useUpdateTheaterMutation()

  const defaultValues: TheaterFormValues = {
    name: initialData?.name ?? '',
    address: initialData?.address ?? '',
    brand_id: initialData?.brand_id ?? '',
    city_id: initialData?.city_id ?? '',
    latitude: initialData?.latitude?.toString() ?? '',
    longitude: initialData?.longitude?.toString() ?? '',
  }

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TheaterFormValues>({ defaultValues })

  const isEditing = Boolean(initialData)

  const onSubmit = async (values: TheaterFormValues) => {
    const payload: TheaterInsert | TheaterUpdate = {
      name: values.name.trim(),
      address: values.address.trim(),
      brand_id: values.brand_id || null,
      city_id: values.city_id || null,
      latitude: values.latitude ? Number(values.latitude) : null,
      longitude: values.longitude ? Number(values.longitude) : null,
    }

    const result = isEditing && initialData
      ? await updateTheater({ id: initialData.id, data: payload as TheaterUpdate })
      : await createTheater(payload as TheaterInsert)

    if ('error' in result) {
      const errorMessage =
        typeof result.error === 'object' && result.error !== null && 'message' in result.error
          ? String(result.error.message)
          : isEditing ? 'Failed to update theater' : 'Failed to create theater'

      toast.error(errorMessage)
      return
    }

    toast.success(isEditing ? 'Theater updated successfully' : 'Theater added successfully')
    reset(defaultValues)
    onSuccess?.()
  }

  const isSubmitting = isCreating || isUpdating

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid max-w-4xl gap-5">
      <div className="grid gap-2">
        <label htmlFor="name">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
            Theater Name
          </Typography>
        </label>
        <input id="name" type="text" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('name', { required: 'Theater name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })} />
        {errors.name ? <Typography variant="body-small" color="sweet-red">{errors.name.message}</Typography> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="address">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
            Address
          </Typography>
        </label>
        <input id="address" type="text" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('address', { required: 'Address is required' })} />
        {errors.address ? <Typography variant="body-small" color="sweet-red">{errors.address.message}</Typography> : null}
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="brand_id">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
              Brand
            </Typography>
          </label>
          <Controller
            name="brand_id"
            control={control}
            rules={{ required: 'Brand is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Brand"
                placeholder="Select brand"
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue)}
                optionsMaxHeightClass="max-h-60"
                options={brands.map((brand) => ({ label: brand.name, value: brand.id }))}
              />
            )}
          />
          {errors.brand_id ? <Typography variant="body-small" color="sweet-red">{errors.brand_id.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="city_id">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
              City
            </Typography>
          </label>
          <Controller
            name="city_id"
            control={control}
            rules={{ required: 'City is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="City"
                placeholder="Select city"
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue)}
                optionsMaxHeightClass="max-h-60"
                options={cities.map((city) => ({ label: city.name, value: city.id }))}
              />
            )}
          />
          {errors.city_id ? <Typography variant="body-small" color="sweet-red">{errors.city_id.message}</Typography> : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="latitude">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
              Latitude
            </Typography>
          </label>
          <input id="latitude" type="number" step="0.000001" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('latitude')} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="longitude">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">
              Longitude
            </Typography>
          </label>
          <input id="longitude" type="number" step="0.000001" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('longitude')} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-royal-blue-default px-6 py-3 text-white transition hover:bg-royal-blue-hover disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
      >
        <Typography as="span" variant="body-default" color="white" className="font-medium">
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Theater' : 'Add Theater'}
        </Typography>
      </button>
    </form>
  )
}
