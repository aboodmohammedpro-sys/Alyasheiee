import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Orders" description="PO status tracker and document preview surface for approved procurement workflows." />
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row">
          <div className="flex-1 space-y-3">
            {["PO-2026-0441", "PO-2026-0442", "PO-2026-0443"].map((po, index) => (
              <div key={po} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-mono text-sm font-semibold">{po}</p>
                  <p className="text-xs text-muted-foreground">Supplier delivery milestone {index + 1}</p>
                </div>
                <Badge tone={index === 0 ? "info" : "warning"}>{index === 0 ? "In Transit" : "Pending"}</Badge>
              </div>
            ))}
          </div>
          <div className="min-h-72 flex-1 rounded-lg border border-dashed border-border bg-muted p-5">
            <p className="font-mono text-xs text-muted-foreground">Document preview</p>
            <h2 className="mt-4 text-xl font-bold">Purchase Order</h2>
            <p className="mt-2 text-sm text-muted-foreground">PDF-ready preview layout reserved for backend document generation.</p>
            <Button className="mt-6" variant="outline">Download PDF</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
