import React, { useCallback } from "react";
import { AlertTriangle } from "lucide-react";

import { ConnectedDevicesList } from "./ConnectedDevicesList";
import { useSimulationStore } from "@/stores/SimulationStore";
import { useSimulationDevices } from "../hooks/queries";
import { useMqttConnection } from "@/hooks/useMqttConnection";
import { useDropTarget } from "../hooks/useDropTarget";
import type { Device } from "@/types/device";
import { useStartSimulation, useStopSimulation } from "../hooks/mutations";

export interface ElectricMeterProps {
  onRemoveDevice: (id: string) => void;
}

const ElectricMeter: React.FC<ElectricMeterProps> = ({ onRemoveDevice }) => {
  const { config } = useSimulationStore();
  const {mutate: stopSimulation} = useStopSimulation({simulationId: config?.simulation?.id || ""})
    // Callback for when a device is dropped
  const handleDeviceDrop = useCallback((item: Device) => {
    console.log("📊 Device added to meter:", item);
  }, []);

  // React‑DND drop setup using custom hook
  const { isOver, dropRef } = useDropTarget({
    onDrop: handleDeviceDrop
  });

  // Fetch devices & config
  const { mutate: startSimulation } = useStartSimulation({simulationId: config?.simulation?.id || ""})

  const { data: devices } = useSimulationDevices({
    electricMeterId: config?.simulation?.electric_meter_id,
  });

  // MQTT hook
  const {
    totalConsumption,
    isConnected,
    connectionError,
    reconnect,
    simulationRunning,
  } = useMqttConnection();

  // Gauge math: –90° to +90°
  const maxC = 1000;  
  const pct  = Math.min(1, Math.max(0, totalConsumption / maxC));
  const angle = pct * 180 - 90;

  // Start/Stop console stubs
  const handleStart = () => startSimulation();
  const handleStop  = () => stopSimulation();

  return (
    <div
      ref={dropRef}
      className={`electric-meter__card ${isOver ? "electric-meter__card--over" : ""}`}
    >
      {/* Fallback prompt when empty + dragging */}
      {(!devices || devices.length === 0) && (
        <div
          className={`electric-meter__drop-prompt ${
            isOver ? "electric-meter__drop-prompt--visible" : ""
          }`}
        >
          Drag and drop devices here to connect them
        </div>
      )}

      {/* Gauge */}
      <div className="electric-meter__gauge-wrapper">
        <svg viewBox="0 0 200 120" className="electric-meter__gauge">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#4ade80" />
              <stop offset="50%"  stopColor="#facc15" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* bg arc */}
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            stroke="#e5e7eb"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />

          {/* fg arc */}
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            stroke="url(#gaugeGrad)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 80 * pct} ${Math.PI * 80}`}
            className="electric-meter__arc-fg"
          />
        </svg>

        {/* Needle */}
        <div
          className="electric-meter__needle"
          style={{ "--angle": `${angle}deg` } as any}
        />

        {/* Center label */}
        <div className="electric-meter__value">
          <div className="text-2xl font-bold">
            {totalConsumption.toFixed(2)} kW
          </div>
          <div className="text-xs text-gray-500">Current Consumption</div>
        </div>
      </div>

      {/* Start / Stop */}
      <div className="electric-meter__controls">
        <button
          onClick={handleStart}
          type="button"
          className="electric-meter__btn electric-meter__btn--start z-10"
        >
          ▶️ Start
        </button>
        <button
          onClick={handleStop}
          className="electric-meter__btn electric-meter__btn--stop z-10"
        >
          ⏹️ Stop
        </button>
      </div>

      {/* Status */}
      <div className="electric-meter__status">
        <StatusBadge
          on={isConnected}
          onText="MQTT Connected"
          offText="Simulation Mode"
          onColor="green"
          offColor="yellow"
        />
        <StatusBadge
          on={simulationRunning}
          onText="Simulation Running"
          offText="Simulation Stopped"
          onColor="green"
          offColor="red"
        />

        {connectionError && (
          <div className="electric-meter__error">
            <AlertTriangle className="h-4 w-4" />
            <span className="truncate">{connectionError}</span>
          </div>
        )}

        {!isConnected && (
          <button
            onClick={reconnect}
            className="electric-meter__btn electric-meter__btn--reconnect"
          >
            🔄 Reconnect
          </button>
        )}
      </div>

      {/* Device list */}
      <ConnectedDevicesList
        devices={devices || []}
        onRemoveDevice={onRemoveDevice}
      />
    </div>
  );
};

interface StatusBadgeProps {
  on: boolean;
  onText: string;
  offText: string;
  onColor: "green" | "yellow" | "red";
  offColor: "green" | "yellow" | "red";
}
const StatusBadge: React.FC<StatusBadgeProps> = ({
  on,
  onText,
  offText,
  onColor,
  offColor,
}) => (
  <div
    className={`electric-meter__badge ${
      on
        ? `electric-meter__badge--${onColor}`
        : `electric-meter__badge--${offColor}`
    }`}
  >
    <span className="electric-meter__badge-dot" />
    <span>{on ? onText : offText}</span>
  </div>
);

export default ElectricMeter;
