import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/ui/Button";

const transactions = [
  { id: "TX-2026-0401", type: "Receipt", source: "Arabian Steel Co.", destination: "Central Stores", status: "Received" },
  { id: "TX-2026-0414", type: "Transfer", source: "Central Stores", destination: "North Field Depot", status: "In Transit" },
  { id: "TX-2026-0420", type: "Adjustment", source: "Stocktake", destination: "Central Stores", status: "Pending Review" },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Transactions"
        description="Ledger list for receipts, transfers, write-offs, and stock adjustments."
        actions={
          <>
            <ButtonLink href="/inventory/transactions/receipt" variant="accent">New Receipt</ButtonLink>
            <ButtonLink href="/inventory/transactions/transfer" variant="outline">New Transfer</ButtonLink>
          </>
        }
      />
      <DataTable
        columns={[
          { accessorKey: "id", header: "Transaction", meta: { mono: true } },
          { accessorKey: "type", header: "Type" },
          { accessorKey: "source", header: "Source" },
          { accessorKey: "destination", header: "Destination" },
          { accessorKey: "status", header: "Status" },
        ]}
        data={transactions}
      />
    </div>
  );
}
