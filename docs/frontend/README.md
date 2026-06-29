# Construction ERP — Frontend Architecture Documentation

Welcome to the frontend design and architecture blueprint for the **Construction ERP System**. This suite of documentation is designed to outline technical, functional, and user-experience guidelines for the Next.js 15 frontend application.

---

## 📖 Table of Contents & Navigation

Please refer to the following documents for specific topics:

### Part 1: Technical & Core Architecture
- **[01. Frontend Architecture](01-frontend-architecture.md)**: Technical stack, RSC strategy, caching, security, performance, and multi-module isolation.
- **[09. API Integration Plan](09-api-integration-plan.md)**: Network client, TanStack Query key factories, Laravel 422 error mapper, and optimistic updates.
- **[10. State Management Strategy](10-state-management.md)**: Caching partitions, Zustand stores, local draft storage, and automatic form backups.
- **[11. Folder & File Structure](11-folder-structure.md)**: Next.js App Router tree structure, naming conventions, and route-level component collocation.

### Part 2: Design System & User Experience
- **[02. UI & UX Strategy](02-ui-ux-strategy.md)**: Design principles (speed, density, command palette, keyboard shortcuts).
- **[06. Layout System](06-layout-system.md)**: Shell structures, sidebar behaviors, grid alignment, modals, and sheets.
- **[07. Design System](07-design-system.md)**: HSL Color Palette (Light/Dark themes), typography hierarchy, spacing scale, and border styles.
- **[08. Component Library & Inventory](08-component-library.md)**: Primitive and advanced component lists, charts, and barcode scanner modules.
- **[19. Animation Strategy](19-animation-strategy.md)**: Framer Motion configurations, skeleton loaders, and micro-interactions.
- **[21. Mobile & Tablet Responsiveness](21-mobile-responsiveness.md)**: Mobile/Tablet view adaptations, horizontal table scrolling, touch targets, and offline sync.

### Part 3: Information Architecture & Workflows
- **[03. Information Architecture & Sitemap](03-information-architecture.md)**: App routing tree, Page navigation mapping, Phase 2 integration hooks.
- **[04. User Journeys](04-user-journeys.md)**: Step-by-step user flows for daily PM, warehouse, procurement, and logging tasks.
- **[05. Role-Based User Experience](05-role-based-experience.md)**: Workspace configurations, permissions, and dashboards for 10 target business roles.

### Part 4: Functional Module Specifications (Phase 1)
- **[12. Data Tables Strategy](12-tables-strategy.md)**: Headless TanStack grid setups, inline editing, and floating bulk action bars.
- **[13. Form Design & Validation Strategy](13-forms-strategy.md)**: React Hook Form configurations, Zod validators, and dynamic sub-forms.
- **[14. Projects Module Specification](14-projects-module.md)**: Routes, detail tabs (Overview, Phases, Teams, Equipment), and assign dialogs.
- **[15. Inventory & Warehouse Module Spec](15-inventory-warehouse.md)**: Items catalog, Goods Receipt forms, transfers, adjustments, and barcode scanners.
- **[16. Procurement & Purchasing Module Spec](16-procurement-purchasing.md)**: Requisition workflows, approval panels, PO PDF generation, and split PO systems.
- **[17. Recorders & Fuel Dispatchers Operations](17-recorders-dispatchers.md)**: Attendance, mobile fuel logs, Senior Recorder audit logs, and local IndexedDB caching.
- **[18. Reporting & Analytics Screens](18-reporting-analytics.md)**: ApexCharts configurations, tabular sync, and export pipelines.

### Part 5: Implementation & Planning
- **[20. Development Roadmap](20-development-roadmap.md)**: Screen priority matrices, Gantt timelines, and work volume estimations.
- **[22. Environment Setup & Pre-requisites](22-environment-setup.md)**: Local environment audit, folder strategies, and initialization scripts.

---

## 🛠️ Tech Stack Cheat Sheet
- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Interactions**: Radix UI (base) / Shadcn UI (components)
- **Forms**: React Hook Form + Zod
- **API State**: TanStack Query (React Query)
- **Local State**: Zustand + LocalStorage persist
- **Visuals**: ApexCharts + Framer Motion
