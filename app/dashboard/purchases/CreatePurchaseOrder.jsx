import { useCreatePurchaseMutation, useGetProductsBySearchQuery, useGetProductsQuery } from "@/state/api";
import { priceFormatter } from "@/utils/helper";
import { LoaderCircle, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const CreatePurchaseOrder = () => {
  const [productList, setProductList] = useState([]); //purchase order product List
  const [product, setProduct] = useState({
    name: "",
    quantity: 0,
    unitPrice: 0,
  }); //product from Input
  const [productError, setProductError] = useState(false);
  const [isLoading, setIsLoading] =useState(false)

const session = useSession();
  
  const userId = session?.data?.user?.id;

  // Fetch products from the backend
  const {
    data: products = [],
    isLoading: isProductsLoading,
    refetch,
  } = useGetProductsBySearchQuery(userId ? { search: '', userId } : null,
    { skip: !userId });


  const [createPurchase] = useCreatePurchaseMutation();

  console.log(productList, "PURCHASE ORDER LIST");

  const totalCost = productList.reduce(
    (sum, product) => sum + product.totalCost,
    0
  );

  const handleAddProduct = () => {
    if (!product.name || product.quantity <= 0 || product.unitPrice <= 0)
      return setProductError(true);
    const selectedProduct = products.find((p) => p.name === product.name);
    setProductList([
      ...productList,
      {
        ...product,
        productId: selectedProduct.productId,
        totalCost: product.quantity * product.unitPrice,
      },
    ]);
    setProduct({ name: "", quantity: 0, unitPrice: 0 });
  };

  const handleRemoveProduct = (index) => {
    setProductList(productList.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = async () => {
    setIsLoading(true)
    const purchaseItems = productList.map(({ productId, quantity, unitPrice }) => ({
      productId,
      quantity,
      unitPrice,
      itemTotal: quantity * unitPrice
    }));
    console.log(purchaseItems, "THE PURCHASE ITEMS")
    try {
      const response = await createPurchase({userId, purchaseItems})
      toast.success("Purchase Created Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      refetch()
      console.log("Purchase Created", response)
    } catch (error) {
      console.error("Cannot create Purchase:", error)
       toast.error(error, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
    } finally {
      setProductList([])
      setIsLoading(false)
    }

  };

  return (
    <div className="mt-6 md:flex-row flex-col gap-12 items-start flex">
      <ToastContainer />
      {/* CREATE PURCHASE ORDER */}
      <div className="space-y-4 flex-1 border h-96 border-gray-300 rounded w-full md:max-w-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Create Purchase Order</h2>

        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
          <select
            id="productName"
            value={product.name}
            onChange={(e) => {
              setProductError(false);
              setProduct({ ...product, name: e.target.value });
            }}
            className="mt-1.5 w-full px-3 py-2 border border-gray-500 rounded"
          >
            <option value="" disabled>
              Select a Product
            </option>
            {products?.map((p) => (
              <option key={p.productId} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
          <input
            type="number"
            placeholder="Quantity"
            value={product.quantity}
            onChange={(e) => {
              setProductError(false);
              setProduct({ ...product, quantity: parseInt(e.target.value) });
            }}
            className="mt-1.5 w-full px-3 py-2 border border-gray-500 rounded"
          />
        </label>

        <label
          htmlFor="unitCost"
          className="block text-sm font-medium text-gray-700"
        >
          Unit Cost
          <input
            type="number"
            placeholder="Unit Cost"
            value={product.unitPrice}
            onChange={(e) => {
              setProductError(false);
              setProduct({ ...product, unitPrice: parseFloat(e.target.value) });
            }}
            className="mt-1.5 w-full px-3 py-2 border border-gray-500 rounded"
          />
        </label>

        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Product
        </button>
        {productError && (
          <p className="text-xs font-extralight text-red-500">
            Please ensure all fields are filled correctly
          </p>
        )}
      </div>

      {/* PURCHASE ORDER LIST */}
      <div className="flex-1 md:max-w-xl w-full">
        {/* List */}
        <div className="border border-gray-300 overflow-y-scroll rounded max-h-96 p-4">
          <h3 className="text-lg font-semibold mb-4">Products in Order</h3>
          <ul className="space-y-2 rounded">
            {productList.length === 0 && (
              <p className="text-center text-gray-500">
                No Purchase Order has been added
              </p>
            )}
            {productList.map((p, index) => (
              <li
                key={index}
                className="flex justify-between gap-4 items-center shadow py-4 px-2 rounded"
              >
                <span className="flex-1 font-medium">{p.name}</span>
                <span>
                  {p.quantity} x {priceFormatter(p.unitPrice)} =
                  {priceFormatter(p.totalCost)}
                </span>
                <button
                  onClick={() => handleRemoveProduct(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* total price */}
        <div className="flex justify-between items-center mt-8">
          {productList.length > 0 && (
            <>
              <h3 className="font-semibold text-lg">
                Total Cost = {priceFormatter(totalCost)}{" "}
              </h3>
              <button
                onClick={handleSubmitOrder}
                className={`flex gap-1 items-center px-4 py-2 bg-green-700 text-lg hover:bg-green-600 duration-150 transition-all text-white rounded ${isLoading && 'opacity-50'}`}
                disabled={isLoading}
              >
                <span>Submit</span>
                {isLoading && <LoaderCircle className="animate-spin size-6"/>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
