import { create } from "zustand";

// Device interface
export interface Device {
  id: string;
  name: string;
  description: string;
  consumption_value: number;
  is_default: boolean;
  peak_consumption: number;
  cycle_duration: number;
  on_duration: number;
  algorithm_id: string;
  icon: string;
}

// Simulation interface
export interface Simulation {
  id: string;
  name: string;
  start_date: string;
  update_date: string;
  is_active: boolean;
  electric_meter_id: string;
}

// Consumption Algorithm interface
export interface ConsumptionAlgorithm {
  id: string;
  name: string;
  description: string;
  algorithm_type: string;
  script: string;
}

// Complete simulation configuration
export interface SimulationConfig {
  devices: Device[];
  simulation: Simulation;
  consumption_algorithms: ConsumptionAlgorithm[];
}

// Store state interface
interface SimulationState {
  config: SimulationConfig;
  isLoading: boolean;
  error: string | null;
  setConfig: (config: SimulationConfig) => void;
  addDevice: (device: Device) => void;
  removeDevice: (deviceId: string) => void;
  updateSimulation: (simulation: Simulation) => void;
}

// Initial empty state
const initialState: SimulationConfig = {
  devices: [],
  simulation: {
    id: "",
    name: "",
    start_date: "",
    update_date: "",
    is_active: false,
    electric_meter_id: ""
  },
  consumption_algorithms: []
};

// Create the store
export const useSimulationStore = create<SimulationState>((set) => ({
  config: initialState,
  isLoading: false,
  error: null,
  
  setConfig: (config) => set({ config }),
  
  addDevice: (device) => set((state) => ({
    config: {
      ...state.config,
      devices: [...state.config.devices, device]
    }
  })),
  
  removeDevice: (deviceId) => set((state) => ({
    config: {
      ...state.config,
      devices: state.config.devices.filter(device => device.id !== deviceId)
    }
  })),
  
  updateSimulation: (simulation) => set((state) => ({
    config: {
      ...state.config,
      simulation
    }
  }))
}));



