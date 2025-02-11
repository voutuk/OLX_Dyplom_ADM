import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";

export const newPostApi = createApi({
  reducerPath: "newPostApi",
  baseQuery: createBaseQuery("NewPost"),
  tagTypes: ["NewPost"],

  endpoints: (builder) => ({
    getAreas: builder.query({
      query: () => {
        return {
          url: `areas`,
          method: "GET",
        };
      }
    }),

    getRegionsByArea: builder.query({
      query: (areaRef) => {
        return {
          url: `areas/regions?areaRef=${areaRef}`,
          method: "GET",
        };
      },
    }),

    getSettlementsByRegion: builder.query({
      query: (regionRef) => {
        return {
          url: `region/settlements?regionRef=${regionRef}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetAreasQuery,
  useGetRegionsByAreaQuery,
  useGetSettlementsByRegionQuery,
} = newPostApi;