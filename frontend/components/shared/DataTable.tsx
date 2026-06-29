"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnDef,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { toneForStatus } from "@/lib/design-data";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Settings2, Download, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { TableSkeleton } from "@/components/ui/Skeleton";
import { useTranslations, useLocale } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  statusKey?: string;
  className?: string;
  enableSelection?: boolean;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  statusKey = "status",
  className,
  enableSelection = true,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const t = useTranslations("table");
  const app = useTranslations("app");
  const locale = useLocale();
  const isRTL = locale === "ar";

  if (isLoading) return <TableSkeleton />;
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className={`flex items-center justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="flex flex-1 items-center gap-2">
          <input
            placeholder={t("searchPlaceholder")}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className={`h-9 w-[250px] rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-all focus:border-accent focus:ring-4 focus:ring-accent/10 md:w-[350px] ${isRTL ? "text-right" : ""}`}
          />
        </div>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button variant="outline" className="h-9 px-3 gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="hidden md:inline">{isRTL ? "الأعمدة" : "Columns"}</span>
          </Button>
          <Button variant="outline" className="h-9 px-3 gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">{app("export")}</span>
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className={`min-w-full border-collapse text-sm ${isRTL ? "text-right" : "text-left"}`}>
            <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm text-xs uppercase text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {enableSelection && (
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                      />
                    </th>
                  )}
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap px-4 py-3 font-bold cursor-pointer select-none transition-colors hover:text-foreground"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition-colors hover:bg-muted/60",
                      row.getIsSelected() && "bg-accent/5 hover:bg-accent/10"
                    )}
                  >
                    {enableSelection && (
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={row.getIsSelected()}
                          onChange={row.getToggleSelectedHandler()}
                          className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                        />
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => {
                      const isStatus = cell.column.id === statusKey;
                      const value = cell.getValue() as string;
                      const meta = (cell.column.columnDef as any).meta;

                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            "h-11 whitespace-nowrap px-4 py-2",
                            meta?.mono ? "font-mono text-xs tabular-nums" : "",
                            meta?.align === (isRTL ? "right" : "left") ? "text-right" : meta?.align === (isRTL ? "left" : "right") ? "text-left" : ""
                          )}
                        >
                          {isStatus ? (
                            <Badge tone={toneForStatus(value)}>{value}</Badge>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="h-32 text-center text-muted-foreground">
                    {t("noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={`flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="text-xs text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="font-medium text-accent">
                {isRTL ? `تم تحديد ${selectedCount} صفوف` : `${selectedCount} row(s) selected`}
              </span>
            ) : (
              <span>
                {isRTL ? `عرض ${table.getRowModel().rows.length} سجلات` : `Showing ${table.getRowModel().rows.length} records`}
              </span>
            )}
          </div>
          <div className={`flex items-center gap-6 lg:gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <p className="hidden text-xs font-medium md:block">{isRTL ? "صفوف لكل صفحة" : "Rows per page"}</p>
              <select
                className="h-8 w-[70px] rounded-md border border-input bg-background text-xs"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-xs font-medium">
              {isRTL ? `صفحة ${table.getState().pagination.pageIndex + 1} من ${table.getPageCount()}` : `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {isRTL ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {isRTL ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-in slide-in-from-bottom-2 duration-300">
            <div className={`flex items-center gap-4 rounded-full border border-border bg-card px-4 py-2 shadow-2xl ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="text-xs font-bold px-2 py-1 bg-accent/10 text-accent rounded-full">
                {isRTL ? `${selectedCount} محدد` : `${selectedCount} selected`}
              </span>
              <div className="h-4 w-px bg-border" />
              <button className={`flex items-center gap-2 text-xs font-bold text-success-text hover:opacity-80 transition-opacity ${isRTL ? "flex-row-reverse" : ""}`}>
                <CheckCircle2 className="h-4 w-4" />
                {app("confirm")}
              </button>
              <button className={`flex items-center gap-2 text-xs font-bold text-danger-text hover:opacity-80 transition-opacity ${isRTL ? "flex-row-reverse" : ""}`}>
                <Trash2 className="h-4 w-4" />
                {app("delete")}
              </button>
              <button
                onClick={() => table.resetRowSelection()}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {app("cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

