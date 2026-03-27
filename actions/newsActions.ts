"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { NewsCard, NewsInsert } from "@/types";

export async function getNewsAction({
  limit = 3,
  searchQuery = "",
  categories = []
}: {
  limit?: number;
  searchQuery?: string;
  categories?: string[];
}) {
  const supabase = await createClient();

  let query = supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  if (categories.length > 0) {
    query = query.in("category", categories);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };

}


export async function addNewsAction(data: NewsInsert) {
  const supabase = await createClient();

  const { data: insertData, error } = await supabase
    .from('news')
    .insert([data])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Refresh the news page cache
  revalidatePath('/news');
  revalidatePath('/');

  return { success: true, data: insertData };
}

export async function getArticleAction(id: string) {
  const supabase = await createClient();

  const { data: article, error: mainError } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (mainError) {
    return { success: false, error: mainError.message, data: null };
  }

  const { data: related, error: relatedError } = await supabase
    .from('news')
    .select('*')
    .neq('id', id)
    .limit(3);

  if (relatedError) {
    return { success: false, error: relatedError.message, data: null };
  }

  return {
    success: true,
    data: { article: article as NewsCard, relatedNews: (related || []) as NewsCard[] },
    error: null
  };
}

export async function likeNews(id: string, currentLikes: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('news')
    .update({ likes: currentLikes + 1 })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/news/${id}`);
  return { success: true };
}