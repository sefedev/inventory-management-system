"use client";
import Header from "../../components/Header";
import React, { useState } from "react";

const CreateProductModal = ({ isOpen, onClose, isLoading, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);

    setFormData({
      name: "",
      price: 0,
    })
    console.log(formData)
  };

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-mb";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 overflow-y-auto size-full z-20">
      <div className="relative top-20 mx-auto p-5 w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">

          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price{" "}
          </label>
          <input
            type="number"
            name="price"
            placeholder="price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 ml-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
