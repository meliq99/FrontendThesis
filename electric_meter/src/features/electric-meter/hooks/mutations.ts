import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SimulationDevicesKeys } from "./queries";



export interface SimulationStatusResponse {
    status: string;
}

export interface CreateDeviceSimulationParams {
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

export interface DeviceSimulationResponse extends CreateDeviceSimulationParams {
    id: string;
}

export interface DeleteSimulationResponse {
    message: string;
}

const SimulationMutationsKeys = {
    start: "startSimulation",
    stop: "stopSimulation",
    create: "createDeviceSimulation",
    delete: "deleteDeviceSimulation",
}

const startSimulation = async ({
    simulationId,
}:{
    simulationId: string
}) => {
    const response = await api.post(`/publisher/${simulationId}/start`

    );
    return response as unknown as SimulationStatusResponse;
};


const stopSimulation = async({
    simulationId,
}:{
    simulationId: string
}) => {
    const response = await api.post(`/publisher/${simulationId}/stop`
    );
    return response as unknown as SimulationStatusResponse;
}

const createDeviceSimulation = async (params: CreateDeviceSimulationParams) => {
    const response = await api.post<DeviceSimulationResponse>('/device-simulation', params as unknown as Record<string, string | number | boolean | object>);
    return response.data;
};

const deleteDeviceSimulation = async ({
    simulationId,
}:{
    simulationId: string
}) => {
    const response = await api.delete<DeleteSimulationResponse>(`/device-simulation/${simulationId}`);
    return response.data;
};

export const useStartSimulation = ({
    simulationId  
}:{
    simulationId:string
}) => {
    return useMutation({
        mutationKey: [SimulationMutationsKeys.start],
        mutationFn: () => startSimulation({simulationId}),
    })
}

export const useStopSimulation = ({
    simulationId
}:{
    simulationId:string
}) => {
    return useMutation ({
        mutationKey: [SimulationMutationsKeys.stop],
        mutationFn: () => stopSimulation({simulationId}),
    })
}

export const useCreateDeviceSimulation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [SimulationMutationsKeys.create],
        mutationFn: (params: CreateDeviceSimulationParams) => createDeviceSimulation(params),
        onMutate: () => {
            queryClient.cancelQueries({ queryKey: [SimulationMutationsKeys.create] });
            queryClient.cancelQueries({ queryKey: [SimulationDevicesKeys.all] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [SimulationMutationsKeys.create] });
            queryClient.invalidateQueries({ queryKey: [SimulationDevicesKeys.all] });
        },
    })
}

export const useDeleteDeviceSimulation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [SimulationMutationsKeys.delete],
        mutationFn: ({ simulationId }: { simulationId: string }) => 
            deleteDeviceSimulation({ simulationId }),
        onMutate: () => {
            queryClient.cancelQueries({ queryKey: [SimulationMutationsKeys.delete] });
            queryClient.cancelQueries({ queryKey: [SimulationDevicesKeys.all] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [SimulationMutationsKeys.delete] });
            queryClient.invalidateQueries({ queryKey: [SimulationDevicesKeys.all] });
        },
    })
}