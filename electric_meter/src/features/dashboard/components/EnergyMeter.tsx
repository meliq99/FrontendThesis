import { useRef, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import type { Device } from "@/types/device";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EnergyMeterProps {
  connectedDevices: Device[];
  totalConsumption: number;
  onRemoveDevice: (id: string) => void;
}

const EnergyMeter = ({ connectedDevices, totalConsumption, onRemoveDevice }: EnergyMeterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Set up drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "device",
    drop: () => ({ name: "EnergyMeter" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Initialize canvas and handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (container) {
          const width = container.clientWidth;
          const height = Math.min(400, window.innerHeight * 0.5);
          setCanvasSize({ width, height });
          canvas.width = width;
          canvas.height = height;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Draw on canvas when size or connected devices change
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx && canvasSize.width > 0 && canvasSize.height > 0) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw energy meter
        drawEnergyMeter(ctx, canvas.width, canvas.height, totalConsumption);

        // Draw connections to devices
        drawDeviceConnections(ctx, canvas.width, canvas.height, connectedDevices);
      }
    }
  }, [canvasSize, connectedDevices, totalConsumption]);

  const drawEnergyMeter = (ctx: CanvasRenderingContext2D, width: number, height: number, consumption: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#f9fafb";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#e5e7eb";
    ctx.stroke();

    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.85, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    // Draw consumption indicator
    const maxConsumption = 100; // kW - standardized maximum
    const percentage = Math.min(consumption / maxConsumption, 1);
    const startAngle = Math.PI * 0.8;
    const endAngle = startAngle + Math.PI * 1.4 * percentage;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.7, startAngle, endAngle);
    ctx.lineWidth = 10;

    // Change color based on consumption level
    let color = "#22c55e"; // Green for low consumption
    if (percentage > 0.6) color = "#f59e0b"; // Yellow for medium
    if (percentage > 0.8) color = "#ef4444"; // Red for high

    ctx.strokeStyle = color;
    ctx.stroke();

    // Draw consumption text
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#1f2937";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${consumption.toFixed(2)} kW`, centerX, centerY);

    // Draw label
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Current Consumption", centerX, centerY + 30);
  };

  const drawDeviceConnections = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    devices: Device[]
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    // Calculate positions around the meter
    devices.forEach((device, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(devices.length, 1);
      const deviceX = centerX + Math.cos(angle) * (radius * 1.5);
      const deviceY = centerY + Math.sin(angle) * (radius * 1.5);

      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(deviceX, deviceY);
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw device icon background
      ctx.beginPath();
      ctx.arc(deviceX, deviceY, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "#f3f4f6";
      ctx.fill();
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw device label (first character)
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(device.name.charAt(0), deviceX, deviceY);
    });
  };

  return (
    <div
      ref={drop}
      className={cn(
        "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors",
        isOver ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      )}
      style={{ minHeight: "400px" }}
    >
      <canvas ref={canvasRef} className="w-full" />

      {connectedDevices.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Drag and drop devices here to connect them to the meter
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {connectedDevices.map((device) => (
          <Badge key={device.id} variant="secondary" className="flex items-center gap-1 py-1.5">
            {device.name} ({device.consumption_value.toFixed(1)} kW)
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 rounded-full"
              onClick={() => onRemoveDevice(device.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {device.name}</span>
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default EnergyMeter;
