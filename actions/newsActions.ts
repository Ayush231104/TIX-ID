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

  revalidatePath('/news');
  revalidatePath('/');

  return { success: true, data: insertData };
}

export async function getArticleAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  let isLikedByMe = false;
  if (user) {
    const { data: likeData } = await supabase
      .from('news_likes')
      .select('news_id')
      .eq('news_id', id)
      .eq('user_id', user.id)
      .maybeSingle(); 
    
    if (likeData) isLikedByMe = true;
  }

  return {
    success: true,
    data: { 
      article: article as NewsCard, 
      relatedNews: (related || []) as NewsCard[],
      isLikedByMe 
    },
    error: null
  };
}

export async function toggleLikeNews(newsId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "You must be logged in to like articles." };

  // Check if they already liked it
  const { data: existingLike } = await supabase
    .from('news_likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('news_id', newsId)
    .maybeSingle();

  if (existingLike) {
    const { error: deleteError } = await supabase
      .from('news_likes')
      .delete()
      .eq('user_id', user.id)
      .eq('news_id', newsId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }
  } else {
    const { error: insertError } = await supabase
      .from('news_likes')
      .insert({ user_id: user.id, news_id: newsId });

    if (insertError) {
      return { success: false, error: insertError.message };
    }
  }

  const { count, error: countError } = await supabase
    .from('news_likes')
    .select('*', { count: 'exact', head: true })
    .eq('news_id', newsId);

  if (countError) {
    return { success: false, error: countError.message };
  }

  const nextLikes = count ?? 0;

  const { error: updateNewsError } = await supabase
    .from('news')
    .update({ likes: nextLikes })
    .eq('id', newsId);

  if (updateNewsError) {
    return { success: false, error: updateNewsError.message };
  }

  revalidatePath(`/news/${newsId}`);
  revalidatePath('/news');
  revalidatePath('/');

  return {
    success: true,
    data: {
      likes: nextLikes,
      isLikedByMe: !existingLike,
    },
  };
}
