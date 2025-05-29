"use client";

import CardPopularProducts from "../components/ui/CardPopularProducts";
import CardSalesSummary from "../components/ui/CardSalesSummary";
import CardPurchaseSummary from "../components/ui/CardPurchaseSummary";
import { useSession } from "next-auth/react";
import { useCreateUserMutation } from "@/state/api";
import { useEffect } from "react";

const Dashboard = () => {
    const { data: session } = useSession();
  const [createUser] = useCreateUserMutation();

  useEffect(() => {
    if (session?.user) {
      const userData = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        emailVerified: new Date().toISOString(),
      };
      createUser(userData)
        .unwrap()
        .then((response) => {
          // Optionally handle response
          console.log(response, "User Created Succesfully")
        })
        .catch((error) => {
          // Optionally handle error
           console.error("Error creating user:", error);
        });
    }
  }, [session, createUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      {/* <CardSalesSummary /> */}
      <CardPurchaseSummary />
      <>
      {/* <StatCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-blue-600 size-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Customer Growth",
            amount: "175.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: "10.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
       <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-600 size-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Dues",
            amount: "250.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Order",
            amount: "147",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
       <StatCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-blue-600 size-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Sales",
            amount: "1000.00",
            changePercentage: 20,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: "200.00",
            changePercentage: -10,
            IconComponent: TrendingDown,
          },
        ]}
      /> */}
      </>
      </div>
  );
};

export default Dashboard;
