import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import type { ConsumptionDataPoint } from '@/types/consumption';

const MQTT_ENDPOINT = 'ws://localhost:15675/ws';
const MQTT_TOPIC    = 'test/mqtt';
const MQTT_OPTIONS  = {
  username: 'guest',
  password: 'guest',
  reconnectPeriod: 2000,
  keepalive: 5,
};



interface MqttConnectionResult {
  client: MqttClient | null;
  isConnected: boolean;
  connectionError: string | null;
  lastMessage: string | null;
  totalConsumption: number;
  simulationRunning: boolean;
  simulationStatus: 'running' | 'stopped';
  consumptionHistory: ConsumptionDataPoint[];
  totalDataPoints: number;
  reconnect: () => void;
  resetDataPoints: () => void;
}

export function useMqttConnection(): MqttConnectionResult {
  const [client, setClient]             = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected]   = useState(false);
  const [connectionError, setConnError] = useState<string | null>(null);
  const [lastMessage, setLastMessage]   = useState<string | null>(null);
  const [totalConsumption, setTotal]    = useState(0);
  const [consumptionHistory, setConsumptionHistory] = useState<ConsumptionDataPoint[]>([]);
  const [totalDataPoints, setTotalDataPoints] = useState(0);

  // new: explicit status flag
  const [simulationRunning, setSimulationRunning] = useState(false);

  const connectToMqtt = useCallback(() => {
    setConnError(null);
    const c = mqtt.connect(MQTT_ENDPOINT, MQTT_OPTIONS);

    c.on('connect', () => {
      setIsConnected(true);
      c.subscribe(MQTT_TOPIC, err => {
        if (err) console.error('Subscribe failed:', err);
      });
    });
    c.on('error', err => {
      setIsConnected(false);
      setConnError(err.message);
    });
    c.on('offline', () => setIsConnected(false));
    c.on('reconnect', () => setIsConnected(false));
    c.on('close', () => setIsConnected(false));

    c.on('message', (_, msg) => {
      const str = msg.toString();
      setLastMessage(str);

      // parse JSON once
      let data: any;
      try {
        data = JSON.parse(str);
      } catch {
        return;
      }

      // handle status events explicitly
      if (data.subject === 'status' && typeof data.value === 'string') {
        setSimulationRunning(data.value === 'started');
        return;
      }

      // handle consumption updates with new format
      if (typeof data.value === 'number' && data.unit && data.timestamp) {
        setTotal(data.value);
        
        // Add to history (keep last 50 points for performance)
        const newDataPoint: ConsumptionDataPoint = {
          value: data.value,
          unit: data.unit,
          timestamp: data.timestamp,
          simulation_id: data.simulation_id || '',
          time_speed: data.time_speed || 1.0,
          time_unit: data.time_unit || 'seconds'
        };
        
        setConsumptionHistory(prev => {
          const updated = [...prev, newDataPoint];
          return updated.length > 50 ? updated.slice(-50) : updated;
        });
        
        // Increment total data points counter
        setTotalDataPoints(prev => prev + 1);
      }
    });

    // also hook underlying WS for immediate drops
    const ws = (c as any).stream as WebSocket | undefined;
    if (ws) {
      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);
    }

    setClient(c);
    return c;
  }, []);

  // mount + cleanup
  useEffect(() => {
    const c = connectToMqtt();
    return () => { c?.end(true); };
  }, [connectToMqtt]);

  // keep client.connected in sync
  useEffect(() => {
    if (!client) return;
    const h = setInterval(() => {
      setIsConnected(client.connected);
    }, 1000);
    return () => clearInterval(h);
  }, [client]);

  const reconnect = useCallback(() => {
    if (client) {
      client.end(true, {}, () => connectToMqtt());
    } else {
      connectToMqtt();
    }
  }, [client, connectToMqtt]);

  const resetDataPoints = useCallback(() => {
    setTotalDataPoints(0);
    setConsumptionHistory([]);
  }, []);

  return {
    client,
    isConnected,
    connectionError,
    lastMessage,
    totalConsumption,
    simulationRunning,
    simulationStatus: simulationRunning ? 'running' : 'stopped',
    consumptionHistory,
    totalDataPoints,
    reconnect,
    resetDataPoints,
  };
}
