'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profile']['Row']

type ActionResult<T> = {
  success: boolean
  data: T | null
  error: string | null
}

type UpdateProfileInput = {
  first_name?: string | null
  last_name?: string | null
  mobile_no?: string | null
  age?: number | null
  address?: string | null
}

/**
 * Get the authenticated user's profile
 */
export async function getProfile(): Promise<ActionResult<Profile>> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, data: null, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: data as Profile, error: null }
}

/**
 * Update user profile fields
 */
export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult<Profile>> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, data: null, error: 'Unauthorized' }
  }

  // Validate inputs
  if (input.first_name !== undefined && input.first_name !== null) {
    if (input.first_name.length < 2 || input.first_name.length > 50) {
      return {
        success: false,
        data: null,
        error: 'First name must be between 2 and 50 characters',
      }
    }
  }

  if (input.last_name !== undefined && input.last_name !== null) {
    if (input.last_name.length < 2 || input.last_name.length > 50) {
      return {
        success: false,
        data: null,
        error: 'Last name must be between 2 and 50 characters',
      }
    }
  }

  if (input.mobile_no !== undefined && input.mobile_no !== null) {
    if (!/^\d{10,}$/.test(input.mobile_no)) {
      return {
        success: false,
        data: null,
        error: 'Mobile number must be at least 10 digits',
      }
    }
  }

  if (input.age !== undefined && input.age !== null) {
    if (input.age < 13 || input.age > 120) {
      return {
        success: false,
        data: null,
        error: 'Age must be between 13 and 120',
      }
    }
  }

  if (input.address !== undefined && input.address !== null) {
    if (input.address.length > 200) {
      return {
        success: false,
        data: null,
        error: 'Address must be less than 200 characters',
      }
    }
  }

  const { data, error } = await supabase
    .from('profile')
    .update(input)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/profile')
  revalidatePath('/tickets')

  return { success: true, data: data as Profile, error: null }
}

/**
 * Upload avatar image and update profile with avatar URL
 */
export async function uploadAvatar(formData: FormData): Promise<ActionResult<string>> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, data: null, error: 'Unauthorized' }
  }

  const file = formData.get('avatar') as File | null

  if (!file) {
    return { success: false, data: null, error: 'No file provided' }
  }

  // Validate file type
  const validMimes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validMimes.includes(file.type)) {
    return {
      success: false,
      data: null,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    }
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      success: false,
      data: null,
      error: 'File size must be less than 5MB',
    }
  }

  // Get file extension
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeExt = ext.replace(/[^a-z0-9]/g, '') || 'jpg'

  // Generate unique file path with UUID
  const filePath = `${user.id}/${crypto.randomUUID()}.${safeExt}`

  // Upload file to avatars bucket
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: false })

  if (uploadError) {
    return {
      success: false,
      data: null,
      error: `Upload failed: ${uploadError.message}`,
    }
  }

  // Get public URL
  const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath)
  const avatarUrl = publicData.publicUrl

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('profile')
    .update({ avatar_url: avatarUrl })
    .eq('user_id', user.id)

  if (updateError) {
    // Try to delete the uploaded file if profile update fails
    await supabase.storage.from('avatars').remove([filePath]).catch(() => {})

    return {
      success: false,
      data: null,
      error: `Failed to update profile: ${updateError.message}`,
    }
  }

  revalidatePath('/profile')

  return { success: true, data: avatarUrl, error: null }
}
