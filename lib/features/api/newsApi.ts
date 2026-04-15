import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getNewsAction, getArticleAction, toggleLikeNews } from '@/actions/newsActions';
import type { NewsCard } from '@/types/index';

type ArticleData = { article: NewsCard; relatedNews: NewsCard[]; isLikedByMe: boolean };

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

        getArticle: builder.query<ArticleData, string>({
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

        likeArticle: builder.mutation<{ likes: number; isLikedByMe: boolean }, { id: string }>({
            queryFn: async ({ id }) => {
                try {
                    const result = await toggleLikeNews(id);
                    if (!result.success || !result.data) return { error: { message: result.error } };
                    return { data: result.data };
                } catch (error) {
                    if (error instanceof Error) return { error: { message: error.message } };
                    return { error: { message: 'Unexpected error' } };
                }
            },
            async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    newsApi.util.updateQueryData('getArticle', id, (draft) => {
                        const wasLiked = draft.isLikedByMe;
                        draft.isLikedByMe = !wasLiked;
                        const currentLikes = draft.article.likes ?? 0;
                        draft.article.likes = wasLiked
                            ? Math.max(0, currentLikes - 1)
                            : currentLikes + 1;
                    })
                );

                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        newsApi.util.updateQueryData('getArticle', id, (draft) => {
                            draft.isLikedByMe = data.isLikedByMe;
                            draft.article.likes = data.likes;
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }],
        }),
    }),
});

export const { useGetNewsQuery, useGetArticleQuery, useLikeArticleMutation } = newsApi;