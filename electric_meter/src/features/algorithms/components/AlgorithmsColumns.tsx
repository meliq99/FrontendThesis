import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Code } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Algorithm } from "../hooks/queries";
import { useDeleteAlgorithm } from "../hooks/mutations";

interface ActionsProps {
	row: Algorithm;
	onEdit?: (algorithm: Algorithm) => void;
}

const Actions = ({ row, onEdit }: ActionsProps) => {
	const { mutate: deleteAlgorithm } = useDeleteAlgorithm();

	const handleEdit = useCallback(() => {
		onEdit?.(row);
	}, [row, onEdit]);

	const handleDelete = useCallback(() => {
		deleteAlgorithm(row.id, {
			onSuccess: () => {
				console.log("Algorithm deleted successfully");
			},
			onError: (error) => {
				console.error("Failed to delete algorithm:", error);
			},
		});
	}, [row.id, deleteAlgorithm]);

	return (
		<div className="flex items-center gap-1">
			<Button
				variant="ghost"
				size="sm"
				className="h-8 w-8 p-0 hover:bg-indigo-50"
				onClick={handleEdit}
				aria-label="Edit algorithm"
			>
				<Edit className="h-4 w-4 text-indigo-600" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="h-8 w-8 p-0 hover:bg-red-50"
				onClick={handleDelete}
				aria-label="Delete algorithm"
			>
				<Trash2 className="h-4 w-4 text-red-600" />
			</Button>
		</div>
	);
};

interface UseColumnsProps {
	onEditAlgorithm?: (algorithm: Algorithm) => void;
}

export const useAlgorithmsColumns = ({ onEditAlgorithm }: UseColumnsProps = {}): ColumnDef<Algorithm>[] => {
	const columns: ColumnDef<Algorithm>[] = [
		{
			id: "icon",
			accessorKey: "algorithm_type",
			header: "",
			meta: { width: 60, align: "center" },
			cell: () => {
				return (
					<div className="flex justify-center items-center">
						<div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
							<Code size={20} />
						</div>
					</div>
				);
			},
		},
		{
			id: "name",
			accessorKey: "name",
			header: "Algorithm Name",
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
			id: "algorithm_type",
			accessorKey: "algorithm_type",
			header: "Type",
			meta: { width: 120, align: "center" },
			cell: ({ row }) => {
				return (
					<div className="flex justify-center">
						<Badge
							variant="outline"
							className="bg-purple-50 text-purple-700 border-purple-200"
						>
							{row.original.algorithm_type}
						</Badge>
					</div>
				);
			},
		},
		{
			id: "script_preview",
			accessorKey: "script",
			header: "Script Preview",
			meta: { width: 300 },
			cell: ({ row }) => {
				const preview = row.original.script.length > 100 
					? `${row.original.script.substring(0, 100)}...`
					: row.original.script;
				
				return (
					<div className="font-mono text-xs bg-gray-50 p-2 rounded border max-w-[280px]">
						<pre className="whitespace-pre-wrap text-gray-700 truncate">
							{preview}
						</pre>
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "",
			meta: { width: 80, align: "center" },
			cell: ({ row }) => {
				return <Actions row={row.original} onEdit={onEditAlgorithm} />;
			},
		},
	];

	return columns;
}; 