import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
	TableHead as UITableHead,
} from "@/components/ui/table";

// Define custom meta type for columns
declare module "@tanstack/react-table" {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData, TValue> {
		width?: number;
		align?: "left" | "center" | "right";
	}
}

interface GeneralTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading?: boolean;
	onRowClick?: (row: TData) => void;
	emptyMessage?: string;
	className?: string;
	// Infinite scroll props
	hasMore?: boolean;
	onLoadMore?: () => void;
	isLoadingMore?: boolean;
	pageSize?: number;
	// Row highlighting
	activeRowId?: string;
}

export function GeneralTable<TData, TValue>({
	columns,
	data,
	isLoading = false,
	onRowClick,
	emptyMessage = "No data available",
	className = "",
	hasMore = false,
	onLoadMore,
	isLoadingMore = false,
	pageSize = 20,
	activeRowId,
}: GeneralTableProps<TData, TValue>) {
	const [visibleData, setVisibleData] = useState<TData[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const tableContainerRef = useRef<HTMLDivElement>(null);

	// Initialize visible data
	useEffect(() => {
		if (data.length > 0) {
			setVisibleData(data.slice(0, pageSize));
			setCurrentPage(1);
		} else {
			setVisibleData([]);
		}
	}, [data, pageSize]);

	// Load more data when scrolling
	const loadMore = useCallback(() => {
		if (hasMore && onLoadMore) {
			// If we have a backend pagination, call onLoadMore
			onLoadMore();
		} else {
			// Otherwise, load more from the existing data array
			const nextPage = currentPage + 1;
			const startIndex = 0;
			const endIndex = nextPage * pageSize;
			const newVisibleData = data.slice(startIndex, endIndex);
			
			if (newVisibleData.length > visibleData.length) {
				setVisibleData(newVisibleData);
				setCurrentPage(nextPage);
			}
		}
	}, [hasMore, onLoadMore, currentPage, pageSize, data, visibleData.length]);

	// Intersection Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const target = entries[0];
				if (target.isIntersecting && !isLoading && !isLoadingMore) {
					const canLoadMore = hasMore || (visibleData.length < data.length);
					if (canLoadMore) {
						loadMore();
					}
				}
			},
			{
				threshold: 0.1,
				root: tableContainerRef.current,
				rootMargin: "100px",
			}
		);

		const loadMoreEl = loadMoreRef.current;
		if (loadMoreEl) {
			observer.observe(loadMoreEl);
		}

		return () => {
			if (loadMoreEl) {
				observer.unobserve(loadMoreEl);
			}
		};
	}, [loadMore, isLoading, isLoadingMore, hasMore, visibleData.length, data.length]);

	const table = useReactTable({
		data: visibleData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Create a function to get column widths based on column definitions
	const getColumnWidths = useCallback(() => {
		return columns.map((column) => {
			return column.meta && "width" in column.meta
				? (column.meta.width as number)
				: "auto";
		});
	}, [columns]);

	const columnWidths = getColumnWidths();

	const showLoadingTrigger = !isLoading && (hasMore || visibleData.length < data.length);

	return (
		<div className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden ${className}`}>
			<div 
				ref={tableContainerRef}
				className="overflow-auto flex-1"
			>
				<table className="w-full table-fixed border-collapse">
					<colgroup>
						{columns.map((column, i) => (
							<col
								key={`col-${column.id || i}`}
								style={{ width: `${columnWidths[i]}px` }}
							/>
						))}
					</colgroup>
					
					<TableHeader className="sticky top-0 z-10 bg-gray-50">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<UITableHead
										key={header.id}
										className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200"
										style={{
											textAlign: header.column.columnDef.meta?.align || "left",
										}}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</UITableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{!isLoading && table.getRowModel().rows?.length ? (
							<>
								{table.getRowModel().rows.map((row, index) => {
									const isActive = activeRowId && (row.original as { id?: string })?.id === activeRowId;
									return (
									<TableRow
										key={row.id}
										onClick={() => onRowClick?.(row.original)}
										className={`
											transition-all duration-200
											${onRowClick ? "cursor-pointer hover:bg-indigo-50" : ""}
											${isActive ? "bg-indigo-100 border-indigo-200" : index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
										`}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell 
												key={cell.id}
												className="px-6 py-4 text-sm text-gray-900 border-b border-gray-100"
												style={{
													textAlign: cell.column.columnDef.meta?.align || "left",
												}}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
									);
								})}
								
								{/* Loading trigger for infinite scroll */}
								{showLoadingTrigger && (
									<TableRow>
										<TableCell colSpan={columns.length} className="p-0">
											<div 
												ref={loadMoreRef}
												className="h-16 flex items-center justify-center"
											>
												{isLoadingMore ? (
													<div className="flex items-center gap-2">
														<Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
														<span className="text-sm text-gray-500">Loading more...</span>
													</div>
												) : (
													<div className="h-1" /> // Invisible trigger
												)}
											</div>
										</TableCell>
									</TableRow>
								)}
							</>
						) : isLoading ? (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-64 p-0">
									<div className="flex h-full items-center justify-center">
										<div className="flex flex-col items-center gap-3">
											<Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
											<p className="text-sm text-gray-500">Loading...</p>
										</div>
									</div>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-64 p-0">
									<div className="flex h-full items-center justify-center">
										<div className="text-center">
											<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
												<svg
													className="w-8 h-8 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-label="No data icon"
												>
													<title>No data available</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
													/>
												</svg>
											</div>
											<p className="text-lg font-medium text-gray-900 mb-2">No data found</p>
											<p className="text-sm text-gray-500">{emptyMessage}</p>
										</div>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</table>
			</div>
		</div>
	);
}

export default GeneralTable;
