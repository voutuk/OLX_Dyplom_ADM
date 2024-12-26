import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from "../utilities/baseQuery"
import { IAuthResponse, ILoginRequest } from "../models/account"
import { setCredentials } from '../store/slices/userSlice';

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: createBaseQuery('Account'),
    tagTypes: ['Account'],

    endpoints: (builder) => ({

        login: builder.mutation<IAuthResponse, ILoginRequest>({
            query: (data) => {
                return {
                    url: 'login',
                    method: 'POST',
                    body: data,
                }
            },
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    if (result.data && result.data.accessToken) {
                        dispatch(setCredentials({ token: result.data.accessToken }))
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

        // register: builder.mutation<ILoginResponse, IUserCreate>({
        //     query: (data) => {
        //         const formData = generateUserCreateFormData(data)
        //         return {
        //             url: 'SignUp',
        //             method: 'POST',
        //             body: formData,
        //             headers: {
        //                 'Content-Type': 'multipart/form-data'
        //             }
        //         }
        //     },
        // }),
    }),


})

export const { useLoginMutation } = accountApi