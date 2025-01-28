import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";
import { IAdvert, IAdvertPageRequest, IAdvertImage } from "../../models/advert";
import { PageResponse } from "../../models/user";

export const advertApi = createApi({
  reducerPath: "advertApi",
  baseQuery: createBaseQuery("Advert"),
  tagTypes: ["Adverts"],

  endpoints: (builder) => ({
    getAllAdverts: builder.query<IAdvert[], void>({
      query: () => ({
        url: `get`,
        method: "GET",
      }),
      providesTags: ["Adverts"],
    }),

    getAdvertById: builder.query<IAdvert, number>({
      query: (id) => ({
        url: `get/${id}`,
        method: "GET",
      }),
      providesTags: ["Adverts"],
    }),

    getAdvertPage: builder.query<PageResponse<IAdvert>, IAdvertPageRequest>({
      query: (pageRequest) => ({
        url: `get/page`,
        method: "POST",
        body: pageRequest,
      }),
      providesTags: ["Adverts"],
    }),

    getAdvertsByRange: builder.query<IAdvert[], number[]>({
      query: (ids) => ({
        url: `get/range`,
        method: "POST",
        body: ids,
      }),
      providesTags: ["Adverts"],
    }),

    getAdvertImages: builder.query<IAdvertImage[], number>({
      query: (id) => ({
        url: `get/images/${id}`,
        method: "GET",
      }),
      providesTags: ["Adverts"],
    }),
  }),
});

export const {
  useGetAllAdvertsQuery,
  useGetAdvertByIdQuery,
  useGetAdvertPageQuery,
  useGetAdvertsByRangeQuery,
  useGetAdvertImagesQuery,
} = advertApi;
