import type { Device } from "@/types/device";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DevicesGrid } from "./DevicesGrid";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { ErrorDisplay } from "./ErrorDisplay";
import NewDeviceDialog from "./NewDeviceDialog";
import { useSimulationConfig } from "@/hooks/queries";

interface DevicePaletteProps {
	onAddDevice: (device: Device) => void;
}

export const DevicePalette: React.FC<DevicePaletteProps> = ({
	onAddDevice,
}) => {
	const {
		data: simulationConfig,
		isLoading,
		error,
		refetch,
	} = useSimulationConfig();

	const devices = simulationConfig?.devices;

	return (
		<Card className="h-full rounded-none flex flex-col">
			<CardHeader className="pb-3 flex-shrink-0">
				<CardTitle>Devices</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-0 flex flex-col h-[calc(100%-80px)]">
				<div className="h-[calc(100%-80px)] min-h-0">
					{isLoading ? (
						<LoadingPlaceholder />
					) : error ? (
						<ErrorDisplay message={error.message} onRetry={refetch} />
					) : (
						<DevicesGrid devices={devices || []} onAddDevice={onAddDevice} />
					)}
				</div>

				<div className="h-[80px] flex-shrink-0 mt-4">
					<div className="text-xs text-muted-foreground mb-2">
						Drag and drop devices onto the meter to connect them
					</div>
					<NewDeviceDialog />
				</div>
			</CardContent>
		</Card>
	);
};

export default DevicePalette;
