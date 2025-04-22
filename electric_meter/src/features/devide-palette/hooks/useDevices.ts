import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { Device } from "@/types/device";

interface UseDevicesResult {
  devices: Omit<Device, "id">[];
  loading: boolean;
  error: string | null;
  refreshDevices: () => Promise<void>;
}

export function useDevices(): UseDevicesResult {
  const [devices, setDevices] = useState<Omit<Device, "id">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("http://localhost:8000/settings");
      setDevices(response.data?.devices || []);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch devices");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load devices on mount
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    refreshDevices: fetchDevices
  };
} 