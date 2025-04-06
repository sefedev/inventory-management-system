import { priceFormatter } from '@/utils/helper';
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'

const ViewSalesOrder = ({setSelectedSales, sales}) => {

     const columns = [
        { field: "saleId", headerName: "Sale ID", width: 150 },
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
          headerName: "Total Sale",
          width: 150,
          valueFormatter: (totalSale) => priceFormatter(totalSale),
        },
      ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Sales Orders</h2>
      <DataGrid
      rows={sales}
        columns={columns}
        getRowId={(row) => row.saleId}
        onRowClick={(params) => setSelectedSales(params.row.saleId)}
        className="bg-white shadow rounded-lg border border-gray-200"
        />
    </div>
  )
}

export default ViewSalesOrder
