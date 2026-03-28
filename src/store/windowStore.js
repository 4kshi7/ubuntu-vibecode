import { create } from 'zustand';

export const useWindowStore = create((set) => ({
  windows: [],
  activeWindow: null,
  
  openWindow: (appId) => set((state) => {
    const existing = state.windows.find(w => w.id === appId);
    if (existing) {
      return {
        windows: state.windows.map(w => w.id === appId ? { ...w, minimized: false, zIndex: Date.now() } : w),
        activeWindow: appId
      };
    }
    return {
      windows: [...state.windows, { id: appId, minimized: false, maximized: false, zIndex: Date.now() }],
      activeWindow: appId
    };
  }),

  closeWindow: (appId) => set((state) => ({
    windows: state.windows.filter(w => w.id !== appId),
    activeWindow: state.activeWindow === appId ? null : state.activeWindow
  })),

  minimizeWindow: (appId) => set((state) => ({
    windows: state.windows.map(w => w.id === appId ? { ...w, minimized: true } : w),
    activeWindow: state.activeWindow === appId ? null : state.activeWindow
  })),

  focusWindow: (appId) => set((state) => ({
    windows: state.windows.map(w => w.id === appId && !w.minimized ? { ...w, zIndex: Date.now() } : w),
    activeWindow: appId
  })),
  
  toggleMaximize: (appId) => set((state) => ({
    windows: state.windows.map(w => w.id === appId ? { ...w, maximized: !w.maximized } : w)
  }))
}));
