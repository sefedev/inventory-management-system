import { priceFormatter } from "@/utils/helper";
import { DataGrid } from "@mui/x-data-grid";

const ViewPurchaseOrders = ({ setSelectedPurchase, purchases }) => {

  console.log(purchases, status);
  const _purchases = [
    { id: 1, purchaseId: "PO123", timestamp: "2025-04-01", totalCost: 500 },
    { id: 2, purchaseId: "PO124", timestamp: "2025-04-02", totalCost: 300 },
  ];

  const columns = [
    { field: "purchaseId", headerName: "Purchase ID", width: 150 },
    { field: "timestamp", headerName: "Date & Time", width: 200,
      valueFormatter: (params) =>
        new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "numeric",
          hour12: true
        }).format(new Date(params)),
     },
    {
      field: "totalAmount",
      headerName: "Total Cost",
      width: 150,
      valueFormatter: (totalCost) => priceFormatter(totalCost),
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Purchase Orders</h2>
      <DataGrid
        rows={purchases}
        columns={columns}
        getRowId={(row) => row.purchaseId}
        onRowClick={(params) => setSelectedPurchase(params.row.purchaseId)}
        className="bg-white shadow rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default ViewPurchaseOrders;
