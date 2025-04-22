import { SimulationDevice } from "../hooks/queries";

interface DrawingContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export const drawEnergyMeter = (
  { ctx, width, height }: DrawingContext,
  consumption: number
) => {
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
  const maxConsumption = 5; // kW
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

export const drawDeviceConnections = (
  { ctx, width, height }: DrawingContext,
  devices: SimulationDevice[]
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