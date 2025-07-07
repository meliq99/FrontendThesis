import { NewDeviceDialog } from "@/features/device-palette/components/NewDeviceDialog";
import { useDeviceStore } from "../stores/DeviceStore";
import { useState } from "react";

interface EditDeviceDialogProps {
	trigger: React.ReactNode;
	onUpdateSuccess?: () => void;
}

export const EditDeviceDialog = ({ trigger, onUpdateSuccess }: EditDeviceDialogProps) => {
	const { activeDevice } = useDeviceStore();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<NewDeviceDialog
			isEditMode={true}
			editDevice={activeDevice}
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			trigger={trigger}
			onUpdateSuccess={onUpdateSuccess}
		/>
	);
}; 