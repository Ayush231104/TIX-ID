'use server'

import { revalidatePath } from 'next/cache'
import type {
  Brand,
  City,
  Movie,
  MovieInsert,
  MovieUpdate,
  News,
  NewsInsert,
  NewsUpdate,
  SeatInsert,
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
import { createClient } from '@/utils/supabase/server'

type AdminRole = Extract<UserRole, 'super_admin' | 'theater_admin'>

type ActionResult<T> = {
  success: boolean
  data: T | null
  error: string | null
}

type AdminContext = {
  userId: string
  role: AdminRole
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export type AdminTheaterListItem = Theater & {
  brands: Pick<Brand, 'name'> | null
  cities: Pick<City, 'name'> | null
}

export type AdminScreenListItem = Screen & {
  theater: Pick<Theater, 'name' | 'user_id'> | null
}

export type AdminShowtimeListItem = Showtime & {
  movies: Pick<Movie, 'name'> | null
  theater: Pick<Theater, 'name' | 'user_id'> | null
  screen: Pick<Screen, 'name'> | null
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

async function removeStorageObjectByPublicUrl(
  supabase: SupabaseServerClient,
  bucket: string,
  publicUrl: string | null,
): Promise<ActionResult<null>> {
  if (!publicUrl) {
    return { success: true, data: null, error: null }
  }

  const objectPath = getStorageObjectPathFromPublicUrl(publicUrl, bucket)

  if (!objectPath) {
    return { success: false, data: null, error: 'Invalid storage URL format' }
  }

  const { error } = await supabase.storage.from(bucket).remove([objectPath])

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: null, error: null }
}

async function ensureTheaterOwnership(
  supabase: SupabaseServerClient,
  context: AdminContext,
  theaterId: string,
): Promise<ActionResult<null>> {
  if (context.role !== 'theater_admin') {
    return { success: true, data: null, error: null }
  }

  const { data, error } = await supabase
    .from('theater')
    .select('id')
    .eq('id', theaterId)
    .eq('user_id', context.userId)
    .maybeSingle()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  if (!data) {
    return { success: false, data: null, error: 'You can modify only your assigned theaters' }
  }

  return { success: true, data: null, error: null }
}

async function getAdminContext(): Promise<ActionResult<AdminContext>> {
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
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error || !data?.role) {
    return { success: false, data: null, error: error?.message ?? 'Role not found' }
  }

  if (data.role !== 'super_admin' && data.role !== 'theater_admin') {
    return { success: false, data: null, error: 'Forbidden' }
  }

  return {
    success: true,
    data: {
      userId: user.id,
      role: data.role,
    },
    error: null,
  }
}

export async function getAdminRole(): Promise<ActionResult<AdminRole>> {
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  return { success: true, data: contextResult.data.role, error: null }
}

export async function getAdminMovies(): Promise<ActionResult<Movie[]>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as Movie[], error: null }
}

export async function getAdminNews(): Promise<ActionResult<News[]>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can access news management' }
  }

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as News[], error: null }
}

export async function getAdminTheaters(): Promise<ActionResult<Theater[]>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { role, userId } = contextResult.data

  let query = supabase
    .from('theater')
    .select('*')
    .order('created_at', { ascending: false })

  if (role === 'theater_admin') {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as Theater[], error: null }
}

export async function getAdminTheatersWithDetails(): Promise<ActionResult<AdminTheaterListItem[]>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { role, userId } = contextResult.data

  let query = supabase
    .from('theater')
    .select('*, brands(name), cities(name)')
    .order('created_at', { ascending: false })

  if (role === 'theater_admin') {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as AdminTheaterListItem[], error: null }
}

export async function getAdminBrands(): Promise<ActionResult<Brand[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as Brand[], error: null }
}

export async function getAdminCities(): Promise<ActionResult<City[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as City[], error: null }
}

export async function getScreensByTheater(theaterId: string): Promise<ActionResult<Screen[]>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { role, userId } = contextResult.data

  if (role === 'theater_admin') {
    const { data: ownedTheater, error: theaterError } = await supabase
      .from('theater')
      .select('id')
      .eq('id', theaterId)
      .eq('user_id', userId)
      .maybeSingle()

    if (theaterError) {
      return { success: false, data: null, error: theaterError.message }
    }

    if (!ownedTheater) {
      return { success: false, data: null, error: 'You can access only your assigned theaters' }
    }
  }

  const { data, error } = await supabase
    .from('screen')
    .select('*')
    .eq('theater_id', theaterId)
    .order('name', { ascending: true })

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as Screen[], error: null }
}

