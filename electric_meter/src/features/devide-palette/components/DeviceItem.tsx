import React from "react";
import type { Device } from "@/types/device";
import { useDeviceDrag } from "../hooks/useDeviceDrag";
import { getDeviceIcon } from "../utils/deviceIcons";

interface DeviceItemProps {
  device: Omit<Device, "id">;
  onAddDevice: (device: Device) => void;
}

export const DeviceItem: React.FC<DeviceItemProps> = ({ device, onAddDevice }) => {
  const { isDragging, dragRef } = useDeviceDrag({
    device,
    onAddDevice,
  });

  return (
    <div
      ref={dragRef}
      className="flex flex-col items-center justify-center p-2 rounded-md border cursor-move transition-colors hover:bg-accent"
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.95)' : 'scale(1)',
        transition: 'opacity 0.2s, transform 0.2s'
      }}
    >
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        {getDeviceIcon({ name: device.algorithm_id ? "Refrigerator" : "Lightbulb", size: 24 })}
      </div>
      <div className="mt-2 text-sm font-medium text-center">{device.name}</div>
      <div className="text-xs text-muted-foreground">{device.consumption_value.toFixed(2)} kW</div>
    </div>
  );
}; 