"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { NewsInsert } from "@/types";

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

//  Increments the like count safely on the server.
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