export async function getAdminScreensWithDetails(): Promise<ActionResult<AdminScreenListItem[]>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { role, userId } = contextResult.data

  const query = role === 'theater_admin'
    ? supabase
      .from('screen')
      .select('*, theater!inner(name,user_id)')
      .eq('theater.user_id', userId)
      .order('created_at', { ascending: false })
    : supabase
      .from('screen')
      .select('*, theater(name,user_id)')
      .order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as AdminScreenListItem[], error: null }
}

export async function getAdminShowtimesWithDetails(): Promise<ActionResult<AdminShowtimeListItem[]>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { role, userId } = contextResult.data

  const query = role === 'theater_admin'
    ? supabase
      .from('showtimes')
      .select('*, movies(name), theater!inner(name,user_id), screen(name)')
      .eq('theater.user_id', userId)
      .order('show_time', { ascending: true })
    : supabase
      .from('showtimes')
      .select('*, movies(name), theater(name,user_id), screen(name)')
      .order('show_time', { ascending: true })

  const { data, error } = await query

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: (data ?? []) as AdminShowtimeListItem[], error: null }
}

export async function getAdminMovieById(id: string): Promise<ActionResult<Movie>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can access movie management' }
  }

  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: data as Movie, error: null }
}

export async function getAdminNewsById(id: string): Promise<ActionResult<News>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can access news management' }
  }

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  return { success: true, data: data as News, error: null }
}

export async function getAdminTheaterById(id: string): Promise<ActionResult<Theater>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { data, error } = await supabase
    .from('theater')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, data.id)
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  return { success: true, data: data as Theater, error: null }
}

export async function getAdminScreenById(id: string): Promise<ActionResult<Screen>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { data, error } = await supabase
    .from('screen')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, data.theater_id ?? '')
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  return { success: true, data: data as Screen, error: null }
}

export async function getAdminShowtimeById(id: string): Promise<ActionResult<Showtime>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { data, error } = await supabase
    .from('showtimes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, data.theater_id ?? '')
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  return { success: true, data: data as Showtime, error: null }
}

export async function createMovie(data: MovieInsert): Promise<ActionResult<Movie>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can create movies' }
  }

  const { data: insertData, error } = await supabase
    .from('movies')
    .insert([data])
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/movies')
  revalidatePath('/admin/dashboard')
  revalidatePath('/movies')

  return { success: true, data: insertData as Movie, error: null }
}

export async function createNews(data: NewsInsert): Promise<ActionResult<News>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can create news' }
  }

  const { data: insertData, error } = await supabase
    .from('news')
    .insert([data])
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/news')
  revalidatePath('/admin/dashboard')
  revalidatePath('/news')

  return { success: true, data: insertData as News, error: null }
}

export async function createTheater(data: TheaterInsert): Promise<ActionResult<Theater>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const payload: TheaterInsert = {
    ...data,
    user_id: contextResult.data.role === 'theater_admin'
      ? contextResult.data.userId
      : data.user_id ?? null,
  }

  const { data: insertData, error } = await supabase
    .from('theater')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/theaters')
  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: insertData as Theater, error: null }
}

export async function createScreen(data: ScreenInsert): Promise<ActionResult<Screen>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { role, userId } = contextResult.data

  if (role === 'theater_admin') {
    const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, data.theater_id ?? '')
    if (!ownershipResult.success) {
      return { success: false, data: null, error: ownershipResult.error }
    }
  }

  const seatRows = data.seat_row ?? 0
  const seatCols = data.seat_col ?? 0

  const payload: ScreenInsert = {
    ...data,
    total_seats: data.total_seats ?? seatRows * seatCols,
  }

  const { data: insertData, error } = await supabase
    .from('screen')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  if (seatRows > 0 && seatCols > 0) {
    const seatPayload: SeatInsert[] = []

    for (let row = 1; row <= seatRows; row += 1) {
      for (let col = 1; col <= seatCols; col += 1) {
        seatPayload.push({
          screen_id: insertData.id,
          seat_row: row,
          seat_col: col,
        })
      }
    }

    const { error: seatsError } = await supabase
      .from('seats')
      .insert(seatPayload)

    if (seatsError) {
      // Keep data consistent: remove the screen if seat generation fails.
      await supabase.from('screen').delete().eq('id', insertData.id)
      return { success: false, data: null, error: seatsError.message }
    }
  }

  revalidatePath('/admin/screens')
  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: insertData as Screen, error: null }
}

export async function createShowtime(data: ShowtimeInsert): Promise<ActionResult<Showtime>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const { role, userId } = contextResult.data

  if (role === 'theater_admin') {
    const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, data.theater_id ?? '')
    if (!ownershipResult.success) {
      return { success: false, data: null, error: ownershipResult.error }
    }
  }

  const { data: insertData, error } = await supabase
    .from('showtimes')
    .insert([data])
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: insertData as Showtime, error: null }
}

