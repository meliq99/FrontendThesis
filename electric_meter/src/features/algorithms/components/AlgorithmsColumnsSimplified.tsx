import type { ColumnDef } from "@tanstack/react-table";
import { Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Algorithm } from "../hooks/queries";

export const useAlgorithmsColumnsSimplified = (): ColumnDef<Algorithm>[] => {
	const columns: ColumnDef<Algorithm>[] = [
		{
			id: "icon",
			accessorKey: "algorithm_type",
			header: "",
			meta: { width: 50, align: "center" },
			cell: () => {
				return (
					<div className="flex justify-center items-center">
						<div className="p-1.5 rounded-full bg-indigo-50 text-indigo-600">
							<Code size={16} />
						</div>
					</div>
				);
			},
		},
		{
			id: "name",
			accessorKey: "name",
			header: "Algorithm",
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
			id: "algorithm_type",
			accessorKey: "algorithm_type",
			header: "Type",
			meta: { width: 100, align: "center" },
			cell: ({ row }) => {
				return (
					<div className="flex justify-center">
						<Badge
							variant="outline"
							className="text-xs bg-purple-50 text-purple-700 border-purple-200"
						>
							{row.original.algorithm_type}
						</Badge>
					</div>
				);
			},
		},
	];

	return columns;
}; 