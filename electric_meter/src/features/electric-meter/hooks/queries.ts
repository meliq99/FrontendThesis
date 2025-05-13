import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface SimulationDevice {
  id: string;
  name: string;
  description: string;
  consumption_value: number;
  is_default: boolean;
  peak_consumption: number;
  cycle_duration: number;
  on_duration: number;
  electric_meter_id: string;
  algorithm_id: string;
}

export const SimulationDevicesKeys = {
  all: ["simulationDevices"] as const,
};

const getAllSimulationDevices = async ({
  electricMeterId,
}: {
  electricMeterId: string;
}) => {
  const response = await api.get<SimulationDevice[]>(
    `/device-simulation?electric_meter_id=${electricMeterId}`
  );
  return response.data;
};

export const useSimulationDevices = ({
  electricMeterId,
}: {
  electricMeterId: string;
}) => {
  return useQuery({
    queryKey: [SimulationDevicesKeys.all],
    queryFn: () => getAllSimulationDevices({ electricMeterId }),
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