export async function updateMovie(id: string, data: MovieUpdate): Promise<ActionResult<Movie>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can update movies' }
  }

  const { data: updatedData, error } = await supabase
    .from('movies')
    .update(data)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/movies')
  revalidatePath('/admin/dashboard')
  revalidatePath('/movies')

  return { success: true, data: updatedData as Movie, error: null }
}

export async function updateNews(id: string, data: NewsUpdate): Promise<ActionResult<News>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can update news' }
  }

  const { data: updatedData, error } = await supabase
    .from('news')
    .update(data)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/news')
  revalidatePath('/admin/dashboard')
  revalidatePath('/news')

  return { success: true, data: updatedData as News, error: null }
}

export async function updateTheater(id: string, data: TheaterUpdate): Promise<ActionResult<Theater>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, id)
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  const { data: updatedData, error } = await supabase
    .from('theater')
    .update(data)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/theaters')
  revalidatePath('/admin/screens')
  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: updatedData as Theater, error: null }
}

export async function updateScreen(id: string, data: ScreenUpdate): Promise<ActionResult<Screen>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const screenResult = await getAdminScreenById(id)
  if (!screenResult.success || !screenResult.data) {
    return { success: false, data: null, error: screenResult.error }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, screenResult.data.theater_id ?? '')
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  const { data: updatedData, error } = await supabase
    .from('screen')
    .update(data)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/screens')
  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: updatedData as Screen, error: null }
}

export async function updateShowtime(id: string, data: ShowtimeUpdate): Promise<ActionResult<Showtime>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const showtimeResult = await getAdminShowtimeById(id)
  if (!showtimeResult.success || !showtimeResult.data) {
    return { success: false, data: null, error: showtimeResult.error }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, showtimeResult.data.theater_id ?? '')
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  const { data: updatedData, error } = await supabase
    .from('showtimes')
    .update(data)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: updatedData as Showtime, error: null }
}

export async function deleteMovie(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can delete movies' }
  }

  const movieResult = await getAdminMovieById(id)
  if (!movieResult.success || !movieResult.data) {
    return { success: false, data: null, error: movieResult.error }
  }

  const storageResult = await removeStorageObjectByPublicUrl(supabase, 'movies_imgs', movieResult.data.movie_img)
  if (!storageResult.success) {
    return { success: false, data: null, error: storageResult.error }
  }

  const { error } = await supabase
    .from('movies')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/movies')
  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')
  revalidatePath('/movies')

  return { success: true, data: null, error: null }
}

export async function deleteNews(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  if (contextResult.data.role !== 'super_admin') {
    return { success: false, data: null, error: 'Only super admin can delete news' }
  }

  const newsResult = await getAdminNewsById(id)
  if (!newsResult.success || !newsResult.data) {
    return { success: false, data: null, error: newsResult.error }
  }

  const storageResult = await removeStorageObjectByPublicUrl(supabase, 'news_Image', newsResult.data.img)
  if (!storageResult.success) {
    return { success: false, data: null, error: storageResult.error }
  }

  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/news')
  revalidatePath('/admin/dashboard')
  revalidatePath('/news')

  return { success: true, data: null, error: null }
}

export async function deleteTheater(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, id)
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  const { error } = await supabase
    .from('theater')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/theaters')
  revalidatePath('/admin/screens')
  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: null, error: null }
}

export async function deleteScreen(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const screenResult = await getAdminScreenById(id)
  if (!screenResult.success || !screenResult.data) {
    return { success: false, data: null, error: screenResult.error }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, screenResult.data.theater_id ?? '')
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  const { error } = await supabase
    .from('screen')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/screens')
  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: null, error: null }
}

export async function deleteShowtime(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const contextResult = await getAdminContext()

  if (!contextResult.success || !contextResult.data) {
    return { success: false, data: null, error: contextResult.error }
  }

  const showtimeResult = await getAdminShowtimeById(id)
  if (!showtimeResult.success || !showtimeResult.data) {
    return { success: false, data: null, error: showtimeResult.error }
  }

  const ownershipResult = await ensureTheaterOwnership(supabase, contextResult.data, showtimeResult.data.theater_id ?? '')
  if (!ownershipResult.success) {
    return { success: false, data: null, error: ownershipResult.error }
  }

  const { error } = await supabase
    .from('showtimes')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, data: null, error: error.message }
  }

  revalidatePath('/admin/showtimes')
  revalidatePath('/admin/dashboard')

  return { success: true, data: null, error: null }
}
