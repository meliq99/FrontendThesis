import { z } from "zod";

export const newDeviceFormSchema = z.object({
	name: z.string().min(2).max(1000),
	description: z.string().min(2).max(1000),
	consumption_value: z.number().min(0).max(1000),
	is_default: z.boolean(),
	peak_consumption: z.number().min(0).max(1000),
	cycle_duration: z.number().min(0).max(1000),
	on_duration: z.number().min(0).max(1000),
	algorithm_id: z.string().min(1, { message: "Algorithm is required" }),
});
