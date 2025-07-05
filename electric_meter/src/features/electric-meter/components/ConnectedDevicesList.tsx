import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { SimulationDevice } from "../hooks/queries";

interface ConnectedDevicesListProps {
	devices: SimulationDevice[];
	onRemoveDevice: (id: string) => void;
}

export const ConnectedDevicesList = ({
	devices,
	onRemoveDevice,
}: ConnectedDevicesListProps) => {
	if (devices.length === 0) {
		return null;
	}

	return (
		<div className="mt-4 flex flex-wrap gap-2">
			{devices.map((device) => (
				<Badge
					key={device.id}
					variant="secondary"
					className="flex items-center gap-1 py-1.5 border-indigo-500 bg-indigo-50 text-indigo-500"
				>
					{device.name} ({device.consumption_value.toFixed(1)} kW)
					<Button
						variant="ghost"
						size="icon"
						className="h-4 w-4 ml-1 rounded-full hover:bg-red-500 hover:text-white cursor-pointer"
						onClick={() => onRemoveDevice(device.id)}
					>
						<X className="h-3 w-3" />
						<span className="sr-only">Remove {device.name}</span>
					</Button>
				</Badge>
			))}
		</div>
	);
};
