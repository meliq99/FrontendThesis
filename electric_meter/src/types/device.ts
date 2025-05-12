export interface Device {
  id: string;
  name: string;
  description: string;
  consumption_value: number;
  icon: string;
  is_default: boolean;
  peak_consumption: number;
  cycle_duration: number;
  on_duration: number;
  algorithm_id: string;
}