import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Users", "Products"],
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => "/users/get-users",
      providesTags: ["Users"],
    }),
    createUser: build.mutation({
      query: (user) => ({
        url: "/users/create-user",
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
  }),
});

export const { useGetUsersQuery, useCreateUserMutation, useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation } = api;
