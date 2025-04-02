'use client'

import React, { useState } from "react";
import Header from "@/app/components/Header";
import CreatePurchaseOrder from "./CreatePurchaseOrder";
import ViewPurchaseOrders from "./ViewPurchaseOrders";
import PurchaseDetailsModal from "./PurchaseDetailsModal";
import { useGetPurchasesQuery } from "@/state/api";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("create"); // "create" or "view"
  const [selectedPurchase, setSelectedPurchase] = useState(null); // For modal details

  const { data: purchases } = useGetPurchasesQuery();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  const _selectedPurchase = purchases?.filter((purchase) => purchase.purchaseId === selectedPurchase)[0]
  console.log(_selectedPurchase, "THE SELECTED PURCHASES")

  return (
    <div className="flex flex-col">
      <Header name="Purchases" />
      <div className="flex space-x-4 mt-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "create" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleTabChange("create")}
        >
          Create Purchase Order
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "view" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleTabChange("view")}
        >
          View Purchase Orders
        </button>
      </div>

      {activeTab === "create" ? <CreatePurchaseOrder /> : <ViewPurchaseOrders setSelectedPurchase={setSelectedPurchase} purchases={purchases} />}
      {selectedPurchase && <PurchaseDetailsModal purchase={_selectedPurchase} onClose={() => setSelectedPurchase(null)} />}
    </div>
  );
};

export default Purchases;