# 11. Folder & File Structure

This document details the standardized folder layout and file naming conventions for the Next.js 15 App Router application codebase. The structure promotes separation of concerns and scaling to handle Phase 2 modules cleanly.

---

## 1. Directory Tree Architecture

```
/
├── app/                        # Next.js App Router (Routing and Layouts only)
│   ├── (auth)/                 # Group: Auth modules (unauthenticated layouts)
│   │   └── login/              # Login Page
│   ├── (dashboard)/            # Group: Main ERP (authenticated layout shell)
│   │   ├── page.tsx            # Central Dashboard Landing
│   │   ├── projects/           # Projects Management routes
│   │   ├── inventory/          # Inventory & Warehousing routes
│   │   ├── procurement/        # Procurement & Purchasing routes
│   │   ├── resources/          # Employees & Equipment directory routes
│   │   ├── field-records/      # Daily progress & fuel logs routes
│   │   └── reports/            # Custom tabular & ApexCharts reports routes
│   ├── api/                    # Internal API routes (proxies, PDF generator)
│   ├── favicon.ico
│   ├── globals.css             # Tailwind base styles & HSL variables
│   └── layout.tsx              # Root HTML wrapper
│
├── components/                 # React Components
│   ├── ui/                     # Primitives (Shadcn UI raw exports)
│   ├── shared/                 # Shared widgets (Navbar, Sidebar, DataTable, Gantt)
│   └── domains/                # Domain-specific components
│       ├── projects/           # Project-only components (Gantt, PhasesGrid)
│       ├── inventory/          # Inventory widgets (Scanner, TransferModal)
│       └── fuel/               # Fuel dispatch panels (FuelForm, NozzleStatus)
│
├── hooks/                      # Global custom hooks (e.g. useMediaQuery, useFormAutoSave)
├── lib/                        # Third-party wrappers and configurations
│   ├── api/                    # Axios API client setup & interceptors
│   ├── react-query/            # QueryClient config & providers
│   └── utils/                  # Tailwind CSS helper functions (cn merge)
│
├── store/                      # Zustand Client Stores (UI, Drafts)
├── types/                      # TypeScript schemas & global types
│   ├── index.ts                # Entry points for types
│   ├── api.types.ts            # Common API response/request wrappers
│   └── models.types.ts         # Backend entity models (Project, Item, Worker)
│
├── validation/                 # Zod validation schemas
│   └── forms/                  # Form schemas mapping Laravel rules
│
└── public/                     # Static assets (logos, fallback images)
```

---

## 2. File Naming Conventions

Consistency in file names allows for rapid fuzzy-search navigation (`Ctrl+P` / `Cmd+P` in VS Code).

### Component Files
- **Rule**: PascalCase. Group folder matches target domain.
- **Example**: `components/shared/DataTable.tsx` or `components/domains/projects/ProjectGantt.tsx`.

### Hooks & Utilities
- **Rule**: camelCase. Hook files MUST be prefixed with `use-`.
- **Example**: `hooks/use-form-autosave.ts` or `lib/api/query-keys.ts`.

### Pages, Routes, & Layouts
- **Rule**: kebab-case. Determined by Next.js app router structure.
- **Example**: `app/(dashboard)/field-records/fuel/page.tsx`.

### Route Isolation & Colocation
- Component styling or private sub-components that are only used in ONE single page should be colocated inside that route's folder in a sub-folder named `_components` (prefixed with an underscore so Next.js ignores it for routing paths):
  ```
  app/(dashboard)/projects/[id]/
  ├── _components/
  │   ├── ProjectHeader.tsx
  │   └── ProjectStatsGrid.tsx
  ├── page.tsx
  └── layout.tsx
  ```
- This keeps the global `components/` directory clean and reserved for re-usable system-wide abstractions.
