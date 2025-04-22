import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';

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
  reconnect: () => void;
}

export function useMqttConnection(): MqttConnectionResult {
  const [client, setClient]             = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected]   = useState(false);
  const [connectionError, setConnError] = useState<string | null>(null);
  const [lastMessage, setLastMessage]   = useState<string | null>(null);
  const [totalConsumption, setTotal]    = useState(0);

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

      // otherwise assume it's a consumption update
      if (typeof data.value === 'number') {
        setTotal(data.value);
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

  return {
    client,
    isConnected,
    connectionError,
    lastMessage,
    totalConsumption,
    simulationRunning,
    simulationStatus: simulationRunning ? 'running' : 'stopped',
    reconnect,
  };
}
