import { useCallback, useMemo, useState } from "react";
import { X, Edit, Trash2, Code, Cpu, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Device } from "@/types/device";
import { getDeviceIcon } from "@/features/device-palette/utils/deviceIcons";
import { useDeleteDevice } from "@/features/device-palette/hooks/mutations";
import { useDeviceStore } from "../stores/DeviceStore";
import { EditDeviceDialog } from "./EditDeviceDialog";
import { useSimulationConfig } from "@/hooks/queries";

interface DeviceDetailViewProps {
	device: Device;
}

export const DeviceDetailView: React.FC<DeviceDetailViewProps> = ({ 
	device 
}) => {
	const { closeDetailView } = useDeviceStore();
	const { mutate: deleteDevice } = useDeleteDevice();
	const { data: simulationConfig } = useSimulationConfig();
	const [isScriptExpanded, setIsScriptExpanded] = useState(false);

	// Find the algorithm that corresponds to this device
	const deviceAlgorithm = useMemo(() => {
		if (!simulationConfig?.consumption_algorithms || !device.algorithm_id) {
			return null;
		}
		return simulationConfig.consumption_algorithms.find(
			algorithm => algorithm.id === device.algorithm_id
		);
	}, [simulationConfig?.consumption_algorithms, device.algorithm_id]);

	const toggleScriptExpansion = useCallback(() => {
		setIsScriptExpanded(prev => !prev);
	}, []);

	const handleDelete = useCallback(() => {
		deleteDevice(device.id, {
			onSuccess: () => {
				console.log("Device deleted successfully");
				closeDetailView();
			},
			onError: (error) => {
				console.error("Failed to delete device:", error);
			},
		});
	}, [device.id, deleteDevice, closeDetailView]);

	const handleClose = useCallback(() => {
		closeDetailView();
	}, [closeDetailView]);

	return (
		<div className="h-full flex flex-col">
			{/* Header with actions */}
			<div className="flex items-center justify-between p-3 border-b border-gray-200">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
						{getDeviceIcon({ name: device.icon, size: 24 })}
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-900">{device.name}</h2>
						<p className="text-sm text-gray-500">{device.description}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<EditDeviceDialog
						trigger={
							<Button
								variant="outline"
								size="sm"
								disabled={device.is_default}
								className="flex items-center gap-2"
							>
								<Edit className="h-4 w-4" />
								Edit
							</Button>
						}
						onUpdateSuccess={closeDetailView}
					/>
					<Button
						variant="outline"
						size="sm"
						onClick={handleDelete}
						disabled={device.is_default}
						className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
					>
						<Trash2 className="h-4 w-4" />
						Delete
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleClose}
						className="flex items-center gap-2"
					>
						<X className="h-4 w-4" />
						Close
					</Button>
				</div>
			</div>

			{/* Device details */}
			<div className="flex-1 overflow-y-auto p-3">
				<div className="flex flex-col min-h-full gap-4 pb-4">
					{/* Basic Information - Takes more space */}
					<Card className="flex-grow">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-6">
								<div>
									<div className="text-sm font-medium text-gray-700 mb-1">Device ID</div>
									<p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{device.id}</p>
								</div>
								<div>
									<div className="text-sm font-medium text-gray-700 mb-1">Type</div>
									<div>
										<Badge
											variant={device.is_default ? "default" : "secondary"}
											className={
												device.is_default
													? "bg-blue-100 text-blue-800"
													: "bg-green-100 text-green-800"
											}
										>
											{device.is_default ? "Default Device" : "Custom Device"}
										</Badge>
									</div>
								</div>
							</div>
							<div>
								<div className="text-sm font-medium text-gray-700 mb-1">Description</div>
								<p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{device.description}</p>
							</div>
							<div>
								<div className="text-sm font-medium text-gray-700 mb-1">Algorithm ID</div>
								<p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{device.algorithm_id}</p>
							</div>
						</CardContent>
					</Card>

					{/* Consumption Details - Takes more space */}
					<Card className="flex-grow">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Consumption Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-6">
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<div className="text-sm font-medium text-gray-700 mb-2">Base Consumption</div>
									<p className="text-2xl font-bold text-gray-900">
										{device.consumption_value.toFixed(2)}
									</p>
									<p className="text-sm text-gray-500">kW</p>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<div className="text-sm font-medium text-gray-700 mb-2">Peak Consumption</div>
									<p className="text-2xl font-bold text-gray-900">
										{device.peak_consumption.toFixed(2)}
									</p>
									<p className="text-sm text-gray-500">kW</p>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<div className="text-sm font-medium text-gray-700 mb-2">Cycle Duration</div>
									<p className="text-2xl font-bold text-gray-900">
										{device.cycle_duration}
									</p>
									<p className="text-sm text-gray-500">seconds</p>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<div className="text-sm font-medium text-gray-700 mb-2">On Duration</div>
									<p className="text-2xl font-bold text-gray-900">
										{device.on_duration}
									</p>
									<p className="text-sm text-gray-500">seconds</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Algorithm Information */}
					<Card className="flex-shrink-0">
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<Cpu className="h-4 w-4 text-indigo-600" />
								Algorithm Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							{deviceAlgorithm ? (
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<div className="text-sm font-medium text-gray-700 mb-1">Algorithm Name</div>
											<p className="text-sm text-gray-900 font-semibold">{deviceAlgorithm.name}</p>
										</div>
										<div>
											<div className="text-sm font-medium text-gray-700 mb-1">Type</div>
											<Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
												{deviceAlgorithm.algorithm_type}
											</Badge>
										</div>
									</div>
									<div>
										<div className="text-sm font-medium text-gray-700 mb-1">Description</div>
										<p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
											{deviceAlgorithm.description}
										</p>
									</div>
									<div>
										<div className="flex items-center justify-between mb-2">
											<div className="text-sm font-medium text-gray-700 flex items-center gap-1">
												<Code className="h-3 w-3" />
												Algorithm Script
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={toggleScriptExpansion}
												className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
											>
												{isScriptExpanded ? (
													<>
														<ChevronUp className="h-3 w-3 mr-1" />
														Collapse
													</>
												) : (
													<>
														<ChevronDown className="h-3 w-3 mr-1" />
														Expand
													</>
												)}
											</Button>
										</div>
										<div className="bg-gray-900 text-gray-100 rounded-md text-xs font-mono overflow-hidden">
											<AnimatePresence mode="wait">
												{isScriptExpanded ? (
													<motion.div
														key="expanded"
														initial={{ height: 96, opacity: 0.8 }}
														animate={{ height: "auto", opacity: 1 }}
														exit={{ height: 96, opacity: 0.8 }}
														transition={{ duration: 0.3, ease: "easeInOut" }}
														className="p-3 max-h-96 overflow-y-auto"
													>
														<pre className="whitespace-pre-wrap">
															{deviceAlgorithm.script}
														</pre>
													</motion.div>
												) : (
													<motion.div
														key="collapsed"
														initial={{ height: "auto", opacity: 0.8 }}
														animate={{ height: 96, opacity: 1 }}
														exit={{ height: "auto", opacity: 0.8 }}
														transition={{ duration: 0.3, ease: "easeInOut" }}
														className="p-3 overflow-hidden relative"
													>
														<pre className="whitespace-pre-wrap">
															{deviceAlgorithm.script.length > 200 
																? `${deviceAlgorithm.script.substring(0, 200)}...` 
																: deviceAlgorithm.script
															}
														</pre>
														{deviceAlgorithm.script.length > 200 && (
															<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
														)}
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									</div>
								</div>
							) : (
								<div className="text-center py-4">
									<div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
										<Cpu className="h-6 w-6 text-gray-400" />
									</div>
									<p className="text-sm text-gray-500">Algorithm not found</p>
									<p className="text-xs text-gray-400 mt-1">ID: {device.algorithm_id}</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Consumption Pattern Visualization - Smaller at bottom */}
					<Card className="flex-shrink-0">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Consumption Pattern</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-700">Duty Cycle</span>
									<span className="font-medium text-lg">
										{((device.on_duration / device.cycle_duration) * 100).toFixed(1)}%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-3">
									<div
										className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
										style={{
											width: `${(device.on_duration / device.cycle_duration) * 100}%`,
										}}
									/>
								</div>
								<div className="flex justify-between text-xs text-gray-500">
									<span>Off ({device.cycle_duration - device.on_duration}s)</span>
									<span>On ({device.on_duration}s)</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}; 