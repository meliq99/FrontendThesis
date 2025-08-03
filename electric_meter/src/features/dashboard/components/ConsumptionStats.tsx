import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Zap, RotateCcw } from "lucide-react";
import type { ConsumptionDataPoint } from "@/types/consumption";

interface ConsumptionStatsProps {
  data: ConsumptionDataPoint[];
  totalDataPoints: number;
  onResetDataPoints?: () => void;
}

export const ConsumptionStats = ({ data, totalDataPoints, onResetDataPoints }: ConsumptionStatsProps) => {
  const [showMoney, setShowMoney] = useState(false);
  const [cumulativeCost, setCumulativeCost] = useState(0);
  const kWhCost = 0.12; // $0.12 per kWh (average US rate)

  // Calculate cumulative cost when new data arrives
  useEffect(() => {
    if (data.length < 2) return;
    
    // Get the latest two data points to calculate time interval
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    if (latest.unit === 'kW' && latest.timestamp && previous.timestamp) {
      // Calculate time difference in hours (real time, not simulation time)
      const timeDiffSeconds = latest.timestamp - previous.timestamp;
      const timeDiffHours = timeDiffSeconds / 3600;
      
      // Adjust for simulation time speed if available
      const timeSpeed = latest.time_speed || 1.0;
      const adjustedTimeDiffHours = timeDiffHours * timeSpeed;
      
      // Calculate energy consumed in this interval (kWh)
      // Use average of current and previous values for better accuracy
      const avgConsumption = (latest.value + previous.value) / 2;
      const energyConsumed = avgConsumption * adjustedTimeDiffHours;
      
      // Calculate cost for this interval
      const intervalCost = energyConsumed * kWhCost;
      
      // Add to cumulative cost
      setCumulativeCost(prev => prev + intervalCost);
    }
  }, [data, kWhCost]);

  const stats = useMemo(() => {
    if (data.length === 0) {
      return {
        current: 0,
        average: 0,
        peak: 0,
        total: 0,
        unit: 'kW'
      };
    }

    const values = data.map(point => point.value);
    const current = values[values.length - 1] || 0;
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const peak = Math.max(...values);
    const total = values.reduce((sum, val) => sum + val, 0);
    const unit = data[0]?.unit || 'kW';

    return {
      current: Number(current.toFixed(3)),
      average: Number(average.toFixed(3)),
      peak: Number(peak.toFixed(3)),
      total: Number(total.toFixed(3)),
      unit
    };
  }, [data]);

  const formatValue = (value: number, unit: string) => {
    if (showMoney && unit === 'kW') {
      // Convert kW to cost per hour
      const costPerHour = value * kWhCost;
      return `$${costPerHour.toFixed(4)}/h`;
    }
    return `${value} ${unit}`;
  };

  const resetCumulativeCost = () => {
    setCumulativeCost(0);
  };

  return (
    <div className="space-y-3">
      {/* Control Buttons */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={showMoney ? "default" : "outline"}
            onClick={() => setShowMoney(!showMoney)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              showMoney 
                ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-white" 
                : "text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200"
            }`}
          >
            {showMoney ? <DollarSign className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
            {showMoney ? "Show Energy" : "Show Cost"}
          </Button>
          {showMoney && (
            <span className="text-xs text-gray-500">
              @ $0.12/kWh
            </span>
          )}
        </div>
        
        {/* Cumulative Cost Display & Reset */}
        {showMoney && (
          <div className="flex items-center justify-between bg-indigo-50 px-3 py-2 rounded-md border border-indigo-200">
            <div className="flex-1">
              <div className="text-xs font-medium text-indigo-600 mb-1">
                Cumulative Cost
                {data.length > 0 && data[0].time_speed !== 1.0 && (
                  <span className="ml-1 text-indigo-500">
                    ({data[0].time_speed}x speed)
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-indigo-700">
                ${cumulativeCost.toFixed(4)}
              </div>
              <div className="text-xs text-indigo-500 mt-1">
                Running total since session start
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={resetCumulativeCost}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 border-indigo-200 ml-2"
              title="Reset cumulative cost counter"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Compact Stats Labels */}
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border">
          <span className="text-sm font-medium text-gray-600">Current</span>
          <span className="text-sm font-bold text-indigo-600">
            {formatValue(stats.current, stats.unit)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border">
          <span className="text-sm font-medium text-gray-600">Average</span>
          <span className="text-sm font-bold text-green-600">
            {formatValue(stats.average, stats.unit)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border">
          <span className="text-sm font-medium text-gray-600">Peak</span>
          <span className="text-sm font-bold text-red-600">
            {formatValue(stats.peak, stats.unit)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border">
          <span className="text-sm font-medium text-gray-600">Data Points</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-purple-600">
              {totalDataPoints}
              {data.length < totalDataPoints && (
                <span className="text-xs text-gray-400 ml-1">
                  ({data.length} shown)
                </span>
              )}
            </span>
            {onResetDataPoints && totalDataPoints > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={onResetDataPoints}
                className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 hover:border-purple-300 border-purple-200"
                title="Reset data points counter"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};