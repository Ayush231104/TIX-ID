'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { MovieInsert } from '@/types/index';

type MoviesFormValues = {
    name: string;
    genre: string;
    duration: string;
    director: string;
    movie_img: FileList;
    movies_status: string;
    age_rating: string;
    audience_score: number;
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

            const file = data.movie_img?.[0];

            if (!file) {
                alert('Movie image is required');
                return;
            }

            // upload image to storage
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

            // insert into movies table
            const movieData: MovieInsert = {
                name: data.name,
                movie_img: imgUrl,
                genre: data.genre as MovieInsert['genre'],
                duration: data.duration,
                director: data.director,
                movies_status: data.movies_status as MovieInsert['movies_status'],
                age_rating: data.age_rating as MovieInsert['age_rating'],
                audience_score: Number(data.audience_score),
            };

            const { error: insertError } = await supabase
                .from('movies')
                .insert([movieData]);

            if (insertError) throw insertError;

            alert('Movie uploaded successfully!');
            reset();
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
            <div>
                <input
                    {...register('name', { required: 'Movie name is required' })}
                    placeholder="Movie Name"
                    className="border py-2 px-4 rounded w-full"
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
            </div>

            <select
                {...register('genre', { required: true })}
                className="border py-2 px-4 w-full rounded"
            >
                <option value="">Select Genre</option>
                <option value="action">Action</option>
                <option value="war">War</option>
                <option value="horror">Horror</option>
                <option value="crime">Crime</option>
                <option value="thriller">Thriller</option>
                <option value="western">Western</option>
                <option value="romance">Romance</option>
            </select>

            <input
                {...register('duration')}
                placeholder="Duration (e.g. 02:30:00)"
                className="border py-2 px-4 rounded w-full"
            />

            <input
                {...register('director')}
                placeholder="Director"
                className="border py-2 px-4 rounded w-full"
            />

            <input
                {...register('audience_score')}
                placeholder="Audience Score (e.g. 8.5)"
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="border py-2 px-4 rounded w-full"
            />

            <select
                {...register('age_rating', { required: true })}
                className="border py-2 px-4 w-full rounded"
            >
                <option value="">Select Age Rating</option>
                <option value="U">U - Universal</option>
                <option value="UA">UA - Universal Adult</option>
                <option value="UA7+">UA7+</option>
                <option value="UA13+">UA13+</option>
                <option value="UA16+">UA16+</option>
                <option value="A">A - Adults Only</option>
                <option value="S">S - Special</option>
            </select>

            <select
                {...register('movies_status', { required: true })}
                className="border py-2 px-4 w-full rounded"
            >
                <option value="">Select Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="streaming">Streaming</option>
            </select>

            <div>
                <input
                    type="file"
                    accept="image/*"
                    {...register('movie_img', { required: 'Movie image is required' })}
                    className="w-full"
                />
                {errors.movie_img && (
                    <p className="text-red-500 text-sm">{errors.movie_img.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
                {loading ? 'Uploading...' : 'Upload Movie'}
            </button>
        </form>
    );
}