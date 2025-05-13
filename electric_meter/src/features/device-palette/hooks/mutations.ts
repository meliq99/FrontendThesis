import { SimulationConfigKeys } from "@/hooks/queries";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateDeviceParams {
    name: string;
    description: string;
    consumption_value: number;
    peak_consumption: number;
    cycle_duration: number;
    on_duration: number;
    algorithm_id: string;
}

export interface DeviceResponse extends CreateDeviceParams {
    id: string;
}

const DeviceMutationsKeys = {
    create: "createDevice",
}

const createDevice = async (params: CreateDeviceParams) => {
    const response = await api.post<DeviceResponse>('/settings/devices', params as unknown as Record<string, string | number | boolean | object>);
    return response.data;
};

export const useCreateDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [DeviceMutationsKeys.create],
        mutationFn: (params: CreateDeviceParams) => createDevice(params),
        onMutate: () => {
            queryClient.cancelQueries({ queryKey: [DeviceMutationsKeys.create] });
            queryClient.cancelQueries({ queryKey: [SimulationConfigKeys.all] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [DeviceMutationsKeys.create] });
            queryClient.invalidateQueries({ queryKey: [SimulationConfigKeys.all] });
        },
    });
};
