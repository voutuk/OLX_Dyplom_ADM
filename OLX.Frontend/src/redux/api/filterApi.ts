import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";
import { PageResponse } from "../../models/user";
import { IFilter, IFilterPageRequest } from "../../models/filter";
import { getFormData } from "../../utilities/common_funct";


export const filterApi = createApi({
    reducerPath: 'filterApi',
    baseQuery: createBaseQuery('Filter'),
    tagTypes: ['Filters'],

    endpoints: (builder) => ({
    getFilterPage:builder.query<PageResponse<IFilter>,IFilterPageRequest>({
                query: (pageRequest) => {
                    return {
                        url: `get/page`,
                        method: 'POST',
                       // timeout: 10000,
                        body: getFormData(pageRequest)
                    }
                },
                providesTags: ["Filters"]
            }),
       
    }),


})

export const {
   useGetFilterPageQuery
     } = filterApi