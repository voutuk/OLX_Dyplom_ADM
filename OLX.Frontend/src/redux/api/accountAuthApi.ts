import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from "./baseQuery"
import { IUserEditModel, IUserEditResponse, IUserLockModel } from '../../models/account';
import { userAuthApi } from './userAuthApi';
import { IAdvert } from '../../models/advert';
import { getFormData } from '../../utilities/common_funct';
import { updateAccessToken } from '../slices/userSlice';

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

        userEdit: builder.mutation<IUserEditResponse, IUserEditModel>({
            query: (editModel) => ({
                url: "edit/user",
                method: 'POST',
                body: getFormData(editModel)
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    if (result.data && result.data.accessToken) {
                        dispatch(updateAccessToken({ token: result.data.accessToken}))
                        dispatch(userAuthApi.util.invalidateTags(['User']))
                    }
                } catch (error) {
                    console.error('Edit user failed:', error);
                }
            },
        }),

        deleteAccount: builder.mutation<void, number>({
            query: (userId) => ({
                url: `delete?id=${userId}`,
                method: 'DELETE',
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userAuthApi.util.invalidateTags(['User','LockedUsers','User','Users']))
                    
                } catch (error) {
                    console.error('Edit user failed:', error);
                }
            },
        }),

        getFavorites: builder.query<IAdvert[], void>({
            query: () => ({
                url: "favorites",
                method: 'GET'
            }),
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
    useRemoveFromFavoritesMutation ,
    useUserEditMutation,
    useDeleteAccountMutation
} = accountApiAuth