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
import { useCreateDevice } from "../hooks/mutations";

export const NewDeviceDialog = () => {
	const { mutate: createDevice } = useCreateDevice();

	const newDeviceForm = useForm<z.infer<typeof newDeviceFormSchema>>({
		resolver: zodResolver(newDeviceFormSchema),
		defaultValues: {
			name: "",
			description: "",
			is_default: false,
		},
	});

	const onSubmit = (values: z.infer<typeof newDeviceFormSchema>) => {
		createDevice(values);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="w-full mt-4 gap-1">
					<Plus className="h-4 w-4" />
					Add Custom Device
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...newDeviceForm}>
					<form onSubmit={newDeviceForm.handleSubmit(onSubmit)}>
						<CreateNewDeviceHeader />
						<NewDeviceForm form={newDeviceForm} />
						<CreateNewDeviceFooter />
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default NewDeviceDialog;
