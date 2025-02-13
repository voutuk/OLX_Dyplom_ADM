import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "./baseQuery";
import { IAdvert, IAdvertCreationModel } from "../../models/advert";
import { advertApi } from "./advertApi";
import { getFormData } from "../../utilities/common_funct";

export const advertAuthApi = createApi({
    reducerPath: "advertAuthApi",
    baseQuery: createBaseQueryWithAuth("Advert"),
    tagTypes: ["Adverts","UserAdvert"],

    endpoints: (builder) => ({
        createAdvert: builder.mutation<void, IAdvertCreationModel>({
            query: (creationModel) => ({
                url: `create`,
                method: "PUT",
                body: getFormData(creationModel),
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["NotApproved"]))
                } catch (error) {
                    console.error('Create advert failed:', error);
                }
            },
        }),

        updateAdvert: builder.mutation<void, IAdvertCreationModel>({
            query: (creationModel) => ({
                url: `update`,
                method: "POST",
                body: getFormData(creationModel),
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts","Locked","NotApproved","Advert"]))
                } catch (error) {
                    console.error('Update advert failed:', error);
                }
            },
            invalidatesTags:["UserAdvert"]
        }),

        deleteAdvert: builder.mutation<void, number>({
            query: (id) => ({
                url: `delete/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts","Locked","NotApproved","Advert"]))
                } catch (error) {
                    console.error('Delete advert failed:', error);
                }
            },
            invalidatesTags:["UserAdvert"]
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
                    dispatch(advertApi.util.invalidateTags(["Adverts","Locked","NotApproved"]))
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
                    dispatch(advertApi.util.invalidateTags(["Adverts","NotApproved"]))
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
            providesTags: ["UserAdvert"],
        }),

        getAdvertsByUserId: builder.query<IAdvert[], number>({
            query: (userId) => ({
                url: `get/user/${userId}`,
                method: "GET",
            }),
            providesTags: ["UserAdvert"],
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
