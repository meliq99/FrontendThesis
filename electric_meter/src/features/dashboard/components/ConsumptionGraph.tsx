import {
    Chart,
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler,
    TooltipModel,
  } from "chart.js";
  import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
  import { Line } from "react-chartjs-2";
  import type { ConsumptionDataPoint } from "@/types/consumption";
  
  // Register Chart.js components
  Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip, Legend, Filler);
  
interface ConsumptionGraphProps {
  data: ConsumptionDataPoint[];
}

const ConsumptionGraph = ({ data }: ConsumptionGraphProps) => {
  // Convert timestamps to readable time labels based on time_unit and time_speed
  const formatTimestamp = (timestamp: number, timeUnit?: string, timeSpeed?: number) => {
    const date = new Date(timestamp * 1000);
    
    // Show simulation time info when time_speed is not 1.0
    const speedInfo = timeSpeed && timeSpeed !== 1.0 ? ` (${timeSpeed}x)` : '';
    
    // For seconds time unit, show MM:SS
    if (timeUnit === 'seconds') {
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour12: false, 
        minute: '2-digit', 
        second: '2-digit' 
      });
      return timeStr + speedInfo;
    }
    
    // For other time units or default, show full time
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit',
      minute: '2-digit', 
      second: '2-digit' 
    });
    return timeStr + speedInfo;
  };

  // Prepare chart data from consumption history using indigo palette
  const chartData = {
    labels: data.map(point => formatTimestamp(point.timestamp, point.time_unit, point.time_speed)),
    datasets: [
      {
        label: `Energy Consumption (${data[0]?.unit || 'kW'})`,
        data: data.map(point => point.value),
        borderColor: "#4f46e5", // indigo-600
        backgroundColor: "rgba(79, 70, 229, 0.08)", // indigo-600 with low opacity
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 1,
        pointHoverRadius: 6,
        pointBackgroundColor: "#4f46e5", // indigo-600
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#3730a3", // indigo-700 on hover
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No consumption data</p>
          <p className="text-sm">Start the simulation to see real-time energy consumption</p>
        </div>
      </div>
    );
  }
  
      const CustomTooltip = ({ tooltip }: { tooltip: TooltipModel<"line"> }) => {
    if (!tooltip || !tooltip.dataPoints) return null;

    const { dataPoints } = tooltip;
    const point = dataPoints?.length > 0 ? dataPoints[0] : null;

    if (!point) return null;

    const dataIndex = point.dataIndex;
    const dataPoint = data[dataIndex];
    const unit = dataPoint?.unit || 'kW';

    return (
      <div className="bg-white border border-indigo-200 rounded-lg shadow-lg p-3">
        <div className="text-sm font-medium text-gray-600 mb-1">{point.label}</div>
        <div className="text-base font-bold text-indigo-600">
          {Number(point.raw).toFixed(3)} {unit}
        </div>
      </div>
    );
  };
  
      const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      }
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: true,
          color: "#e0e7ff", // indigo-100
          lineWidth: 1,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          color: "#64748b",
          font: {
            size: 11,
          },
        },
      },
      y: {
        position: 'left' as const,
        border: {
          display: false,
        },
        beginAtZero: true,
        suggestedMax: Math.max(...data.map(p => p.value)) * 1.1 || 0.2,
        grid: {
          display: true,
          color: "#e0e7ff", // indigo-100
          lineWidth: 1,
        },
        ticks: {
          precision: 3,
          color: "#64748b",
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return `${Number(value).toFixed(3)} ${data[0]?.unit || 'kW'}`;
          }
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: CustomTooltip,
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round' as const,
        borderCapStyle: 'round' as const,
      },
    },
  };
  
    return (
      <div className="w-full h-[300px]">
        <ChartContainer className="w-full h-full" config={{}}>
          <Line data={chartData} options={options} />
        </ChartContainer>
      </div>
    );
  };
  
  export default ConsumptionGraph;
  