import React from "react";
import type { Device } from "@/types/device";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDevices } from "../hooks/useDevices";
import { DevicesGrid } from "./DevicesGrid";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { ErrorDisplay } from "./ErrorDisplay";
import  NewDeviceDialog  from "./NewDeviceDialog";

interface DevicePaletteProps {
  onAddDevice: (device: Device) => void;
}

export const DevicePalette: React.FC<DevicePaletteProps> = ({ onAddDevice }) => {
  const { devices, loading, error, refreshDevices } = useDevices();

  return (
    <Card className="h-full rounded-none">
      <CardHeader className="pb-3">
        <CardTitle>Devices</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingPlaceholder />
        ) : error ? (
          <ErrorDisplay message={error} onRetry={refreshDevices} />
        ) : (
          <DevicesGrid devices={devices} onAddDevice={onAddDevice} />
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          Drag and drop devices onto the meter to connect them
        </div>
        <NewDeviceDialog/>
      </CardContent>

      {/* <CardHeader>
        <CardTitle>News Devices </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4 text-s text-muted-foreground">
          You can create new devices according to your needed.
        </div>

      <NewDeviceDialog/>        
      </CardContent> */}
    </Card>
  );
};

export default DevicePalette;