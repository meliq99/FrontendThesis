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
  
  // Register Chart.js components
  Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip, Legend, Filler);
  
  interface ConsumptionGraphProps {
    data: number[];
  }
  
  const ConsumptionGraph = ({ data }: ConsumptionGraphProps) => {
    // Generate labels for the last 20 seconds
    const labels = Array.from({ length: data.length }, (_, i) => `${data.length - i}s ago`).reverse();
  
    // If we have less than 2 data points, add some placeholder data
    const displayData = data.length < 2 ? [0.5, 0.5, ...data] : data;
    const displayLabels = data.length < 2 ? ["", "", ...labels] : labels;
  
    const CustomTooltip = ({ tooltip }: { tooltip: TooltipModel<"line"> }) => {
      if (!tooltip) return null;
  
      const { dataPoints } = tooltip;
      const point = dataPoints[0];
  
      if (!point) return null;
  
      return (
        <ChartTooltipContent
          active={true}
          payload={[{ value: Number(point.raw), name: "Consumption" }]}
          label={point.label}
          formatter={(value) => `${value} kW`}
        />
      );
    };
  
    const chartData = {
      labels: displayLabels,
      datasets: [
        {
          label: "Energy Consumption (kW)",
          data: displayData,
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(...displayData) * 1.2 || 1,
          grid: {
            color: "hsl(var(--border) / 0.5)",
          },
          ticks: {
            precision: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          external: CustomTooltip,
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
  