# 10. State Management Strategy

This document details the architectural boundaries between client state, server state, and local persistence within the **Construction ERP System**.

---

## 1. State Classification Matrix

To keep client bundles thin and prevent data syncing conflicts, we split state into three clear buckets:

```
                  [ ERP State Management ]
                             │
            What is the nature of the data?
            /                │             \
      (Server Data)    (Temporary UI)   (Forms & Syncs)
          /                  │               \
 [ TanStack Query ]      [ Zustand ]     [ LocalStorage ]
 - Project details       - Sidebar state - Unsaved drafts
 - Inventory levels      - Cmd+K toggle  - Offline logs
 - Requisitions          - Active tabs   - Dark mode settings
```

- **Server State (TanStack Query)**: Data owned by the Laravel database. Fetched asynchronously, cached, invalidated on mutations, and auto-refetched based on staleness parameters.
- **Client State (Zustand)**: Temporary UI layout configurations. Exists only in memory, fast execution, lightweight package footprint.
- **Local Persistent State (LocalStorage / IndexedDB)**: Offline forms, data drafts, dark mode flags, and user personalization keys.

---

## 2. Zustand Client State Configuration
We utilize **Zustand** stores for generic layout properties. The state is localized and avoids heavy React context re-renders.

### Layout State Store (`store/use-layout-store.ts`)
```typescript
import { create } from 'zustand';

interface LayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
```

### Active Project Context Store (`store/use-project-context-store.ts`)
Tracks the active project filter that scales dashboard statistics dynamically.
```typescript
interface ProjectContextState {
  activeProjectId: string | null;
  setActiveProjectId: (projectId: string | null) => void;
}

export const useProjectContextStore = create<ProjectContextState>((set) => ({
  activeProjectId: null,
  setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),
}));
```

---

## 3. Local Drafts Storage & Data Recovery

Field Recorders and Fuel Dispatchers operate in environments with unstable internet connections. If they lose power or close their browser tab, they should not lose their input progress.

### Zustand Form Draft Store (with middleware persistence)
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FormDraftStore {
  drafts: Record<string, any>; // key: formId, value: formValues
  saveDraft: (formId: string, values: any) => void;
  clearDraft: (formId: string) => void;
}

export const useFormDraftStore = create<FormDraftStore>()(
  persist(
    (set) => ({
      drafts: {},
      saveDraft: (formId, values) => set((state) => ({
        drafts: { ...state.drafts, [formId]: values }
      })),
      clearDraft: (formId) => set((state) => {
        const newDrafts = { ...state.drafts };
        delete newDrafts[formId];
        return { drafts: newDrafts };
      }),
    }),
    {
      name: 'erp-form-drafts', // LocalStorage Key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Automatic Hook for React Hook Form Drafts
This hook hooks into any React Hook Form instance, backing up progress as the user types:
```typescript
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export function useFormAutoSave(formId: string, methods: UseFormReturn<any>) {
  const { saveDraft, drafts } = useFormDraftStore();

  // 1. Restore draft on mount
  useEffect(() => {
    const savedValues = drafts[formId];
    if (savedValues) {
      methods.reset(savedValues);
    }
  }, [formId]);

  // 2. Watch fields and save to local storage
  const watchedValues = methods.watch();
  useEffect(() => {
    if (methods.formState.isDirty) {
      saveDraft(formId, watchedValues);
    }
  }, [watchedValues, formId, methods.formState.isDirty]);
}
```
If a form completes successfully, the submittal function triggers `clearDraft(formId)` to release the storage space.
