import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Users", "Products", "Purchases"],
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
      invalidatesTags: ["Users"]
    }),
    getProducts: build.query({
      query:(searchTerm) => `/api/products/get-products?search=${searchTerm || ""}`,
      providesTags: ["Products"],
    }),
    createProduct: build.mutation({
      query: (newProduct) => ({
        url: "/api/products/create-product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"]
    }),
    getPurchases: build.query({
      query:() => "/api/purchases/get-purchases",
      providesTags: ['Purchases']
    }),
    createPurchase: build.mutation({
      query: (newPurchase) => ({
        url: "/api/purchases/create-purchase",
        method: "POST",
        body: newPurchase,
      }),
      invalidatesTags: ["Purchases"]
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation, useGetProductsQuery, useCreateProductMutation, useGetPurchasesQuery, useCreatePurchaseMutation } = api;
