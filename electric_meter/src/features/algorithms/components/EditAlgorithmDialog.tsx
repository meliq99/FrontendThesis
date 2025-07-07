import { NewAlgorithmDialog } from "../components/NewAlgorithmDialog";
import { useAlgorithmStore } from "../stores/AlgorithmStore";
import { useState } from "react";

interface EditAlgorithmDialogProps {
	trigger: React.ReactNode;
	onUpdateSuccess?: () => void;
}

export const EditAlgorithmDialog = ({ trigger, onUpdateSuccess }: EditAlgorithmDialogProps) => {
	const { activeAlgorithm } = useAlgorithmStore();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<NewAlgorithmDialog
			isEditMode={true}
			editAlgorithm={activeAlgorithm}
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			trigger={trigger}
			onUpdateSuccess={onUpdateSuccess}
		/>
	);
}; 