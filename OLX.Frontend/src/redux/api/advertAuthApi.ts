import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "./baseQuery";
import { IAdvertCreationModel } from "../../models/advert";

export const advertAuthApi = createApi({
  reducerPath: "advertAuthApi",
  baseQuery: createBaseQueryWithAuth("Advert"),
  tagTypes: ["Adverts"],

  endpoints: (builder) => ({
    createAdvert: builder.mutation<void, IAdvertCreationModel>({
      query: (creationModel) => ({
        url: `create`,
        method: "PUT",
        body: creationModel,
      }),
      invalidatesTags: ["Adverts"],
    }),

    updateAdvert: builder.mutation<void, IAdvertCreationModel>({
      query: (creationModel) => ({
        url: `update`,
        method: "POST",
        body: creationModel,
      }),
      invalidatesTags: ["Adverts"],
    }),

    deleteAdvert: builder.mutation<void, number>({
      query: (id) => ({
        url: `delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Adverts"],
    }),

    blockAdvert: builder.mutation<void, { advertId: number; status: boolean }>({
      query: ({ advertId, status }) => ({
        url: `block`,
        method: "POST",
        params: { advertId, status },
      }),
      invalidatesTags: ["Adverts"],
    }),

    approveAdvert: builder.mutation<void, number>({
      query: (advertId) => ({
        url: `approve/${advertId}`,
        method: "POST",
      }),
      invalidatesTags: ["Adverts"],
    }),
  }),
});

export const {
  useCreateAdvertMutation,
  useUpdateAdvertMutation,
  useDeleteAdvertMutation,
  useBlockAdvertMutation,
  useApproveAdvertMutation,
} = advertAuthApi;
