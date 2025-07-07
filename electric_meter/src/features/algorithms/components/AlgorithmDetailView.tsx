import { useCallback, useState } from "react";
import { X, Edit, Trash2, Code, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Algorithm } from "../hooks/queries";
import { useDeleteAlgorithm } from "../hooks/mutations";
import { useAlgorithmStore } from "../stores/AlgorithmStore";
import { EditAlgorithmDialog } from "./EditAlgorithmDialog";

interface AlgorithmDetailViewProps {
	algorithm: Algorithm;
}

export const AlgorithmDetailView: React.FC<AlgorithmDetailViewProps> = ({ 
	algorithm 
}) => {
	const { closeDetailView } = useAlgorithmStore();
	const { mutate: deleteAlgorithm } = useDeleteAlgorithm();
	const [isScriptExpanded, setIsScriptExpanded] = useState(false);

	const toggleScriptExpansion = useCallback(() => {
		setIsScriptExpanded(prev => !prev);
	}, []);

	const handleDelete = useCallback(() => {
		deleteAlgorithm(algorithm.id, {
			onSuccess: () => {
				console.log("Algorithm deleted successfully");
				closeDetailView();
			},
			onError: (error) => {
				console.error("Failed to delete algorithm:", error);
			},
		});
	}, [algorithm.id, deleteAlgorithm, closeDetailView]);

	const handleClose = useCallback(() => {
		closeDetailView();
	}, [closeDetailView]);

	return (
		<div className="h-full flex flex-col">
			{/* Header with actions */}
			<div className="flex items-center justify-between p-3 border-b border-gray-200">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
						<Code size={24} />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-900">{algorithm.name}</h2>
						<p className="text-sm text-gray-500">{algorithm.description}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<EditAlgorithmDialog
						trigger={
							<Button
								variant="outline"
								size="sm"
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

			{/* Algorithm details */}
			<div className="flex-1 overflow-y-auto p-3">
				<div className="flex flex-col min-h-full gap-4 pb-4">
					{/* Basic Information */}
					<Card className="flex-shrink-0">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-6">
								<div>
									<div className="text-sm font-medium text-gray-700 mb-1">Algorithm ID</div>
									<p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{algorithm.id}</p>
								</div>
								<div>
									<div className="text-sm font-medium text-gray-700 mb-1">Type</div>
									<div>
										<Badge
											variant="outline"
											className="bg-purple-50 text-purple-700 border-purple-200"
										>
											{algorithm.algorithm_type}
										</Badge>
									</div>
								</div>
							</div>
							<div>
								<div className="text-sm font-medium text-gray-700 mb-1">Name</div>
								<p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded font-semibold">{algorithm.name}</p>
							</div>
							<div>
								<div className="text-sm font-medium text-gray-700 mb-1">Description</div>
								<p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{algorithm.description}</p>
							</div>
						</CardContent>
					</Card>

					{/* Algorithm Script - Takes most space */}
					<Card className="flex-grow">
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<Code className="h-4 w-4 text-indigo-600" />
								Algorithm Script
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<div className="flex items-center justify-between mb-2">
									<div className="text-sm font-medium text-gray-700">Implementation</div>
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
												initial={{ height: 200, opacity: 0.8 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 200, opacity: 0.8 }}
												transition={{ duration: 0.3, ease: "easeInOut" }}
												className="p-3 max-h-96 overflow-y-auto"
											>
												<pre className="whitespace-pre-wrap">
													{algorithm.script}
												</pre>
											</motion.div>
										) : (
											<motion.div
												key="collapsed"
												initial={{ height: "auto", opacity: 0.8 }}
												animate={{ height: 200, opacity: 1 }}
												exit={{ height: "auto", opacity: 0.8 }}
												transition={{ duration: 0.3, ease: "easeInOut" }}
												className="p-3 overflow-hidden relative"
											>
												<pre className="whitespace-pre-wrap">
													{algorithm.script.length > 400 
														? `${algorithm.script.substring(0, 400)}...` 
														: algorithm.script
													}
												</pre>
												{algorithm.script.length > 400 && (
													<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
												)}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Script Statistics */}
					<Card className="flex-shrink-0">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Script Statistics</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-3 gap-4">
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-sm font-medium text-gray-700 mb-1">Lines of Code</div>
									<p className="text-xl font-bold text-gray-900">
										{algorithm.script.split('\n').length}
									</p>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-sm font-medium text-gray-700 mb-1">Characters</div>
									<p className="text-xl font-bold text-gray-900">
										{algorithm.script.length}
									</p>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-sm font-medium text-gray-700 mb-1">Functions</div>
									<p className="text-xl font-bold text-gray-900">
										{(algorithm.script.match(/def\s+\w+/g) || []).length}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}; 