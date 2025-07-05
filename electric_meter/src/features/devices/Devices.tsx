import { useCallback, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulationConfig } from "@/hooks/queries";
import { GeneralTable } from "@/layouts/GeneralTable";
import { useDevicesColumns } from "./DevicesColumns";
import { useDevicesColumnsSimplified } from "./DevicesColumnsSimplified";
import { DeviceDetailView } from "./components/DeviceDetailView";
import { useDeviceStore } from "./store/DeviceStore";
import type { Device } from "@/types/device";

const Devices: React.FC = () => {
	const {
		data: simulationConfig,
		isLoading,
		error,
		refetch,
	} = useSimulationConfig();
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const { activeDevice, isDetailViewOpen, openDetailView } = useDeviceStore();

	const devices = simulationConfig?.devices ?? [];

	// Simulate infinite scroll with large datasets
	const simulatedDevices = useMemo(() => {
		if (devices.length === 0) return [];

		return devices;
	}, [devices]);



	const handleRowClick = useCallback((device: Device) => {
		openDetailView(device);
	}, [openDetailView]);

	const handleLoadMore = useCallback(() => {
		setIsLoadingMore(true);
		// Simulate network delay
		setTimeout(() => {
			setIsLoadingMore(false);
			console.log("Load more triggered - ready for backend pagination");
		}, 1000);
	}, []);

	const columns = useDevicesColumns({
		onEditDevice: () => {}, // No longer needed since we use dialog
	});

	const simplifiedColumns = useDevicesColumnsSimplified();

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
							<title>Error loading devices</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
					</div>
					<p className="text-lg font-medium text-gray-900 mb-2">
						Error loading devices
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
					<div className="mb-4">
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Device Management
						</h1>
						<p className="text-sm text-gray-600">
							{isDetailViewOpen
								? "Click on any device to view details"
								: "Manage your energy simulation devices."}
						</p>
					</div>

					<GeneralTable
						columns={isDetailViewOpen ? simplifiedColumns : columns}
						data={simulatedDevices}
						isLoading={isLoading}
						onRowClick={handleRowClick}
						emptyMessage="No devices found."
						className="flex-1"
						hasMore={false}
						onLoadMore={handleLoadMore}
						isLoadingMore={isLoadingMore}
						pageSize={10}
					/>
				</div>

				{/* Detail View (Right side) */}
				<AnimatePresence>
					{isDetailViewOpen && activeDevice && (
						<motion.div
							className="flex-1 min-w-0"
							initial={{ opacity: 0, x: "100%" }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: "100%" }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<div className="h-full border border-gray-200 rounded-lg bg-white">
								<DeviceDetailView
									device={activeDevice}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Devices;
