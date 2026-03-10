'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsFormValues>();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<NewsFormValues> = async (data) => {
    try {
      setLoading(true);

      const file = data.img?.[0];

      if (!file) {
        alert('img is required');
        return;
      }

      // 1 Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `news-imgs/${fileName}`;

      // 2 Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('news_Image') // bucket name
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3 Get public URL
      const { data: publicData } = supabase.storage
        .from('news_Image')
        .getPublicUrl(filePath);

      const imgUrl = publicData.publicUrl;

      // 4 Insert into table
      const { error: insertError } = await supabase
        .from('news') // table name
        .insert([
          {
            title: data.title,
            subtitle: data.subtitle,
            tag: data.tag,
            img: imgUrl,
            release_date: data.release_date,
            category: data.category,
          },
        ]);

      if (insertError) throw insertError;

      alert('News uploaded successfully!');
      reset();
        console.log(data);
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white max-w-2xl mx-auto p-6 rounded shadow space-y-4"
    >
      <div >
        <input
          {...register('title', { required: 'Title is required' })}
          placeholder="Title"
          className="border py-2 px-4 rounded w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <input
        {...register('subtitle')}
        placeholder="Subtitle"
        className="border py-2 px-4 rounded w-full"
      />

      <input
        {...register('tag')}
        placeholder="Tag"
        className="border py-2 px-4 rounded w-full"
      />

      <input
        type="date"
        {...register('release_date')}
        className="border py-2 px-4 rounded w-full"
      />

      <div>
        <input
          type="file"
          accept="image/*"
          {...register('img', { required: 'img is required' })}
          className="w-full"
        />
        {errors.img && (
          <p className="text-red-500 text-sm">{errors.img.message}</p>
        )}
      </div>

      <select
        {...register("category", { required: true })}
        className="border py-2 px-4 w-full rounded"
      >
        <option value="">Select Category</option>
        <option value="Spotlight">Spotlight</option>
        <option value="News">News</option>
        <option value="Video">Video</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Uploading...' : 'Upload News'}
      </button>
    </form>
  );
}