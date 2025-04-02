import { priceFormatter } from "@/utils/helper";

const PurchaseDetailsModal = ({ purchase, onClose }) => {
  const date = (dd) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "numeric",
      hour12: true,
    }).format(new Date(dd));

  return (
    <div className="fixed overflow-hidden inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-h-[32rem] overflow-y-scroll rounded-lg shadow-lg p-6 w-full max-w-md">

        {/* PURCHASE ORDER HEADER */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Purchase Details
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">Purchase ID:</strong>{" "}
              {purchase.purchaseId}
            </p>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">Date & Time:</strong>{" "}
              {date(purchase.timestamp)}
            </p>
          </div>
        </div>

        {/* PURCHASE PRODUCT LIST */}
        <ul className="divide-y divide-gray-300">
          {purchase.purchaseItems.map(
            ({ purchaseItemId, product, itemTotal, quantity, unitPrice }) => (
              <li
                key={purchaseItemId}
                className="flex justify-between items-center py-4 px-2 hover:bg-gray-100 transition-all duration-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Unit Price: {priceFormatter(unitPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">Qty: {quantity}</p>
                  <p className="text-sm text-gray-500">
                    Total: {priceFormatter(itemTotal)}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>

{/* TOTAL AMOUNT */}
        <p className="text-right text-lg text-gray-600">
          <strong className="text-gray-800">Total Cost:</strong>
          <span className="text-green-600 font-semibold">
            {" "}
            {priceFormatter(purchase.totalAmount)}
          </span>
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 hover:bg-red-400 transition-all duration-200 bg-red-500 text-white rounded"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 hover:bg-blue-400 transition-all duration-200 bg-blue-500 text-white rounded"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailsModal;
