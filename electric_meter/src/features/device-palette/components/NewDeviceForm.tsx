import type { useForm } from "react-hook-form";
import type { newDeviceFormSchema } from "../utils/newDeviceValidator";
import type { z } from "zod";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSimulationConfig } from "@/hooks/queries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NewDeviceForm = ({
	form,
}: {
	form: ReturnType<typeof useForm<z.infer<typeof newDeviceFormSchema>>>;
}) => {
	const { data: simulationConfig } = useSimulationConfig();

	const algorithms = simulationConfig?.consumption_algorithms;

	return (
		<div className="space-y-4 py-4">
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="consumption_value"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Consumption Value</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									type="number" 
									onChange={e => field.onChange(Number.parseFloat(e.target.value) || 0)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="peak_consumption"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Peak Consumption</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									type="number" 
									onChange={e => field.onChange(Number.parseFloat(e.target.value) || 0)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="cycle_duration"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cycle Duration</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									type="number" 
									onChange={e => field.onChange(Number.parseFloat(e.target.value) || 0)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="on_duration"
					render={({ field }) => (
						<FormItem>
							<FormLabel>On Duration</FormLabel>
							<FormControl>
								<Input 
									{...field} 
									type="number" 
									onChange={e => field.onChange(Number.parseFloat(e.target.value) || 0)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormField
				control={form.control}
				name="algorithm_id"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Algorithm</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select an algorithm" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{algorithms?.map((algorithm) => (
									<SelectItem key={algorithm.id} value={algorithm.id}>
										{algorithm.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};

export default NewDeviceForm;
