'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { GenreType, MovieInsert, MovieStatus, MovieUpdate } from '@/types/index';

// get all movies with optional filters
export async function getMovies(status?: MovieStatus, genre?: GenreType) {
  const supabase = await createClient();

  let query = supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('movies_status', status);
  if (genre) query = query.eq('genre', genre);

  const { data, error } = await query;

  if (error) return { success: false, error: error.message };
  return { success: true, data };
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