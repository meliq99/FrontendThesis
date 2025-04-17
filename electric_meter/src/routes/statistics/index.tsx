import ConsumptionGraph from '@/features/dashboard/components/ConsumptionGraph'
import DevicePalette from '@/features/dashboard/components/DevicePalette';
import EnergyMeter from '@/features/dashboard/components/EnergyMeter';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useMediaQuery } from "@/hooks/use-media-query"
import { Device } from '@/types/device';
import mqtt from 'mqtt';

// WebSocket endpoint provided by the RabbitMQ Web MQTT plugin.
const MQTT_ENDPOINT = "ws://localhost:15675/ws";
const topic = "test/mqtt";

// Set connection options using guest credentials.
const options = {
  username: 'guest',
  password: 'guest'
};

const StatisticsRootComponent = () => {
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [client, setClient] = useState(null);
  const [data, setData] = useState<number[]>([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  const generateSingleDataPoint = () => {
    return Math.random() * 10;
  }

  useEffect(() => {
    // Create the client here so the listeners are attached immediately.
    const mqttClient = mqtt.connect(MQTT_ENDPOINT, options);

    mqttClient.on('connect', () => {
      console.log("Connected to MQTT Broker via WebSocket");
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });
    
    mqttClient.on("message", (receivedTopic, message) => {
      console.log("Message Received on topic", receivedTopic, ":", message.toString());
      // Process the message as needed...
    });
    
    setClient(mqttClient);

    // Clean up on unmount
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const baseConsumption = 0.5;
      const deviceConsumption = connectedDevices.reduce((sum, device) => sum + device.consumption_value, 0)
      const totalConsumption = baseConsumption + deviceConsumption;

      const newConsumption = totalConsumption + (Math.random() * 0.2 - 0.1);
      setTotalConsumption(newConsumption);

      setData(prevData => {
        const newData = [...prevData, generateSingleDataPoint()];
        return newData.length > 20 ? newData.slice(1) : newData;
      });
    }, 2000); // 2 seconds interval

    return () => clearInterval(interval);
  }, [connectedDevices]); // Added connectedDevices to dependency array for correct consumption calculation

  const handleAddDevice = (device: Device) => {
    setConnectedDevices((prev) => [...prev, device]);
  }

  const handleRemoveDevice = (id: string) => {
    setConnectedDevices((prev) => prev.filter((device) => device.id !== id))
  }

  const backend = isMobile ? TouchBackend : HTML5Backend;
  return (
    <DndProvider backend={backend}>
      <main className="flex min-h-screen flex-col bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Energy Meter Simulator</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Side palette */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <DevicePalette onAddDevice={handleAddDevice} />
            </div>

            {/* Main content */}
            <div className="lg:col-span-10 order-1 lg:order-2">
              <div className="grid gap-6">
                {/* Energy meter canvas */}
                <div className="bg-card rounded-lg shadow-sm p-4 border">
                  <h2 className="text-xl font-semibold mb-4">Energy Meter</h2>
                  <EnergyMeter
                    connectedDevices={connectedDevices}
                    totalConsumption={totalConsumption}
                    onRemoveDevice={handleRemoveDevice}
                  />
                </div>

                {/* Consumption graph */}
                <div className="bg-card rounded-lg shadow-sm p-4 border">
                  <h2 className="text-xl font-semibold mb-4">Consumption Graph</h2>
                  <ConsumptionGraph data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DndProvider>
  )
}

export const Route = createFileRoute('/statistics/')({
  component: StatisticsRootComponent,
})
