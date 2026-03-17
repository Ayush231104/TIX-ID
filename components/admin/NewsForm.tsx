'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { addNewsAction } from '@/actions/newsActions';

type NewsFormValues = {
  title: string;
  subtitle: string;
  tag: string;
  release_date: string;
  category: string;
  img: FileList;
};

export default function NewsForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsFormValues>();

  const onSubmit: SubmitHandler<NewsFormValues> = async (data) => {
    try {
      setLoading(true);
      const file = data.img?.[0];
      if (!file) return alert('Image is required');

      // 1. Upload to Storage
      const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('news_Image')
        .upload(`news-imgs/${fileName}`, file);

      if (uploadError) throw uploadError;

      // 2. Get URL
      const { data: publicData } = supabase.storage
        .from('news_Image')
        .getPublicUrl(`news-imgs/${fileName}`);

      // 3. Call Server Action
      const result = await addNewsAction({
        title: data.title,
        subtitle: data.subtitle,
        tag: data.tag,
        img: publicData.publicUrl,
        release_date: data.release_date,
        category: data.category,
      });

      if (result.success) {
        alert('News uploaded successfully!');
        reset();
      } else {
        alert(result.error);
      }
    } catch (error: any) {
      alert(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-2xl mx-auto p-6 rounded shadow space-y-4">
      <input {...register('title', { required: 'Title is required' })} placeholder="Title" className="border py-2 px-4 rounded w-full" />
      <input {...register('subtitle')} placeholder="Subtitle" className="border py-2 px-4 rounded w-full" />
      <input {...register('tag')} placeholder="Tag" className="border py-2 px-4 rounded w-full" />
      <input type="date" {...register('release_date')} className="border py-2 px-4 rounded w-full" />
      <input type="file" accept="image/*" {...register('img', { required: 'img is required' })} className="w-full" />
      <select {...register("category", { required: true })} className="border py-2 px-4 w-full rounded">
        <option value="">Select Category</option>
        <option value="Spotlight">Spotlight</option>
        <option value="News">News</option>
        <option value="Video">Video</option>
      </select>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        {loading ? 'Uploading...' : 'Upload News'}
      </button>
    </form>
  );
}