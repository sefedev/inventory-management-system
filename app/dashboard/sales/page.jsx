"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Receipt,
  History,
} from "lucide-react";
import Header from "@/app/components/Header";
import {
  useGetProductsQuery,
  useCreateSaleMutation,
  useGetSalesQuery,
} from "@/state/api";
import { priceFormatter } from "@/utils/helper";
import ViewSalesOrder from "./ViewSalesOrder";
import SaleDetailsModal from "./SaleDetailModal";
import { toast, ToastContainer } from "react-toastify";

export default function SalesPage() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSales, setSelectedSales] = useState(null); // For modal details
  const [activeTab, setActiveTab] = useState("pos");

  // Fetch products from the backend
  const {
    data: products = [],
    isLoading: isProductsLoading,
    refetch,
  } = useGetProductsQuery();

  // Fetch sales history from the backend
  const { data: salesHistory = [], isLoading: isSalesLoading } =
    useGetSalesQuery();

  // Mutation to create a sale
  const [createSale, { isLoading: isCreatingSale }] = useCreateSaleMutation();

  // Add product to cart
  const addToCart = (product) => {
    if (product.stockAvailable <= 0) {
      toast.error("Product is Out of Stock", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.productId === product.productId
      );
      if (existingItem) {
        // Update the quantity of the existing item & check stock availability
        if (existingItem.quantity >= product.stockAvailable) {
          toast.error("Cannot add more items than available in stock.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return currentCart;
        }
        return currentCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add the new product to the cart
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  // Update product quantity in cart
  const updateQuantity = (productId, change) => {

    //check stock availability
    const product = products.find((item) => item.productId === productId);
    const stockAvailable = product?.stockAvailable || 0;
    const currentItem = cart.find((item) => item.productId === productId);
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    if (currentQuantity + change > stockAvailable) {
      toast.error("Cannot add more items than available in stock.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculate total cost of the cart
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Complete the sale
  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty. Add items to the cart before completing the sale.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const saleData = {
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    try {
      await createSale(saleData).unwrap();
      refetch();
      toast.success("Sales Created Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCart([]); // Clear the cart after successful sale
    } catch (error) {
      console.error("Failed to complete sale:", error);
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full mx-auto md:px-8">
      <ToastContainer />
      <Header name="Sales" />
      {/* TAB NAVIGATION */}
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
        // POS

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

            {isProductsLoading ? (
              <p>Loading products...</p>
            ) : (
              // PRODUCTS LIST
              <div className="h-[500px] overflow-auto pr-4">
                <div className="grid grid-cols-1 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.productId}
                      role="button"
                      className="p-4 shadow border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-700">
                            Stock: {product.stockAvailable}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {priceFormatter(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Current Sale
            </h2>

            {/* Cart List */}
            <div className="max-h-[400px] overflow-auto pr-4">
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <p className="my-4 text-gray-500 text-center">
                    No item in the cart...
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 border shadow border-gray-300 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {priceFormatter(item.price)} each
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => updateQuantity(item.productId, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => updateQuantity(item.productId, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 hover:bg-red-100 text-red-500 rounded"
                            onClick={() =>
                              updateQuantity(item.productId, -item.quantity)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Total and complete Sales button */}
            {cart.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-semibold">
                  <span>Total:</span>
                  <span>{priceFormatter(calculateTotal())}</span>
                </div>
                <button
                  onClick={handleCompleteSale}
                  disabled={isCreatingSale}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    isCreatingSale
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <Receipt className="h-5 w-5" />
                  {isCreatingSale ? "Processing..." : "Complete Sale"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // SALES HISTORY

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isSalesLoading ? (
            <p>Loading sales history...</p>
          ) : (
            <div className="p-4">
              {salesHistory.length === 0 ? (
                <p>No sales history available.</p>
              ) : (
                <div className="max-h-[400px] overflow-auto pr-4">
                  <ViewSalesOrder
                    setSelectedSales={setSelectedSales}
                    sales={salesHistory}
                  />
                  {selectedSales && (
                    <SaleDetailsModal
                      sale={salesHistory?.find(
                        (sale) => sale.saleId === selectedSales
                      )}
                      onClose={() => setSelectedSales(null)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
