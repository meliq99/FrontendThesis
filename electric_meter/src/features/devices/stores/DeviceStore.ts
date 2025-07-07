import { create } from "zustand";
import type { Device } from "@/types/device";

interface DeviceState {
  activeDevice: Device | null;
  isDetailViewOpen: boolean;
  setActiveDevice: (device: Device | null) => void;
  openDetailView: (device: Device) => void;
  closeDetailView: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  activeDevice: null,
  isDetailViewOpen: false,
  
  setActiveDevice: (device) => set({ activeDevice: device }),
  
  openDetailView: (device) => set({ 
    activeDevice: device, 
    isDetailViewOpen: true 
  }),
  
  closeDetailView: () => set({ 
    activeDevice: null, 
    isDetailViewOpen: false 
  })
})); 