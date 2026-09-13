import React from "react";
import type { Metadata } from "next";
import { getCurrentCustomerAction } from "@/app/actions/customers";
import { getCustomerOrdersAction } from "@/app/actions/orders";
import { CustomerOrdersClient } from "./CustomerOrdersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "My Order History | Prasanthi Craft",
  description: "View and track your previous purchases, express courier deliveries, and order summaries on Prasanthi Craft.",
};

export default async function CustomerOrdersPage() {
  const [customer, ordersRes] = await Promise.all([
    getCurrentCustomerAction(),
    getCustomerOrdersAction(),
  ]);

  return (
    <CustomerOrdersClient 
      customer={customer} 
      initialOrders={ordersRes.orders || []} 
    />
  );
}
