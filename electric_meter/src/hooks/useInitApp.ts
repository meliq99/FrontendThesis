import { useSimulationStore } from "@/stores/SimulationStore";
import { useSimulationConfig } from "./queries";
import { useEffect } from "react";

// Hook for use inside components
export const useInitApp = () => {
  const { data: simulationConfig } = useSimulationConfig();
  const { setConfig } = useSimulationStore();

  useEffect(() => {
    if (simulationConfig) {
      setConfig(simulationConfig);
    }
  }, [simulationConfig]);
};

// Function for initialization outside of React components (like in router)
export const initApp = async () => {
  // Get the setter function from the store
  const setConfig = useSimulationStore.getState().setConfig;
  
  try {
    // Manually fetch the config 
    // Assuming useSimulationConfig uses a fetcher that can be called directly
    const response = await fetch('/api/simulation-config');
    const simulationConfig = await response.json();
    
    // Set the config in the store
    setConfig(simulationConfig);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize app:', error);
    return { success: false, error };
  }
};

export default useInitApp;
