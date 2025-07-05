import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Device } from "@/types/device";
import { getDeviceIcon } from "@/features/device-palette/utils/deviceIcons";

export const useDevicesColumnsSimplified = (): ColumnDef<Device>[] => {
	const columns: ColumnDef<Device>[] = [
		{
			id: "icon",
			accessorKey: "icon",
			header: "",
			meta: { width: 50, align: "center" },
			cell: ({ row }) => {
				return (
					<div className="flex justify-center items-center">
						<div className="p-1.5 rounded-full bg-indigo-50 text-indigo-600">
							{getDeviceIcon({ name: row.original.icon, size: 16 })}
						</div>
					</div>
				);
			},
		},
		{
			id: "name",
			accessorKey: "name",
			header: "Device",
			meta: { width: 150 },
			cell: ({ row }) => {
				return (
					<div className="flex flex-col">
						<p className="font-medium text-gray-900 text-sm">{row.original.name}</p>
						<p className="text-xs text-gray-500 truncate max-w-[130px]">
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
			meta: { width: 100, align: "right" },
			cell: ({ row }) => {
				return (
					<div className="text-right">
						<p className="font-medium text-gray-900 text-sm">
							{row.original.consumption_value.toFixed(1)} kW
						</p>
					</div>
				);
			},
		},
		{
			id: "is_default",
			accessorKey: "is_default",
			header: "Type",
			meta: { width: 80, align: "center" },
			cell: ({ row }) => {
				return (
					<div className="flex justify-center">
						<Badge
							variant={row.original.is_default ? "default" : "secondary"}
							className={`text-xs ${
								row.original.is_default
									? "bg-blue-100 text-blue-800 hover:bg-blue-200"
									: "bg-green-100 text-green-800 hover:bg-green-200"
							}`}
						>
							{row.original.is_default ? "Default" : "Custom"}
						</Badge>
					</div>
				);
			},
		},
	];

	return columns;
}; 