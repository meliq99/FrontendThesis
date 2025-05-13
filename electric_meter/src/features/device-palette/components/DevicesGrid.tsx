import type { Device } from "@/stores/SimulationStore";
import { DeviceItem } from "./DeviceItem";

interface DevicesGridProps {
	devices: Device[];
	onAddDevice: (device: Device) => void;
}

export const DevicesGrid: React.FC<DevicesGridProps> = ({
	devices,
	onAddDevice,
}) => {
	if (devices.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				No devices available
			</div>
		);
	}

	return (
		<div className="h-full overflow-y-auto pr-2 pb-2" style={{ overflowY: 'auto' }}>
			<div className="grid grid-cols-2 gap-3 w-full">
				{devices.map((device) => (
					<DeviceItem
						key={device.name}
						device={device}
						onAddDevice={onAddDevice}
					/>
				))}
			</div>
		</div>
	);
};
