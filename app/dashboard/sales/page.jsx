"use client";

import { useState } from "react";
import { Search, ShoppingCart, Plus, Minus, Trash2, Receipt, History } from "lucide-react";
import Header from "@/app/components/Header";

export default function SalesPage() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pos");

  // Mock data - replace with actual data from your backend
  const products = [
    { id: "1", name: "Product 1", price: 19.99, stock: 50 },
    { id: "2", name: "Product 2", price: 29.99, stock: 30 },
    { id: "3", name: "Product 3", price: 39.99, stock: 20 },
  ];

  const salesHistory = [
    {
      id: "S1",
      date: "2024-03-20 14:30",
      items: [{ ...products[0], quantity: 2 }],
      total: 39.98,
    },
    {
      id: "S2",
      date: "2024-03-20 15:45",
      items: [{ ...products[1], quantity: 1 }],
      total: 29.99,
    },
  ];

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full mx-auto md:px-8">
      <Header name="Sales"/>
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "pos"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("pos")}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Point of Sale</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "history"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Sales History</span>
            </div>
          </button>
        </div>
      </div>

      {activeTab === "pos" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="h-[500px] overflow-auto pr-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </p>
                      </div>
                      <p className="font-semibold">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Current Sale
            </h2>

            <div className="h-[400px] overflow-auto pr-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${item.price} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 hover:bg-red-100 text-red-500 rounded"
                          onClick={() => updateQuantity(item.id, -item.quantity)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center text-xl font-semibold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
                <Receipt className="h-5 w-5" />
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesHistory.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {sale.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                  <td className="px-6 py-4">
                    {sale.items
                      .map((item) => `${item.quantity}x ${item.name}`)
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    ${sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}