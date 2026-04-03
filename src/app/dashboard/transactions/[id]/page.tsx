import type { Metadata } from "next";
import TransactionsPageClient from "@/components/transactions/TransactionsPageClient";

export const metadata: Metadata = {
  title: "Transaction History",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TransactionHistoryPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="p-6 max-w-6xl mx-auto pry-ff">
      <TransactionsPageClient storeId={id} />
    </main>
  );
}
