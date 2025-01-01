import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from "./baseQuery"
import { logOut } from '../slices/userSlice';

export const accountApiAuth = createApi({
    reducerPath: 'accountApiAuth',
    baseQuery: createBaseQueryWithAuth('Account'),
    tagTypes: ['Account'],

    endpoints: (builder) => ({

        logout: builder.mutation({
            query: () => {
                return {
                    url: 'user/logout',
                    method: 'POST',
                    credentials: "include"
                }
            },
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut());
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
        }),
    }),
})

export const { useLogoutMutation } = accountApiAuth