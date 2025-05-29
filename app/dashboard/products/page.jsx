"use client";

import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Loader,
  Plus,
  PlusCircleIcon,
  SearchIcon,
  SearchX,
  SearchXIcon,
} from "lucide-react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useGetProductsBySearchQuery,
} from "../../../state/api";
import Header from "../../components/Header";
import CreateProductModal from "./CreateProductModal";
import { priceFormatter } from "@/utils/helper";
import { toast, ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const session = useSession();

  const userId = session?.data?.user?.id;

  const {
    data: products = [],
    isError,
    error,
    isLoading,
    refetch,
  } = useGetProductsBySearchQuery(
    userId ? { search: searchTerm, userId } : null,
    { skip: !userId }
  );

  
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  
  const handleCreateProduct = async (productData) => {
    setIsModalOpen(false);
    try {
      await createProduct(productData).unwrap();
      refetch();

      toast.success("Product has been created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error Creating product:", error);
    }
  };

  return (
    <div className="mx-auto pb-5 w-full max-w-7xl">
      <ToastContainer />
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-150"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Product
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
          <SearchIcon className="w-5 h-5 text-gray-500 mx-3" />
          <input
            className="w-full py-2 px-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* LOADING UI */}
      {isLoading && !isModalOpen && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <Loader className="h-10 w-10 animate-spin mb-4 text-blue-500" />
          <p className="text-lg font-medium">Loading products...</p>
        </div>
      )}

      {/* FAILED TO FETCH PRODUCT ERROR UI */}
      {isError && !isModalOpen && (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <SearchX className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            Failed to fetch products
          </p>
          <p className="text-gray-500 text-sm mb-6">{error?.data}</p>
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-150"
            onClick={() => refetch()}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Retry
          </button>
        </div>
      )}

      {/* NO PRODUCT ERROR UI */}
      {/* {allProducts?.length === 0 && (
        <div className="flex w-full flex-col items-center justify-center text-center py-10">
          <Plus className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            No Products Available
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Add a product to get started.
          </p>
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-150"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Product
          </button>
        </div>
      )} */}

      {/* NO SEARCH RESULT UI */}
      {!isLoading && products?.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-6">
          <SearchXIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No matching products found. Try searching with a different keyword.
          </p>
          <div className="grid place-items-center">
            <p className="text-gray-500 text-sm mb-6">
              If you dont have a Product. Add a product to get started.
            </p>
            <button
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-150"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" /> Add Product
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS GRID */}
      {products?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* {products?.map((product) => (
            <div
              key={product.productId}
              className="border flex justify-between items-center border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition duration-150 relative"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">{priceFormatter(product.price)}</p>
              </div>
            </div>
          ))} */}

          {products?.map((product) => (
            <div
              key={product.productId}
              className="border flex flex-col justify-between border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition duration-150 relative"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">{priceFormatter(product.price)}</p>
              </div>
              <div className="mt-4">
                <p
                  className={`font-medium ${
                    product.stockAvailable > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stockAvailable > 0
                    ? `${product.stockAvailable} in stock`
                    : "Out of stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isLoading) setIsModalOpen(false);
        }}
        onCreate={handleCreateProduct}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Products;
