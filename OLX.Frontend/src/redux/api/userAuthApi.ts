
import { createBaseQueryWithAuth } from "./baseQuery";
import { IOlxUser, IOlxUserPageRequest, IOlxUserPageResponse } from "../../models/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import { getFormData } from "../../utilities/common_funct";

export const userAuthApi = createApi({
    reducerPath: 'userAuthApi',
    baseQuery: createBaseQueryWithAuth('User'),
    tagTypes: ['Users', 'Admins'],
    endpoints: (builder) => ({

        getUsers: builder.query<IOlxUser[], void>({
            query: () => {
                return {
                    url: 'get',
                    method: 'GET',
                   // timeout: 10000,
                }
            },
            providesTags: ["Users"]
        }),

        getLockedUsers: builder.query<IOlxUser[], void>({
            query: () => {
                return {
                    url: 'get/locked',
                    method: 'GET',
                   // timeout: 10000,
                }
            },
            providesTags: ["Users"]
        }),

        getAdmins: builder.query<IOlxUser[], void>({
            query: () => {
                return {
                    url: 'get/admin',
                    method: 'GET',
                   // timeout: 10000,
                }
            },
            providesTags: ["Admins"]
        }),

        getUser: builder.query<IOlxUser, number>({
            query: (id: number) => {
                return {
                    url: `get/${id}`,
                    method: 'GET',
                   // timeout: 10000,
                }
            },
            providesTags: ["Users"]
        }),

        getAdmin: builder.query<IOlxUser, number>({
            query: (id) => {
                return {
                    url: `get/admin/${id}`,
                    method: 'GET',
                   // timeout: 10000,
                }
            },
            providesTags: ["Admins"]
        }),

        getAdminPage: builder.query<IOlxUserPageResponse<IOlxUser>,IOlxUserPageRequest>({
            query: (pageRequest) => {
                return {
                    url: `get/admin/page`,
                    method: 'POST',
                  //  timeout: 10000,
                    body: pageRequest
                }
            },
            providesTags: ["Admins"]
        }),

        getUserPage: builder.query<IOlxUserPageResponse<IOlxUser>,IOlxUserPageRequest>({
            query: (pageRequest) => {
                return {
                    url: `get/page`,
                    method: 'POST',
                   // timeout: 10000,
                    body: getFormData(pageRequest)
                }
            },
            providesTags: ["Users"]
        }),
    }),
})
export const {
    useGetUserQuery,
    useGetAdminPageQuery,
    useGetAdminQuery,
    useGetAdminsQuery,
    useGetLockedUsersQuery,
    useGetUserPageQuery,
    useGetUsersQuery } = userAuthApi