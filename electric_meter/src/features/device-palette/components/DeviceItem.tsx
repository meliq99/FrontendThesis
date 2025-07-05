import type { Device } from "@/types/device";
import { useDeviceDrag } from "../hooks/useDeviceDrag";
import { getDeviceIcon } from "../utils/deviceIcons";
import { useDeleteDevice } from "../hooks/mutations";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeviceItemProps {
	device: Device;
	onAddDevice: (device: Device) => void;
}

export const DeviceItem: React.FC<DeviceItemProps> = ({
	device,
	onAddDevice,
}) => {
	const { isDragging, dragRef } = useDeviceDrag({
		device,
		onAddDevice,
	});

	const { mutate: deleteDevice } = useDeleteDevice();

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		deleteDevice(device.id, {
			onSuccess: () => {
				console.log("Device deleted successfully");
			},
			onError: (error) => {
				console.error("Failed to delete device:", error);
			},
		});
	};

	return (
		<div
			ref={dragRef}
			className="flex flex-col items-center justify-center p-2 rounded-md border cursor-move transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md relative"
			style={{
				opacity: isDragging ? 0.7 : 1,
				transform: isDragging ? "scale(0.95)" : "scale(1)",
				transition: "all 0.2s ease-in-out",
				backgroundColor: isDragging ? "rgba(99, 102, 241, 0.05)" : undefined,
				borderColor: isDragging ? "rgba(99, 102, 241, 0.2)" : undefined,
				boxShadow: isDragging ? "0 0 0 2px rgba(99, 102, 241, 0.4), 0 0 20px rgba(99, 102, 241, 0.2)" : undefined,
			}}
		>
			{!device.is_default && (
				<Button
					variant="ghost"
					size="sm"
					className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
					onClick={handleDelete}
				>
					<X className="h-3 w-3" />
				</Button>
			)}
			<div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
				{getDeviceIcon({ name: device.icon, size: 24 })}
			</div>
			<div className="mt-2 text-sm font-medium text-center">{device.name}</div>
			<div className="text-xs text-muted-foreground">
				{device.consumption_value.toFixed(2)} kW
			</div>
		</div>
	);
};
