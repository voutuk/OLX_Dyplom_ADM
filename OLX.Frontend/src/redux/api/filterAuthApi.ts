import { createApi } from "@reduxjs/toolkit/query/react"
import { createBaseQueryWithAuth } from "./baseQuery"
import { IFilterCreationModel } from "../../models/filter"
import { getFormData } from "../../utilities/common_funct"
import { filterApi } from "./filterApi"

export const filterAuthApi = createApi({
    reducerPath: 'filterAuthApi',
    baseQuery: createBaseQueryWithAuth('Filter'),


    endpoints: (builder) => ({

        createFilter: builder.mutation<void, IFilterCreationModel>({
            query: (creationModel) => {
                return {
                    url: `create`,
                    method: 'PUT',
                    // timeout: 10000,
                    body: getFormData(creationModel)
                }
            },
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(filterApi.util.invalidateTags(['Filters']))
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        deleteFilter: builder.mutation<void, number>({
            query: (filterId) => {
                return {
                    url: `delete/${filterId}`,
                    method: 'DELETE',
                    // timeout: 10000,

                }
            },
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(filterApi.util.invalidateTags(['Filters']))
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

    }),
})

export const {
    useCreateFilterMutation,
    useDeleteFilterMutation
} = filterAuthApi