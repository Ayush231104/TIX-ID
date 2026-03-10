'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type MoviesFormValues = {
    title: string;
    genre: string;
    duration: string;
    director: string;
    img: FileList;
    status: string;
};

export default function MoviesForm() {
    const supabase = createClient();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MoviesFormValues>();

    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit: SubmitHandler<MoviesFormValues> = async (data) => {
        try {
            setLoading(true);

            const file = data.img?.[0];

            if (!file) {
                alert('img is required');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `movies-imgs/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('movies_imgs') 
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicData } = supabase.storage
                .from('movies_imgs')
                .getPublicUrl(filePath);

            const imgUrl = publicData.publicUrl;

            // 4 Insert into table
            const { error: insertError } = await supabase
                .from('movies') // table name
                .insert([
                    {
                        title: data.title,
                        img: imgUrl,
                        genre: data.genre,
                        duration: data.duration,
                        director: data.director,
                        status: data.status,
                    },
                ]);

            if (insertError) throw insertError;

            alert('Movies uploaded successfully!');
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
                {...register('genre')}
                placeholder="Genre"
                className="border py-2 px-4 rounded w-full"
            />

            <input
                {...register('duration')}
                placeholder="Duration"
                className="border py-2 px-4 rounded w-full"
            />

            <input
                placeholder="Director"
                {...register('director')}
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
                {...register("status", { required: true })}
                className="border py-2 px-4 w-full rounded"
            >
                <option value="">Select Status</option>
                <option value="Now Playing">Now Playing</option>
                <option value="Upcoming">Upcoming</option>
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