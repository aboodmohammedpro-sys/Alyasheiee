# 22. Environment Setup & Pre-requisites

This document evaluates the local development environment and lists the steps and dependencies required to initialize the project according to the **Construction ERP Frontend Architecture**.

---

## 1. Current Environment Audit

A system check of the workspace on **June 23, 2026** shows the following configurations:

| Tool / Resource | Status / Version | Action Required |
| :--- | :--- | :--- |
| **Node.js** | `v24.12.0` (Installed) | None. Supported for Next.js 15. |
| **NPM** | `11.6.2` (Installed) | None. Ready to install packages. |
| **Git** | `git version 2.52.0` (Configured) | None. Repo initialized. |
| **Workspace Code** | Documentation Only | **Needs Next.js 15 Initializer.** |

---

## 2. Directory Layout Decision

Since this repository will house both a **Next.js 15 frontend** and a **Laravel REST API backend**, we recommend a multi-folder repository layout:

```
d:\Alyasheiee\
├── docs/                     # Architectural documentation (present)
│   ├── frontend/
│   └── backend/
│
├── frontend/                 # NEXT.JS 15 APP ROUTER PROJECT (TO BE CREATED)
│   ├── package.json
│   ├── app/
│   └── ...
│
└── backend/                  # LARAVEL REST API PROJECT (FUTURE WORK)
    ├── composer.json
    └── ...
```

---

## 3. Required Package Configurations

To prepare the Next.js app for Phase 1 construction operational screens, we must run the following initial installation commands:

### Step 3.1: Next.js 15 Core Initialization
Run the Next.js creator command inside the `frontend` folder:
```bash
npx -y create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

### Step 3.2: Component & UI Primitives (Shadcn UI)
Enter the frontend folder and initialize Shadcn UI:
```bash
cd frontend
npx shadcn@latest init
```
*Selection parameters during configuration:*
- Style: `Default`
- Base color: `Slate` (matches our deep steel-blue/slate design tokens)
- CSS variables: `Yes`

### Step 3.3: Install Architectural Libraries
Run npm installer for core libraries defined in our architecture:
```bash
npm install @tanstack/react-query @tanstack/react-table react-hook-form zod @hookform/resolvers zustand axios lucide-react framer-motion apexcharts react-apexcharts
```

### Step 3.4: Install Dev Tooling & Utilities
```bash
npm install -D @types/react-apexcharts prettier eslint-config-prettier
```

---

## 4. Initialization Checklist
Once the directories are initialized, we will perform these baseline configuration updates before building any pages:
1. **Design Token Sync**: Replace variables inside `frontend/app/globals.css` with the HSL color variables from `07-design-system.md`.
2. **Directory Scaffolding**: Create the folders defined in `11-folder-structure.md` (e.g. `components/domains`, `store/`, `validation/`, `lib/react-query`).
3. **Query Provider Setup**: Configure the centralized `QueryClientProvider` and `axios` API interceptors.
