"use client";

import React, { useEffect, useState } from "react";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
} from "../../../state/api";
import Header from "../../components/Header";
import CreateProductModal from "./CreateProductModal";
import { priceFormatter } from "@/utils/helper";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
 // const [activeDropdown, setActiveDropdown] = useState(null);

  const {
    data: products,
    isError,
    error,
    isLoading,
    refetch,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();

  useEffect(() => {
    console.log(products);
  }, [products]);

  // const toggleDropdown = (productId) => {
  //   setActiveDropdown((prev) => (prev === productId ? null : productId));
  // };

  // const isDropdownOpen = (productId) => activeDropdown === productId;

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData).unwrap();
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error Creating product:", error);
    }
  };

  if (isLoading && !isModalOpen) {
    return <div className="py-4 text-center text-gray-500">Loading...</div>;
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
    <div className="mx-auto pb-5 w-full max-w-7xl">
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

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div
            key={product.productId}
            className="border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-lg transition duration-150 relative"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">
                  {priceFormatter(product.price)}
                </p>
              </div>
              {/* 3-dot menu */}
              {/* <div className="relative">
                <button
                  className="text-gray-500 font-bold text-2xl hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleDropdown(product.productId)}
                >
                  &#x22EE;
                </button>
                {isDropdownOpen(product.productId) && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      onClick={() => handleDeleteProduct(product.productId)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        ))}
      </div>

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
