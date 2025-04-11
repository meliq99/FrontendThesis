import ConsumptionGraph from '@/features/dashboard/components/ConsumptionGraph'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

const StatisticsRootComponent = () => {
  const [data, setData] = useState<number[]>([]);
  
  const generateSingleDataPoint = () => {
    return Math.random() * 10;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData, generateSingleDataPoint()];
        return newData.length > 20 ? newData.slice(1) : newData;
      });
    }, 2000); // 2 seconds interval

    return () => clearInterval(interval);
  }, []); // Empty dependency array is correct here since we're using functional updates
  
  return (
    <>
      <p>statistics PAGE</p>
      <ConsumptionGraph data={data}/>
    </>
  )
}

export const Route = createFileRoute('/statistics/')({
  component: StatisticsRootComponent,
})


