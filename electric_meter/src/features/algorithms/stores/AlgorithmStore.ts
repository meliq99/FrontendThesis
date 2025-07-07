import { create } from "zustand";
import type { Algorithm } from "../hooks/queries";

interface AlgorithmState {
  activeAlgorithm: Algorithm | null;
  isDetailViewOpen: boolean;
  setActiveAlgorithm: (algorithm: Algorithm | null) => void;
  openDetailView: (algorithm: Algorithm) => void;
  closeDetailView: () => void;
}

export const useAlgorithmStore = create<AlgorithmState>((set) => ({
  activeAlgorithm: null,
  isDetailViewOpen: false,
  
  setActiveAlgorithm: (algorithm) => set({ activeAlgorithm: algorithm }),
  
  openDetailView: (algorithm) => set({ 
    activeAlgorithm: algorithm, 
    isDetailViewOpen: true 
  }),
  
  closeDetailView: () => set({ 
    activeAlgorithm: null, 
    isDetailViewOpen: false 
  })
}));
