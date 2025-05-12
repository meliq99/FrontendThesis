import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { string } from "zod";

export interface SimulationStatusResponse {
    status: string;
}

const simulationMutationsKeys = {
    start: "startSimulation",
    stop: "stopSimulation",
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

export const useStartSimulation = ({
    simulationId  
}:{
    simulationId:string
}) => {
    return useMutation({
        mutationKey: [simulationMutationsKeys.start],
        mutationFn: () => startSimulation({simulationId}),
    })
}

export const useStopSimulation = ({
    simulationId
}:{
    simulationId:string
}) => {
    return useMutation ({
        mutationKey: [simulationMutationsKeys.stop],
        mutationFn: () => stopSimulation({simulationId}),
    })
}