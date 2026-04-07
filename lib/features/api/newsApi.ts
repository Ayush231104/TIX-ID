import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getNewsAction, getArticleAction, toggleLikeNews } from '@/actions/newsActions';
import type { NewsCard } from '@/types/index';

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['News', 'Article'],
    endpoints: (builder) => ({
        getNews: builder.query<NewsCard[], { limit?: number; searchQuery?: string; categories?: string[] }>({
            queryFn: async (args) => {
                try {
                    const result = await getNewsAction(args);
                    if (!result.success) return { error: { message: result.error } };
                    return { data: result.data as NewsCard[] };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error' } };
                }
            },
            providesTags: ['News'],
        }),

        getArticle: builder.query<{ article: NewsCard; relatedNews: NewsCard[]; isLikedByMe: boolean }, string>({
            queryFn: async (id) => {
                try {
                    const result = await getArticleAction(id);
                    if (!result.success || !result.data) return { error: { message: result.error } };
                    return { data: result.data };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error' } };
                }
            },
            providesTags: (result, error, id) => [{ type: 'Article', id }],
        }),

        likeArticle: builder.mutation<void, { id: string; currentLikes: number }>({
            queryFn: async ({ id, currentLikes }) => {
                try {
                    const result = await toggleLikeNews(id, currentLikes);
                    if (!result.success) return { error: { message: result.error } };
                    return { data: undefined };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error' } };
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }],
        }),
    }),
});

export const { useGetNewsQuery, useGetArticleQuery, useLikeArticleMutation } = newsApi;