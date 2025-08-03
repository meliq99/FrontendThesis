import { z } from "zod";

export const newDeviceFormSchema = z.object({
	name: z.string().min(2).max(50),
	description: z.string().min(2).max(50),
	consumption_value: z.number().min(0).max(50, { message: "Base consumption cannot exceed 50 kW" }),
	is_default: z.boolean(),
	peak_consumption: z.number().min(0).max(100, { message: "Peak consumption cannot exceed 100 kW" }),
	cycle_duration: z.number().min(0).max(86400, { message: "Cycle duration cannot exceed 24 hours (86400 seconds)" }),
	on_duration: z.number().min(0).max(86400, { message: "On duration cannot exceed 24 hours (86400 seconds)" }),
	algorithm_id: z.string().min(1, { message: "Algorithm is required" }),
});
