import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateNewDeviceHeader from "./NewDeviceHeader";
import CreateNewDeviceFooter from "./NewDeviceFooter";
import { Plus } from "lucide-react";
import NewDeviceForm from "./NewDeviceForm";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { newDeviceFormSchema } from "../utils/newDeviceValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useCreateDevice, useUpdateDevice } from "../hooks/mutations";
import { useState, useEffect, useCallback } from "react";
import type { Device } from "@/types/device";

interface NewDeviceDialogProps {
	isEditMode?: boolean;
	editDevice?: Device | null;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: React.ReactNode;
	onUpdateSuccess?: () => void;
}

export const NewDeviceDialog = ({
	isEditMode = false,
	editDevice = null,
	isOpen: controlledIsOpen,
	onOpenChange: controlledOnOpenChange,
	trigger,
	onUpdateSuccess,
}: NewDeviceDialogProps) => {
	const [internalIsOpen, setInternalIsOpen] = useState(false);
	const { mutate: createDevice } = useCreateDevice();
	const { mutate: updateDevice } = useUpdateDevice();

	// Use controlled or internal state
	const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
	const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

	const getDefaultValues = useCallback(() => {
		if (isEditMode && editDevice) {
			return {
				name: editDevice.name,
				description: editDevice.description,
				consumption_value: editDevice.consumption_value,
				peak_consumption: editDevice.peak_consumption,
				cycle_duration: editDevice.cycle_duration,
				on_duration: editDevice.on_duration,
				algorithm_id: editDevice.algorithm_id,
				is_default: editDevice.is_default,
			};
		}
		return {
			name: "",
			description: "",
			consumption_value: 0,
			peak_consumption: 0,
			cycle_duration: 0,
			on_duration: 0,
			algorithm_id: "",
			is_default: false,
		};
	}, [isEditMode, editDevice]);

	const newDeviceForm = useForm<z.infer<typeof newDeviceFormSchema>>({
		resolver: zodResolver(newDeviceFormSchema),
		defaultValues: getDefaultValues(),
	});

	// Reset form when editDevice changes
	useEffect(() => {
		newDeviceForm.reset(getDefaultValues());
	}, [getDefaultValues, newDeviceForm]);

	const onSubmit = (values: z.infer<typeof newDeviceFormSchema>) => {
		if (isEditMode && editDevice) {
			// Update existing device
			updateDevice(
				{ ...values, id: editDevice.id },
				{
					onSuccess: () => {
						// Reset form and close dialog on success
						newDeviceForm.reset();
						setIsOpen(false);
						// Call the success callback if provided
						onUpdateSuccess?.();
					},
					onError: (error) => {
						// Keep dialog open on error
						console.error("Failed to update device:", error);
					},
				}
			);
		} else {
			// Create new device
			createDevice(values, {
				onSuccess: () => {
					// Reset form and close dialog on success
					newDeviceForm.reset();
					setIsOpen(false);
				},
				onError: (error) => {
					// Keep dialog open on error
					console.error("Failed to create device:", error);
				},
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{trigger ? (
				<DialogTrigger asChild>
					{trigger}
				</DialogTrigger>
			) : (
				<DialogTrigger asChild>
					<Button variant="outline" size="sm" className="w-full mt-4 gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300">
						<Plus className="h-4 w-4" />
						Add Custom Device
					</Button>
				</DialogTrigger>
			)}
			<DialogContent className="sm:max-w-[425px]">
				<Form {...newDeviceForm}>
					<form onSubmit={newDeviceForm.handleSubmit(onSubmit)}>
						<CreateNewDeviceHeader isEditMode={isEditMode} />
						<NewDeviceForm form={newDeviceForm} />
						<CreateNewDeviceFooter 
							onCancel={() => setIsOpen(false)} 
							isEditMode={isEditMode}
						/>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default NewDeviceDialog;
