import api from "@/lib/api";
import type { SimulationConfig } from "@/stores/SimulationStore";
import { useQuery } from "@tanstack/react-query";

export const SimulationConfigKeys = {
  all: ["simulationConfig"] as const,
} as const;

const getSimulationConfig = async () => {
  const response = await api.get<SimulationConfig>("/settings");
  return response.data;
};

export const useSimulationConfig = () => {
  return useQuery({
    queryKey: [SimulationConfigKeys.all],
    queryFn: getSimulationConfig,
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
