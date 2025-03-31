"use client";

import Header from "@/app/components/Header";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "purchaseId", headerName: "ID", width: 90 },
  { field: "productId", headerName: "ID", width: 90 },
  { field: "timestamp", headerName: "Date & Time", width: 200 },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 110,
    type: "number",
  },
  {
    field: "unitCost",
    headerName: "Unit Cost",
    width: 110,
    type: "number",
    valueGetter: (value, row) => `$${row.unitCost}`,
  },
  {
    field: "totalCost",
    headerName: "Total Cost",
    width: 150,
    type: "number",
  },
];

const Purchases = () => {
  
  const purchases = []
  const isError = false
  const isLoading = false
  
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !purchases) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch Purchases
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Purchases" />
      <DataGrid rows={purchases} columns={columns} getRowId={(row) => row.productId} checkboxSelection className="bg-white shadow rounded-lg border boder-gray-200 mt-5 !text-gray-700"/>
    </div>
  );
};

export default Purchases;
