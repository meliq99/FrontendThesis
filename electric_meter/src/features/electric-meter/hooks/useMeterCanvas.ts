import { useEffect, MutableRefObject } from "react";
import type { Device } from "@/types/device";
import { drawEnergyMeter, drawDeviceConnections } from "../utils/canvasDrawing";
import { SimulationDevice } from "./queries";

interface UseMeterCanvasProps {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  canvasSize: { width: number; height: number };
  totalConsumption: number;
  connectedDevices: SimulationDevice[];
}

export const useMeterCanvas = ({
  canvasRef,
  canvasSize,
  totalConsumption,
  connectedDevices,
}: UseMeterCanvasProps) => {
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx && canvasSize.width > 0 && canvasSize.height > 0) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const drawingContext = {
          ctx,
          width: canvas.width,
          height: canvas.height,
        };

        // Draw energy meter
        drawEnergyMeter(drawingContext, totalConsumption);

        // Draw connections to devices
        drawDeviceConnections(drawingContext, connectedDevices);
      }
    }
  }, [canvasRef, canvasSize, connectedDevices, totalConsumption]);
}; 