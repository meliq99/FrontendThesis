import { useCallback, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlgorithms } from "../hooks/queries";
import { GeneralTable } from "@/layouts/GeneralTable";
import { useAlgorithmsColumns } from "./AlgorithmsColumns";
import { useAlgorithmsColumnsSimplified } from "./AlgorithmsColumnsSimplified";
import { AlgorithmDetailView } from "./AlgorithmDetailView";
import { NewAlgorithmDialog } from "./NewAlgorithmDialog";
import { useAlgorithmStore } from "../stores/AlgorithmStore";
import { Button } from "@/components/ui/button";
import type { Algorithm } from "../hooks/queries";

const Algorithms: React.FC = () => {
	const {
		data: algorithms,
		isLoading,
		error,
		refetch,
	} = useAlgorithms();
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const { activeAlgorithm, isDetailViewOpen, openDetailView } = useAlgorithmStore();

	const algorithmList = algorithms ?? [];

	// Simulate infinite scroll with large datasets
	const simulatedAlgorithms = useMemo(() => {
		if (algorithmList.length === 0) return [];
		return algorithmList;
	}, [algorithmList]);

	const handleRowClick = useCallback((algorithm: Algorithm) => {
		openDetailView(algorithm);
	}, [openDetailView]);

	const handleLoadMore = useCallback(() => {
		setIsLoadingMore(true);
		// Simulate network delay
		setTimeout(() => {
			setIsLoadingMore(false);
			console.log("Load more triggered - ready for backend pagination");
		}, 1000);
	}, []);

	const columns = useAlgorithmsColumns({
		onEditAlgorithm: () => {}, // No longer needed since we use dialog
	});

	const simplifiedColumns = useAlgorithmsColumnsSimplified();

	if (error) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
						<svg
							className="w-8 h-8 text-red-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="Error icon"
						>
							<title>Error loading algorithms</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
					</div>
					<p className="text-lg font-medium text-gray-900 mb-2">
						Error loading algorithms
					</p>
					<p className="text-sm text-gray-500 mb-4">{error.message}</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 h-full overflow-hidden">
			<div className="flex h-full gap-6">
				{/* Table View (Left side) */}
				<div
					className={`flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
						isDetailViewOpen ? "w-2/5" : "w-full"
					}`}
				>
					<div className="mb-4 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 mb-2">
								Algorithm Management
							</h1>
							<p className="text-sm text-gray-600">
								{isDetailViewOpen
									? "Click on any algorithm to view details"
									: "Manage your consumption simulation algorithms."}
							</p>
						</div>
						<NewAlgorithmDialog
							trigger={
								<Button className="bg-indigo-600 hover:bg-indigo-700">
									<svg
										className="w-4 h-4 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4v16m8-8H4"
										/>
									</svg>
									Add New Algorithm
								</Button>
							}
						/>
					</div>

					<GeneralTable
						columns={isDetailViewOpen ? simplifiedColumns : columns}
						data={simulatedAlgorithms}
						isLoading={isLoading}
						onRowClick={handleRowClick}
						emptyMessage="No algorithms found."
						className="flex-1"
						hasMore={false}
						onLoadMore={handleLoadMore}
						isLoadingMore={isLoadingMore}
						pageSize={10}
					/>
				</div>

				{/* Detail View (Right side) */}
				<AnimatePresence>
					{isDetailViewOpen && activeAlgorithm && (
						<motion.div
							className="flex-1 min-w-0"
							initial={{ opacity: 0, x: "100%" }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: "100%" }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<div className="h-full border border-gray-200 rounded-lg bg-white">
								<AlgorithmDetailView
									algorithm={activeAlgorithm}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Algorithms; 