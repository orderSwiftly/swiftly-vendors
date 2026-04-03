import type { Metadata } from "next";
import TransactionsOverviewClient from "@/components/transactions/TransactionsOverviewClient";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function TransactionsPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto pry-ff">
      <TransactionsOverviewClient />
    </main>
  );
}
