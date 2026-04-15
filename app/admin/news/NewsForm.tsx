'use client'

import Image from 'next/image'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Typography from '@/components/ui/Typography'
import AdminDropdown from '@/components/admin/forms/AdminDropdown'
import { useCreateNewsMutation, useUpdateNewsMutation } from '@/lib/features/api/adminApi'
import type { News, NewsInsert, NewsUpdate } from '@/types/index'
import { createClient } from '@/utils/supabase/client'

type NewsFormValues = {
  title: string
  subtitle: string
  category: 'Spotlight' | 'News'
  tag: string
  release_date: string
  content: string
}

type SubmitErrorKind = 'upload' | 'permission' | 'validation' | 'unknown'

type SubmitErrorState = {
  kind: SubmitErrorKind
  message: string
}

type NewsFormProps = {
  initialData?: News
  onSuccess?: () => void
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

export default function NewsForm({ initialData, onSuccess }: NewsFormProps) {
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation()
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [blobPreviewUrl, setBlobPreviewUrl] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<SubmitErrorState | null>(null)

  const supabase = createClient()
  const isEditing = Boolean(initialData)

  const defaultValues = useMemo<NewsFormValues>(() => ({
    title: initialData?.title ?? '',
    subtitle: initialData?.subtitle ?? '',
    category: (initialData?.category as 'Spotlight' | 'News') ?? 'News',
    tag: initialData?.tag ?? '',
    release_date: initialData?.release_date ? initialData.release_date.slice(0, 10) : '',
    content: initialData?.content ?? '',
  }), [initialData])

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsFormValues>({ defaultValues })

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

  const onSubmit = async (values: NewsFormValues) => {
    setSubmitError(null)
    const existingImageUrl = initialData?.img ?? null
    let imageUrl: string | null = existingImageUrl

    if (selectedImage) {
      if (existingImageUrl) {
        const oldObjectPath = getStorageObjectPathFromPublicUrl(existingImageUrl, 'news_Image')
        if (oldObjectPath) {
          const { error: removeError } = await supabase.storage.from('news_Image').remove([oldObjectPath])
          if (removeError) {
            setSubmitError({ kind: 'upload', message: removeError.message })
            toast.error(removeError.message)
            return
          }
        }
      }

      const rawExt = selectedImage.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const safeExt = rawExt.replace(/[^a-z0-9]/g, '') || 'jpg'
      const filePath = `news/${crypto.randomUUID()}.${safeExt}`

      const { error: uploadError } = await supabase.storage
        .from('news_Image')
        .upload(filePath, selectedImage, { upsert: false })

      if (uploadError) {
        setSubmitError({ kind: 'upload', message: uploadError.message })
        toast.error(uploadError.message)
        return
      }

      const { data: publicData } = supabase.storage.from('news_Image').getPublicUrl(filePath)
      imageUrl = publicData.publicUrl
    }

    const payload: NewsInsert | NewsUpdate = {
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
      category: values.category.trim(),
      tag: values.tag.trim(),
      release_date: values.release_date,
      content: values.content.trim(),
      img: imageUrl,
      likes: initialData?.likes ?? 0,
    }

    const result = isEditing && initialData
      ? await updateNews({ id: initialData.id, data: payload as NewsUpdate })
      : await createNews(payload as NewsInsert)

    if ('error' in result) {
      const errorMessage =
        typeof result.error === 'object' && result.error !== null && 'message' in result.error
          ? String(result.error.message)
          : isEditing ? 'Failed to update news' : 'Failed to create news'

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

    toast.success(isEditing ? 'News updated successfully' : 'News added successfully')
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

  const previewUrl = blobPreviewUrl ?? initialData?.img ?? null
  const isSubmitting = isCreating || isUpdating

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid max-w-4xl gap-5">
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
        <label htmlFor="title">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Title</Typography>
        </label>
        <input id="title" type="text" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Minimum 3 characters' } })} />
        {errors.title ? <Typography variant="body-small" color="sweet-red">{errors.title.message}</Typography> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="subtitle">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Subtitle</Typography>
        </label>
        <input id="subtitle" type="text" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('subtitle', { required: 'Subtitle is required' })} />
        {errors.subtitle ? <Typography variant="body-small" color="sweet-red">{errors.subtitle.message}</Typography> : null}
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-6">
        <div className="grid gap-2">
          <label htmlFor="category">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Category</Typography>
          </label>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <AdminDropdown
                title="Category"
                placeholder="Select category"
                value={field.value ?? null}
                onSelect={(nextValue) => field.onChange(nextValue as 'Spotlight' | 'News')}
                optionsMaxHeightClass="max-h-60"
                options={[
                  { label: 'Spotlight', value: 'Spotlight' },
                  { label: 'News', value: 'News' },
                ]}
              />
            )}
          />
          {errors.category ? <Typography variant="body-small" color="sweet-red">{errors.category.message}</Typography> : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="tag">
            <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Tag</Typography>
          </label>
          <input id="tag" type="text" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('tag', { required: 'Tag is required' })} />
          {errors.tag ? <Typography variant="body-small" color="sweet-red">{errors.tag.message}</Typography> : null}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="release_date">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Release Date</Typography>
        </label>
        <input id="release_date" type="date" className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('release_date', { required: 'Release date is required' })} />
        {errors.release_date ? <Typography variant="body-small" color="sweet-red">{errors.release_date.message}</Typography> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="content">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">Content</Typography>
        </label>
        <textarea id="content" rows={6} className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 outline-none transition focus:border-royal-blue-default" {...register('content', { required: 'Content is required', minLength: { value: 20, message: 'Minimum 20 characters' } })} />
        {errors.content ? <Typography variant="body-small" color="sweet-red">{errors.content.message}</Typography> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="img">
          <Typography as="span" variant="body-default" color="shade-800" className="font-medium">News Image</Typography>
        </label>
        <input
          id="img"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleImageChange}
          className="rounded-lg border border-shade-300 px-4 py-3 text-shade-900 file:mr-4 file:rounded-md file:border-0 file:bg-royal-blue-default file:px-3 file:py-2 file:text-white"
        />
        <Typography variant="body-small" color="shade-600">
          {selectedImage ? `Selected: ${selectedImage.name}` : previewUrl ? 'Using existing image' : 'No image selected'}
        </Typography>
        {previewUrl ? (
          <div className="relative h-40 w-72 overflow-hidden rounded-lg border border-shade-300">
            <Image src={previewUrl} alt="Selected news preview" fill className="object-cover" />
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-royal-blue-default px-6 py-3 text-white transition hover:bg-royal-blue-hover disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
      >
        <Typography as="span" variant="body-default" color="white" className="font-medium">
          {isSubmitting ? 'Saving...' : isEditing ? 'Update News' : 'Add News'}
        </Typography>
      </button>
    </form>
  )
}
