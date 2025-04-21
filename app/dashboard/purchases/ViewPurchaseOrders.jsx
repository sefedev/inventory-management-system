import { priceFormatter } from "@/utils/helper";
import { DataGrid } from "@mui/x-data-grid";

const ViewPurchaseOrders = ({ setSelectedPurchase, purchases }) => {
  
  // Define columns for the DataGrid
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

  if (!purchases || purchases.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4 ">Purchase Orders</h2>
        <p className="bg-white shadow p-4 rounded-lg">No purchase orders available.</p>
      </div>
    );
  }

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
