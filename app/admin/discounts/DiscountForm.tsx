'use client'

import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Typography from '@/components/ui/Typography'
import AdminDropdown from '@/components/admin/forms/AdminDropdown'
import { useCreateDiscountMutation, useUpdateDiscountMutation } from '@/lib/features/api/adminApi'
import type { Discount, DiscountInsert, DiscountUpdate } from '@/types/index'

type DiscountFormValues = {
  code: string
  discount_type: 'percent' | 'flat'
  discounted_amount: number
  min_amount: number | null
  usage_limit: number | null
  valid_until: string
  is_active: boolean
}

type DiscountFormProps = {
  initialData?: Discount
  onSuccess?: () => void
}

function toDateTimeLocal(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

export default function DiscountForm({ initialData, onSuccess }: DiscountFormProps) {
  const [createDiscount, { isLoading: isCreating }] = useCreateDiscountMutation()
  const [updateDiscount, { isLoading: isUpdating }] = useUpdateDiscountMutation()
  const isEditing = Boolean(initialData)

  const defaultValues = useMemo<DiscountFormValues>(
    () => ({
      code: initialData?.code ?? '',
      discount_type: (initialData?.discount_type as 'percent' | 'flat') ?? 'percent',
      discounted_amount: Number(initialData?.discounted_amount ?? 0),
      min_amount: initialData?.min_amount === null || initialData?.min_amount === undefined
        ? null
        : Number(initialData.min_amount),
      usage_limit: initialData?.usage_limit ?? null,
      valid_until: toDateTimeLocal(initialData?.valid_until ?? null),
      is_active: initialData?.is_active ?? true,
    }),
    [initialData],
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiscountFormValues>({ defaultValues })

  const onSubmit = async (values: DiscountFormValues) => {
    const payload: DiscountInsert | DiscountUpdate = {
      code: values.code.trim().toUpperCase(),
      discount_type: values.discount_type,
      discounted_amount: values.discounted_amount,
      min_amount: values.min_amount,
      usage_limit: values.usage_limit,
      valid_until: new Date(values.valid_until).toISOString(),
      is_active: values.is_active,
    }

    const result = isEditing && initialData
      ? await updateDiscount({ id: initialData.id, data: payload as DiscountUpdate })
      : await createDiscount(payload as DiscountInsert)

    if ('error' in result) {
      const message =
        typeof result.error === 'object' && result.error !== null && 'message' in result.error
          ? String(result.error.message)
          : isEditing
            ? 'Failed to update discount'
            : 'Failed to create discount'

      toast.error(message)
      return
    }

    toast.success(isEditing ? 'Discount updated successfully' : 'Discount created successfully')
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid max-w-4xl gap-5">
      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="code">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Code</Typography>
          </label>
          <input
            id="code"
            type="text"
            placeholder="E.g. TIX50"
            className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default"
            {...register('code', {
              required: 'Code is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
            })}
          />
          {errors.code ? <Typography variant="body-small" color="sweet-red">{errors.code.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="discount_type">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Discount Type</Typography>
          </label>
          <Controller
            name="discount_type"
            control={control}
            rules={{ required: 'Discount type is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Discount Type"
                value={field.value}
                onChange={(value) => field.onChange(value as 'percent' | 'flat')}
                options={[
                  { value: 'percent', label: 'Percentage' },
                  { value: 'flat', label: 'Nominal' },
                ]}
              />
            )}
          />
          {errors.discount_type ? <Typography variant="body-small" color="sweet-red">{errors.discount_type.message}</Typography> : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="discounted_amount">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Discount Amount</Typography>
          </label>
          <input
            id="discounted_amount"
            type="number"
            step="0.01"
            className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default"
            {...register('discounted_amount', {
              required: 'Discount amount is required',
              min: { value: 0.01, message: 'Must be greater than 0' },
              valueAsNumber: true,
            })}
          />
          {errors.discounted_amount ? <Typography variant="body-small" color="sweet-red">{errors.discounted_amount.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="min_amount">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Minimum Amount (optional)</Typography>
          </label>
          <input
            id="min_amount"
            type="number"
            step="0.01"
            className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default"
            {...register('min_amount', {
              setValueAs: (value) => value === '' ? null : Number(value),
              min: { value: 0, message: 'Cannot be negative' },
            })}
          />
          {errors.min_amount ? <Typography variant="body-small" color="sweet-red">{errors.min_amount.message}</Typography> : null}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="usage_limit">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Usage Limit (optional)</Typography>
          </label>
          <input
            id="usage_limit"
            type="number"
            className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default"
            {...register('usage_limit', {
              setValueAs: (value) => value === '' ? null : Number(value),
              min: { value: 1, message: 'Minimum is 1' },
              validate: (value) => value === null || Number.isInteger(value) || 'Must be an integer',
            })}
          />
          {errors.usage_limit ? <Typography variant="body-small" color="sweet-red">{errors.usage_limit.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="valid_until">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Valid Until</Typography>
          </label>
          <input
            id="valid_until"
            type="datetime-local"
            className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default"
            {...register('valid_until', { required: 'Valid until is required' })}
          />
          {errors.valid_until ? <Typography variant="body-small" color="sweet-red">{errors.valid_until.message}</Typography> : null}
        </div>
      </div>

      <label className="inline-flex items-center gap-2 rounded-lg border border-shade-300 px-4 py-3">
        <input type="checkbox" className="size-4 accent-royal-blue-default" {...register('is_active')} />
        <Typography variant="body-default" color="shade-800" className="font-medium">Discount is active</Typography>
      </label>

      <button
        type="submit"
        disabled={isCreating || isUpdating}
        className="inline-flex w-fit items-center justify-center rounded-lg bg-royal-blue-default px-6 py-3 text-white transition hover:bg-royal-blue-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Typography as="span" variant="body-default" color="white" className="font-medium">
          {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Update Discount' : 'Create Discount'}
        </Typography>
      </button>
    </form>
  )
}
