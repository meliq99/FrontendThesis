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


const StatisticsRootComponent = () => {
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)")
  const generateSingleDataPoint = () => {
    return Math.random() * 10;
  }


  useEffect(() => {
    const interval = setInterval(() => {
      const baseConsumption = 0.5;
      const deviceConsumption = connectedDevices.reduce((sum, device) => sum + device.consumption, 0)
      const totalConsumption = baseConsumption + deviceConsumption;

      const newConsumption = totalConsumption + (Math.random() * 0.2 - 0.1);
      setTotalConsumption(newConsumption);



      setData(prevData => {
        const newData = [...prevData, generateSingleDataPoint()];
        return newData.length > 20 ? newData.slice(1) : newData;


      });
    }, 2000); // 2 seconds interval

    return () => clearInterval(interval);
  }, []); // Empty dependency array is correct here since we're using functional updates

  const handleAddDevice = (device: Device) => {
    setConnectedDevices((prev) => [...prev, device]);
  }

  const handleRemoveDevice = (id: string) => {
    setConnectedDevices((prev) => prev.filter((device) => device.id !== id))
  }

  const backend = isMobile ? TouchBackend : HTML5Backend
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

// const ProvisionalStatisticsComponent = () => {
//   return (
//     <div className='bg-yellow-500 h-1/2'>
//       <p>Provisional Statistics</p>
//     </div>
//   )
// }

// const DevicePaletteComponent = () => {

//   const devices = [
//     {
//       text: 'Light Bulb',
//       color: 'red',
//       consumption: 0.06,
//       icon: <Lightbulb />
//     },
//     {
//       text: 'Television',
//       color: 'blue',
//       consumption: 0.15,
//       icon: <Tv />
//     },
//     {
//       text: 'Refrigerator',
//       color: 'green',
//       consumption: 0.2,
//       icon: <Refrigerator />
//     }
//   ];

//   return (
//     <div className='flex gap-4 p-4 h-screen bg-blue-500'>
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle>Devices</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-3">
//             {devices.map((device) => (
//               <DeviceItem
//                 key={device.text}
//                 text={device.text}
//                 color={device.color}
//                 consumption={device.consumption}
//                 icon={device.icon}
//               />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//       <div className='flex-1 h-1/4 bg-red-500'>
//         <ProvisionalStatisticsComponent />
//       </div>
//     </div>
//   )
// }

export const Route = createFileRoute('/statistics/')({
  component: StatisticsRootComponent,
})


