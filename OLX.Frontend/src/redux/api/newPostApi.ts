import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";
import { ISettlement } from "../../models/newPost";

export const newPostApi = createApi({
  reducerPath: "newPostApi",
  baseQuery: createBaseQuery("NewPost"),
  tagTypes: ["NewPost", "Areas", "Regions", "Settlements", "Settlement"],

  endpoints: (builder) => ({
    getAreas: builder.query<any[], void>({
      query: () => {
        return {
          url: `areas`,
          method: "GET",
        };
      },
      providesTags: ["Areas"],
    }),

    getRegionsByArea: builder.query({
      query: (areaRef) => {
        return {
          url: `areas/regions?areaRef=${areaRef}`,
          method: "GET",
        };
      },
      providesTags: ["Regions"],
    }),

    getSettlementsByRegion: builder.query({
      query: (regionRef) => {
        return {
          url: `region/settlements?regionRef=${regionRef}`,
          method: "GET",
        };
      },
      providesTags: ["Settlements"],
    }),

    getSettlementsById: builder.query<ISettlement, string>({
      query: (settlementsId) => {
        return {
          url: `settlements?settlementRef=${settlementsId}`,
          method: "GET",
        };
      },
      providesTags: ["Settlement"],
    }),
  }),
});

export const {
  useGetAreasQuery,
  useGetRegionsByAreaQuery,
  useGetSettlementsByRegionQuery,
  useGetSettlementsByIdQuery
} = newPostApi;