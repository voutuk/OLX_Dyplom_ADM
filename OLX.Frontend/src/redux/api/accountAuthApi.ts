import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from "./baseQuery"
import { IUserLockModel } from '../../models/account';
import { userAuthApi } from './userAuthApi';
import { IAdvert } from '../../models/advert';

export const accountApiAuth = createApi({
    reducerPath: 'accountApiAuth',
    baseQuery: createBaseQueryWithAuth('Account'),
    tagTypes: ['Account', "Favorites"],

    endpoints: (builder) => ({
        lockUnlockUsers: builder.mutation<void, IUserLockModel>({
            query: (usrLockModel) => {
                return {
                    url: 'block',
                    method: 'POST',
                    body: usrLockModel
                }
            },
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userAuthApi.util.invalidateTags(['Users', 'LockedUsers']))
                } catch (error) {
                    console.error('Lock/Unlock user failed:', error);
                }
            },
        }),

        getFavorites: builder.query<IAdvert[], void>({
            query: () => "favorites",
            providesTags: ["Favorites"],
        }),

        addToFavorites: builder.mutation<void, number>({
            query: (advertId) => ({
                url: `favorites/add/${advertId}`,
                method: "POST",
            }),
            invalidatesTags: ["Favorites"],
        }),

        removeFromFavorites: builder.mutation<void, number>({
            query: (advertId) => ({
                url: `favorites/remove/${advertId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Favorites"],
        }),
    }),
})

export const { 
    useLockUnlockUsersMutation,
    useGetFavoritesQuery,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation } = accountApiAuth