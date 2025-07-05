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

export interface UpdateDeviceParams extends CreateDeviceParams {
    id: string;
}

export interface DeviceResponse extends CreateDeviceParams {
    id: string;
}

const DeviceMutationsKeys = {
    create: "createDevice",
    update: "updateDevice",
    delete: "deleteDevice",
}

const createDevice = async (params: CreateDeviceParams) => {
    const response = await api.post<DeviceResponse>('/settings/devices', params as unknown as Record<string, string | number | boolean | object>);
    return response.data;
};

const updateDevice = async (params: UpdateDeviceParams) => {
    const { id, ...updateData } = params;
    const response = await api.put<DeviceResponse>(`/settings/devices/${id}`, updateData as unknown as Record<string, string | number | boolean | object>);
    return response.data;
};

const deleteDevice = async (deviceId: string) => {
    const response = await api.delete(`/settings/devices/${deviceId}`);
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

export const useUpdateDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [DeviceMutationsKeys.update],
        mutationFn: (params: UpdateDeviceParams) => updateDevice(params),
        onMutate: () => {
            queryClient.cancelQueries({ queryKey: [DeviceMutationsKeys.update] });
            queryClient.cancelQueries({ queryKey: [SimulationConfigKeys.all] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [DeviceMutationsKeys.update] });
            queryClient.invalidateQueries({ queryKey: [SimulationConfigKeys.all] });
        },
    });
};

export const useDeleteDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [DeviceMutationsKeys.delete],
        mutationFn: (deviceId: string) => deleteDevice(deviceId),
        onMutate: () => {
            queryClient.cancelQueries({ queryKey: [DeviceMutationsKeys.delete] });
            queryClient.cancelQueries({ queryKey: [SimulationConfigKeys.all] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [DeviceMutationsKeys.delete] });
            queryClient.invalidateQueries({ queryKey: [SimulationConfigKeys.all] });
        },
    });
};
