import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from "./baseQuery"
import { IUserLockModel } from '../../models/account';

export const accountApiAuth = createApi({
    reducerPath: 'accountApiAuth',
    baseQuery: createBaseQueryWithAuth('Account'),
    tagTypes: ['Account'],

    endpoints: (builder) => ({
        lockUnlockUsers: builder.mutation<void, IUserLockModel>({
            query: (usrLockModel) => {
                return {
                    url: 'block',
                    method: 'POST',
                    body: usrLockModel
                }
            },
        }),
    }),
})

export const { useLockUnlockUsersMutation} = accountApiAuth