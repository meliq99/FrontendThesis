import { useState, useEffect } from "react";
import axios from "axios";
import { useDrag } from "react-dnd";
import type { Device } from "@/types/device";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Tv, Refrigerator, Fan, Laptop, Smartphone, Coffee, Wifi } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface DevicePaletteProps {
  onAddDevice: (device: Device) => void;
}

// // Available devices with their consumption values
// const availableDevices: Omit<Device, "id">[] = [
//   { name: "Light Bulb", icon: "Lightbulb", consumption: 0.06 },
//   { name: "Television", icon: "Tv", consumption: 0.15 },
//   { name: "Refrigerator", icon: "Refrigerator", consumption: 0.2 },
//   { name: "Fan", icon: "Fan", consumption: 0.08 },
//   { name: "Laptop", icon: "Laptop", consumption: 0.1 },
//   { name: "Smartphone", icon: "Smartphone", consumption: 0.02 },
//   { name: "Coffee Maker", icon: "Coffee", consumption: 0.9 },
//   { name: "WiFi Router", icon: "Wifi", consumption: 0.05 },
// ];
const getIconComponent = (icon: string) => {
  switch (icon) {
    case "Lightbulb":
      return <Lightbulb className="h-6 w-6" />;
    case "Tv":
      return <Tv className="h-6 w-6" />;
    case "Refrigerator":
      return <Refrigerator className="h-6 w-6" />;
    case "Fan":
      return <Fan className="h-6 w-6" />;
    case "Laptop":
      return <Laptop className="h-6 w-6" />;
    case "Smartphone":
      return <Smartphone className="h-6 w-6" />;
    case "Coffee":
      return <Coffee className="h-6 w-6" />;
    case "Wifi":
      return <Wifi className="h-6 w-6" />;
    default:
      return <Lightbulb className="h-6 w-6" />;
  }
};

const DeviceItem = ({
  device,
  onAddDevice,
}: {
  device: Omit<Device, "id">;
  onAddDevice: (device: Device) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "device",
    item: { ...device, id: uuidv4() },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ name?: string }>();
      if (item && dropResult && dropResult.name === "EnergyMeter") {
        onAddDevice({ ...device, id: uuidv4() });
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // // Map icon names to Lucide icons
  // const IconComponent = () => {
  //   switch (device.icon) {
  //     case "Lightbulb":
  //       return <Lightbulb className="h-6 w-6" />;
  //     case "Tv":
  //       return <Tv className="h-6 w-6" />;
  //     case "Refrigerator":
  //       return <Refrigerator className="h-6 w-6" />;
  //     case "Fan":
  //       return <Fan className="h-6 w-6" />;
  //     case "Laptop":
  //       return <Laptop className="h-6 w-6" />;
  //     case "Smartphone":
  //       return <Smartphone className="h-6 w-6" />;
  //     case "Coffee":
  //       return <Coffee className="h-6 w-6" />;
  //     case "Wifi":
  //       return <Wifi className="h-6 w-6" />;
  //     default:
  //       return <Lightbulb className="h-6 w-6" />;
  //   }
  // };

  return (
    <div
      ref={drag}
      className="flex flex-col items-center justify-center p-2 rounded-md border cursor-move transition-colors hover:bg-accent"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        {getIconComponent("Refrigerator")}
      </div>
      <div className="mt-2 text-sm font-medium text-center">{device.name}</div>
      <div className="text-xs text-muted-foreground">{device.consumption_value.toFixed(2)} kW</div>
    </div>
  );
};

const DevicePalette = ({ onAddDevice }: DevicePaletteProps) => {
  // Estado para guardar los dispositivos obtenidos desde el backend
  const [devices, setDevices] = useState<Omit<Device, "id">[]>([]);
  const [loading, setLoading] = useState(false);

  // Llamada a la API para traer dispositivos (por ejemplo, en el endpoint /api/devices)
  const getDevices = async () => {
    const response = await axios.get("http://localhost:8000/settings");
    setDevices(response.data?.devices || []);
  };

  useEffect(() => {
    setLoading(true);
    getDevices();
    setLoading(false);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Default Devices</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading devices...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {devices.map((device) => (
              <DeviceItem key={device.name} device={device} onAddDevice={onAddDevice} />
            ))}
          </div>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          Drag and drop devices onto the meter to connect them
        </div>
      </CardContent>
    </Card>
  );
}; 

// const DevicePalette = ({ onAddDevice }: DevicePaletteProps) => (
//   <Card>
//     <CardHeader className="pb-3">
//       <CardTitle>Devices</CardTitle>
//     </CardHeader>
//     <CardContent>
//       <div className="grid grid-cols-2 gap-3">
//         {availableDevices.map((device) => (
//           <DeviceItem key={device.name} device={device} onAddDevice={onAddDevice} />
//         ))}
//       </div>
//       <div className="mt-4 text-xs text-muted-foreground">
//         Drag and drop devices onto the meter to connect them
//       </div>
//     </CardContent>
//   </Card>
// );

export default DevicePalette;