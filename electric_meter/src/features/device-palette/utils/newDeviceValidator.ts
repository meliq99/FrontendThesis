import { z } from "zod"
 
export const newDeviceFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  consumption_value: z.number().min(0).max(100),
  is_default: z.boolean(),
  peak_consumption: z.number().min(0).max(100),
  cycle_duration: z.number().min(0).max(100),
  on_duration: z.number().min(0).max(100),
  algorithm_id: z.string(),
})