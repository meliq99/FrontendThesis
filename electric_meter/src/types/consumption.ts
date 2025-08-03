export interface ConsumptionDataPoint {
  value: number;
  unit: string;
  timestamp: number;
  simulation_id: string;
  time_speed: number;
  time_unit: string;
}

export interface MqttConsumptionMessage {
  value: number;
  unit: string;
  time_unit: string;
  time_speed: number;
  simulation_id: string;
  timestamp: number;
}