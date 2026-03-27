'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { GenreType, Movie, MovieInsert, MovieStatus, MovieUpdate } from '@/types/index';

// get all movies with optional filters
export async function getMoviesListAction({
  limit,
  status,
  genre,
  searchQuery
}: {
  limit?: number;
  status?: MovieStatus | 'upcoming'; // Accommodate your 'upcoming' string
  genre?: GenreType;
  searchQuery?: string;
} = {}) {
  const supabase = await createClient();

  let query = supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('movies_status', status);
  if (genre) query = query.eq('genre', genre);
  if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) return { success: false, error: error.message, data: null };
  return { success: true, data: data as Movie[], error: null };
}

// get single movie
export async function getMovie(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// add movie (super_admin only)
export async function addMovieAction(data: MovieInsert) {
  const supabase = await createClient();

  const { data: insertData, error } = await supabase
    .from('movies')
    .insert([data])
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/movies');

  return { success: true, data: insertData };
}

// update movie (super_admin only)
export async function updateMovieAction(id: string, data: MovieUpdate) {
  const supabase = await createClient();

  const { data: updatedData, error } = await supabase
    .from('movies')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/movies');
  revalidatePath(`/booking/${id}`);

  return { success: true, data: updatedData };
}

// delete movie (super_admin only)
export async function deleteMovieAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('movies')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/movies');

  return { success: true };
}

export async function upcomingMovies({limit = 3}: {limit?: number}) {
  const supabase = await createClient();

  let query = supabase
    .from('movies')
    .select('*')
    .eq('movies_status', 'upcoming')
    .order('created_at', { ascending: false });
  
  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) return { success: false, error: error.message };
  return { success: true, data }; 
}
