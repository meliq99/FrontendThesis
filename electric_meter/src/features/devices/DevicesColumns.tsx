import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Device } from "@/types/device";
import { getDeviceIcon } from "@/features/device-palette/utils/deviceIcons";
import { useDeleteDevice } from "@/features/device-palette/hooks/mutations";

interface ActionsProps {
	row: Device;
	onEdit?: (device: Device) => void;
}

const Actions = ({ row, onEdit }: ActionsProps) => {
	const { mutate: deleteDevice } = useDeleteDevice();

	const handleEdit = useCallback(() => {
		onEdit?.(row);
	}, [row, onEdit]);

	const handleDelete = useCallback(() => {
		deleteDevice(row.id, {
			onSuccess: () => {
				console.log("Device deleted successfully");
			},
			onError: (error) => {
				console.error("Failed to delete device:", error);
			},
		});
	}, [row.id, deleteDevice]);

	return (
		<div className="flex items-center gap-1">
			<Button
				variant="ghost"
				size="sm"
				className="h-8 w-8 p-0 hover:bg-indigo-50 disabled:opacity-50"
				onClick={handleEdit}
				disabled={row.is_default}
				aria-label="Edit device"
			>
				<Edit className="h-4 w-4 text-indigo-600" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="h-8 w-8 p-0 hover:bg-red-50 disabled:opacity-50"
				onClick={handleDelete}
				disabled={row.is_default}
				aria-label="Delete device"
			>
				<Trash2 className="h-4 w-4 text-red-600" />
			</Button>
		</div>
	);
};

interface UseColumnsProps {
	onEditDevice?: (device: Device) => void;
}

export const useDevicesColumns = ({ onEditDevice }: UseColumnsProps = {}): ColumnDef<Device>[] => {
	const columns: ColumnDef<Device>[] = [
		{
			id: "icon",
			accessorKey: "icon",
			header: "",
			meta: { width: 60, align: "center" },
			cell: ({ row }) => {
				return (
					<div className="flex justify-center items-center">
						<div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
							{getDeviceIcon({ name: row.original.icon, size: 20 })}
						</div>
					</div>
				);
			},
		},
		{
			id: "name",
			accessorKey: "name",
			header: "Device Name",
			meta: { width: 200 },
			cell: ({ row }) => {
				return (
					<div className="flex flex-col">
						<p className="font-medium text-gray-900">{row.original.name}</p>
						<p className="text-sm text-gray-500 truncate max-w-[180px]">
							{row.original.description}
						</p>
					</div>
				);
			},
		},
		{
			id: "consumption_value",
			accessorKey: "consumption_value",
			header: "Consumption",
			meta: { width: 120, align: "right" },
			cell: ({ row }) => {
				return (
					<div className="text-right">
						<p className="font-medium text-gray-900">
							{row.original.consumption_value.toFixed(2)} kW
						</p>
					</div>
				);
			},
		},
		{
			id: "peak_consumption",
			accessorKey: "peak_consumption",
			header: "Peak",
			meta: { width: 100, align: "right" },
			cell: ({ row }) => {
				return (
					<div className="text-right">
						<p className="text-gray-900">
							{row.original.peak_consumption.toFixed(2)} kW
						</p>
					</div>
				);
			},
		},
		{
			id: "cycle_duration",
			accessorKey: "cycle_duration",
			header: "Cycle",
			meta: { width: 100, align: "right" },
			cell: ({ row }) => {
				return (
					<div className="text-right">
						<p className="text-gray-900">
							{row.original.cycle_duration}s
						</p>
					</div>
				);
			},
		},
		{
			id: "on_duration",
			accessorKey: "on_duration",
			header: "On Time",
			meta: { width: 100, align: "right" },
			cell: ({ row }) => {
				return (
					<div className="text-right">
						<p className="text-gray-900">
							{row.original.on_duration}s
						</p>
					</div>
				);
			},
		},
		{
			id: "is_default",
			accessorKey: "is_default",
			header: "Type",
			meta: { width: 100, align: "center" },
			cell: ({ row }) => {
				return (
					<div className="flex justify-center">
						<Badge
							variant={row.original.is_default ? "default" : "secondary"}
							className={
								row.original.is_default
									? "bg-blue-100 text-blue-800 hover:bg-blue-200"
									: "bg-green-100 text-green-800 hover:bg-green-200"
							}
						>
							{row.original.is_default ? "Default" : "Custom"}
						</Badge>
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "",
			meta: { width: 80, align: "center" },
			cell: ({ row }) => {
				return <Actions row={row.original} onEdit={onEditDevice} />;
			},
		},
	];

	return columns;
};
