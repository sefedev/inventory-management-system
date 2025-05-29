"use client";

import { useGetPopularProductsQuery } from "@/state/api";
import { priceFormatter } from "@/utils/helper";
import { LoaderCircle, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";

const CardPopularProducts = () => {
  // Mock data for demonstration purposes
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    data: popularProducts,
    isLoading,
    isError,
  } = useGetPopularProductsQuery(userId ? { userId } : {}, { skip: !userId });

  return (
    <div className="row-span-3 xl:row-span-6 grid place-items-center bg-white shadow-md rounded-2xl pb-8">
      {isLoading ? (
        <div className=" text-center flex flex-col items-center justify-center">
          <LoaderCircle className="animate-spin" />
          Loading Popular Products...
        </div>
      ) : (
        <div className="w-full">
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Popular Products
          </h3>
          <hr />
          <div className="overflow-auto h-[350px]">
            {popularProducts.length > 0 ? (
              popularProducts.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between px-5 py-4 border-b"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700">
                      {product.name}
                    </span>
                    <span className="text-sm text-blue-500">
                      {priceFormatter(product.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Total Sold:{" "}
                      {priceFormatter(product.totalAccumulatedAmount)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock Quantity: {product.stockQuantity}
                    </span>
                  </div>
                  <div className="text-xs flex items-center">
                    <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                      <ShoppingBag className="size-4" />
                    </button>
                    {product.totalQuantitySold} Sold
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-5">
                No popular products available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPopularProducts;
