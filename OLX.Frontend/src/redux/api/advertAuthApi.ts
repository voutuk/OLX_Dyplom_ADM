import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "./baseQuery";
import { IAdvert, IAdvertCreationModel } from "../../models/advert";
import { advertApi } from "./advertApi";

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
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts"]))
                } catch (error) {
                    console.error('Create advert failed:', error);
                }
            },
        }),

        updateAdvert: builder.mutation<void, IAdvertCreationModel>({
            query: (creationModel) => ({
                url: `update`,
                method: "POST",
                body: creationModel,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts"]))
                } catch (error) {
                    console.error('Update advert failed:', error);
                }
            },
        }),

        deleteAdvert: builder.mutation<void, number>({
            query: (id) => ({
                url: `delete/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts"]))
                } catch (error) {
                    console.error('Delete advert failed:', error);
                }
            },
        }),

        blockAdvert: builder.mutation<void, { advertId: number; status: boolean }>({
            query: ({ advertId, status }) => ({
                url: `block`,
                method: "POST",
                params: { advertId, status },
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts"]))
                } catch (error) {
                    console.error('Block advert failed:', error);
                }
            },
        }),

        approveAdvert: builder.mutation<void, number>({
            query: (advertId) => ({
                url: `approve/${advertId}`,
                method: "POST",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts"]))
                } catch (error) {
                    console.error('Approve advert failed:', error);
                }
            },
        }),

        getUserAdverts: builder.query<IAdvert[], void>({
            query: () => ({
                url: `get/user`,
                method: "GET",
            }),
            providesTags: ["Adverts"],
        }),

        getAdvertsByUserId: builder.query<IAdvert[], number>({
            query: (userId) => ({
                url: `get/user/${userId}`,
                method: "GET",
            }),
            providesTags: ["Adverts"],
        }),
    }),
});

export const {
    useCreateAdvertMutation,
    useUpdateAdvertMutation,
    useDeleteAdvertMutation,
    useBlockAdvertMutation,
    useApproveAdvertMutation,
    useGetUserAdvertsQuery,
    useGetAdvertsByUserIdQuery,
} = advertAuthApi;
