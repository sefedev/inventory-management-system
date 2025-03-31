"use client";

import React, { useState } from "react";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
} from "../../../state/api";
import Header from "../../components/Header";
import CreateProductModal from "./CreateProductModal";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: products,
    isError,
    error,
    isLoading,
    refetch
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();



  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData).unwrap();
      refetch()
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error Creating product:", error);
    }
  };


  if (isLoading && !isModalOpen) {
    return <div className="py-4">Loading...</div>;
  }


  if (isError || !products) {
    console.log(error);
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="size-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white "
            placeholder="Search Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}

      <div className="flex justify-between items mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 transition duration-150 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="size-5 mr-2 !text-gray-200" /> Create
          Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-col-2 lg:grid-col-3 gap-10 justify-between">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products?.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center">
                img
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800">{product.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => {
         if(!isLoading) setIsModalOpen(false)
        }}
        onCreate={handleCreateProduct}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Products;
