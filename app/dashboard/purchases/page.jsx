'use client'

import React, { useState } from "react";
import Header from "@/app/components/Header";
import CreatePurchaseOrder from "./CreatePurchaseOrder";
import ViewPurchaseOrders from "./ViewPurchaseOrders";
import PurchaseDetailsModal from "./PurchaseDetailsModal";
import { useGetPurchasesQuery } from "@/state/api";
import { useSession } from "next-auth/react";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("create"); // "create" or "view"
  const [selectedPurchase, setSelectedPurchase] = useState(null); // For modal details

  const { data: session } = useSession(); // Get session data
  const userId = session?.user?.id; // Extract userId from session

  const { data: purchases } = useGetPurchasesQuery(userId ? userId : null, {
    skip: !userId,
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  console.log(purchases, "VIEW PURCHASES")


  const _selectedPurchase = purchases?.filter((purchase) => purchase.purchaseId === selectedPurchase)[0]

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