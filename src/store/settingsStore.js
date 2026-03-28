import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  theme: 'dark',
  wallpaper: 'linear-gradient(135deg, #E95420 0%, #77216F 100%)', // Ubuntu-like gradient
  setTheme: (theme) => set({ theme }),
  setWallpaper: (wallpaper) => set({ wallpaper }),
  wifiEnabled: true,
  toggleWifi: () => set((state) => ({ wifiEnabled: !state.wifiEnabled })),
  bluetoothEnabled: false,
  toggleBluetooth: () => set((state) => ({ bluetoothEnabled: !state.bluetoothEnabled }))
}));
