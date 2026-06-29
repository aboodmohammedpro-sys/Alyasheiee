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
