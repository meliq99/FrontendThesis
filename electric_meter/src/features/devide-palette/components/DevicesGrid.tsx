import React from "react";
import type { Device } from "@/types/device";
import { DeviceItem } from "./DeviceItem";

interface DevicesGridProps {
  devices: Omit<Device, "id">[];
  onAddDevice: (device: Device) => void;
}

export const DevicesGrid: React.FC<DevicesGridProps> = ({ devices, onAddDevice }) => {
  if (devices.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No devices available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {devices.map((device) => (
        <DeviceItem 
          key={device.name} 
          device={device} 
          onAddDevice={onAddDevice} 
        />
      ))}
    </div>
  );
}; 