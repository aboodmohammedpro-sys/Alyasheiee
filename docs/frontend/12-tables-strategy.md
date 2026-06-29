# 12. Data Tables Strategy

This document details the strategies, performance optimizations, and interaction patterns for data grids using **TanStack Table (v8)**. Data tables are the core of ERP data viewing and editing.

---

## 1. Client-Side vs. Server-Side Data Strategy

```
                          [ Data Table Grid Loading ]
                                       │
                              Total size of dataset?
                              /                     \
                      (< 150 rows)                (> 150 rows)
                          /                             \
             [ Client-side Processing ]       [ Server-side Processing ]
             - Single initial API fetch       - Paginated API requests
             - Instant client search/sort     - Debounced queries on search
             - Instant paging shifts          - Cursor/Offset paging parameters
```

- **Client-Side Processing**: Used for small, localized datasets like Project Teams, Phases, or Warehouse Shelves list. We load all rows once and let TanStack Table handle sorting, filtering, and paging.
- **Server-Side Processing**: Used for heavy databases like Item Catalogs, PR/PO list, Inventory Ledger, and Fuel Dispatch logs. Filtering, searching, sorting, and paging are passed to the Laravel API as query parameters:
  `GET /api/v1/inventory/items?page=2&per_page=30&sort_by=item_code&sort_dir=desc&search=cement`

---

## 2. Global `<DataTable />` Layout Spec

The wrapper component integrates several features in a single visual space:

```
+--------------------------------------------------------------------------+
| [ Search... ]  [Column Visibility v]  [Filters v]         [Export CSV v] |
+--------------------------------------------------------------------------+
| [ ] SKU      │ Description           │ Stock Level    │ Status           |
+──────────────┼───────────────────────┼────────────────┼──────────────────+
| [ ] CMN-001  │ Cement Portland Type I│ 450 Bags       │ [ In Stock ]     |
| [ ] STL-12M  │ Steel Rebar 12mm      │ 12.3 Tons      │ [ In Stock ]     |
| [ ] DSL-050  │ Diesel Fuel 50 Cetane │ 2,400 Liters   │ [ Low Stock ]    |
+──────────────┼───────────────────────┼────────────────┼──────────────────+
| Selected: 2  │ [ Bulk Approve ]      │ [ Bulk Delete ]│ Page 1 of 42 >   |
+--------------------------------------------------------------------------+
```

### Table Core Settings
- **Fixed Headers**: The header remains fixed at the top of the table canvas, while the body scrolls vertically (`overflow-y-auto max-h-[calc(100vh-250px)]`).
- **Frozen Columns**: For horizontal scrolling on small desktop/tablet viewports, the checkbox column and first metadata column (e.g. Item Code or Project ID) are frozen (`sticky left-0 bg-background z-10`).
- **Monospace Numbers**: Column values displaying quantities, codes, or money values use a monospace font (`font-mono`) and are aligned to the right.

---

## 3. Bulk Operations Context Bar
When one or more checkboxes are checked in the table:
1. A slide-up action bar triggers at the bottom of the table canvas.
2. The bar displays the count of selected items.
3. Provides quick operations based on context (e.g. "Approve Selected", "Assign to Warehouse", "Print PDF Tags").
4. Pressing `Esc` clears all selection checkboxes.

---

## 4. Excel-Like Inline Editing

For rapid data entry (e.g. warehouse inventory stocktake or recorder hours log), we support inline cell editing:

```typescript
// Example: Custom cell component for editable values
export const EditableCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  // Sync state with incoming values
  useEffect(() => { setValue(initialValue); }, [initialValue]);

  const onBlur = () => {
    // Fire callback to save cell data immediately to cache / API
    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full bg-transparent px-2 py-1 font-mono focus:bg-card focus:outline-ring"
    />
  );
};
```
- **Keyboard Traversal**: Users can navigate the grid fields using arrow keys. Pressing `Enter` commits the cell value and focuses the input directly below it.

---

## 5. Performance Optimizations
- **Windowing / Virtualization**: If displaying more than 100 rows without pagination, we integrate `react-virtual` to ensure only the visible rows are rendered in the DOM, preventing browser lag.
- **Row Memoization**: Custom cell renderers (like status badges) are wrapped in `React.memo` to prevent re-rendering when other columns are resized.
- **Column Resizing**: We enable TanStack's built-in column resizing handlers. Resized values are stored in the state, preventing layout jumps when rows update.
