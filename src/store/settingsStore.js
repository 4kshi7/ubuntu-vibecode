import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      wallpaper: 'linear-gradient(135deg, #E95420 0%, #77216F 100%)',
      wifiEnabled: true,
      bluetoothEnabled: false,
      volume: 75,
      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      toggleWifi: () => set((s) => ({ wifiEnabled: !s.wifiEnabled })),
      toggleBluetooth: () => set((s) => ({ bluetoothEnabled: !s.bluetoothEnabled })),
      setVolume: (volume) => set({ volume }),
    }),
    { name: 'ubuntu-settings' }
  )
);
