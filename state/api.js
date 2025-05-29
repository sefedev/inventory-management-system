import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Users", "Products", "Purchases", "Sales", "DashboardMetrics"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => "api/users/get-users",
      providesTags: ["Users"],
    }),
    createUser: build.mutation({
      query: (user) => ({
        url: "api/users/create-user",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    getProductsBySearch: build.query({
      query: ({ search, userId }) =>
        `/api/products/get-products?search=${search || ""}&userId=${
          userId || ""
        }`,
      providesTags: ["Products"],
    }),
    getProducts: build.query({
      query: () => "/api/products/get-products",
      providesTags: ["Products"],
    }),
    createProduct: build.mutation({
      query: (newProduct) => ({
        url: "/api/products/create-product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    getPurchases: build.query({
      query: (userId) => `/api/purchases/get-purchases?userId=${userId || ""}`,
      providesTags: ["Purchases"],
    }),
    createPurchase: build.mutation({
      query: (newPurchase) => ({
        url: "/api/purchases/create-purchase",
        method: "POST",
        body: newPurchase,
      }),
      invalidatesTags: ["Purchases"],
    }),
    getSales: build.query({
      query: (userId) => `/api/sales/get-sales?userId=${userId || ""}`,
      providesTags: ["Sales"],
    }),
    createSale: build.mutation({
      query: (newSale) => ({
        url: "/api/sales/create-sale",
        method: "POST",
        body: newSale,
      }),
      invalidatesTags: ["Sales"],
    }),
    getPopularProducts: build.query({
      query: ({userId}) =>
        `/api/dashboard-metrics/popular-products?userId=${userId || ""}`,
      providesTags: ["DashboardMetrics"],
    }),
    getSalesSummary: build.query({
      query: () => "/api/dashboard-metrics/sale-summary",
      providesTags: ["DashboardMetrics"],
    }),
    getPurchaseSummary: build.query({
      query: () => "/api/dashboard-metrics/purchase-summary",
      providesTags: ["DashboardMetrics"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useGetProductsBySearchQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useGetSalesQuery,
  useCreateSaleMutation,
  useGetSalesSummaryQuery,
  useGetPopularProductsQuery,
  useGetPurchaseSummaryQuery,
} = api;
