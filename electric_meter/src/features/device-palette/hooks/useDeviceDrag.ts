import { useDrag } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import type { Device } from "@/types/device";

interface UseDeviceDragProps {
  device: Omit<Device, "id">;
  onAddDevice: (device: Device) => void;
}

interface UseDeviceDragResult {
  isDragging: boolean;
  dragRef: (node: HTMLElement | null) => void;
}

export function useDeviceDrag({ device, onAddDevice }: UseDeviceDragProps): UseDeviceDragResult {
  const [{ isDragging }, dragSource] = useDrag(() => ({
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
  }), [device, onAddDevice]);

  // This fixes the TypeScript ref issue
  const dragRef = (node: HTMLElement | null) => {
    dragSource(node);
  };

  return {
    isDragging,
    dragRef
  };
} 