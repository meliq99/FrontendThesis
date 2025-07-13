import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ActivePeriod {
  start: number; // in minutes
  end: number; // in minutes
  id: string;
}

interface InteractionState {
  type: 'create' | 'resize-start' | 'resize-end' | 'move';
  periodId: string;
  // For 'create', this is the initial mousedown position.
  // For 'move', this is the offset from period start to mousedown position.
  meta: number;
}


interface ScheduleEditorProps {
  schedule: [number, number][]; // in seconds
  onScheduleChange: (schedule: [number, number][]) => void;
}

const TOTAL_MINUTES_IN_DAY = 24 * 60;

// Helper to convert seconds to minutes for a schedule
const scheduleToMinutes = (schedule: [number, number][]): Omit<ActivePeriod, 'id'>[] => {
  return schedule.map(([start, end]) => ({
    start: Math.round(start / 60),
    end: Math.round(end / 60),
  }));
};

// Helper to convert minutes to seconds for a schedule
const scheduleToSeconds = (periods: Omit<ActivePeriod, 'id'>[]): [number, number][] => {
  return periods.map(({ start, end }) => [start * 60, end * 60]);
};

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  schedule,
  onScheduleChange,
}) => {
  const [activePeriods, setActivePeriods] = useState<ActivePeriod[]>([]);
  
  const [interaction, setInteraction] = useState<InteractionState | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const initialPeriodsRef = useRef<ActivePeriod[]>([]);

  useEffect(() => {
    const minutePeriods = scheduleToMinutes(schedule);
    if (JSON.stringify(minutePeriods) !== JSON.stringify(activePeriods.map(({ start, end }) => ({ start, end })))) {
      setActivePeriods(minutePeriods.map((p, i) => ({ ...p, id: `period-${i}-${Date.now()}` })));
    }
  }, [schedule]);

  const commitChanges = useCallback((updatedPeriods: Omit<ActivePeriod, 'id'>[]) => {
    // Merge overlapping or adjacent periods
    if (updatedPeriods.length < 1) {
      onScheduleChange([]);
      return;
    }

    const sorted = [...updatedPeriods].sort((a, b) => a.start - b.start);
    const merged: Omit<ActivePeriod, 'id'>[] = [];
    let current = { ...sorted[0] };

    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];
      if (next.start <= current.end) {
        current.end = Math.max(current.end, next.end);
      } else {
        merged.push(current);
        current = { ...next };
      }
    }
    merged.push(current);
    onScheduleChange(scheduleToSeconds(merged));
  }, [onScheduleChange]);

  const pixelToMinutes = useCallback((pixel: number, timelineWidth: number) => {
    const ratio = pixel / timelineWidth;
    return Math.max(0, Math.min(TOTAL_MINUTES_IN_DAY, Math.round(ratio * TOTAL_MINUTES_IN_DAY)));
  }, []);

  const minutesToPixel = useCallback((minutes: number, timelineWidth: number) => {
    return (minutes / TOTAL_MINUTES_IN_DAY) * timelineWidth;
  }, []);

  const handleMouseDownOnTimeline = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const startMin = pixelToMinutes(e.clientX - rect.left, rect.width);
    const newPeriodId = `period-${Date.now()}`;
    
    const newPeriod = { id: newPeriodId, start: startMin, end: startMin };
    initialPeriodsRef.current = [...activePeriods, newPeriod];
    setActivePeriods(initialPeriodsRef.current);
    setInteraction({ type: 'create', periodId: newPeriodId, meta: startMin });
  }, [pixelToMinutes, activePeriods]);

  const handleMouseDownOnPeriod = (e: React.MouseEvent, periodId: string) => {
    e.stopPropagation();
    if (!timelineRef.current) return;
    const period = activePeriods.find(p => p.id === periodId);
    if (!period) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickMin = pixelToMinutes(e.clientX - rect.left, rect.width);
    const offset = clickMin - period.start;
    initialPeriodsRef.current = activePeriods;
    setInteraction({ type: 'move', periodId, meta: offset });
  };

  const handleMouseDownOnResizeHandle = (e: React.MouseEvent, periodId: string, handle: 'start' | 'end') => {
    e.stopPropagation();
    initialPeriodsRef.current = activePeriods;
    setInteraction({ type: handle === 'start' ? 'resize-start' : 'resize-end', periodId, meta: 0 });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interaction || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const currentMin = pixelToMinutes(e.clientX - rect.left, rect.width);
    const initialPeriods = initialPeriodsRef.current;

    setActivePeriods(
      initialPeriods.map(p => {
        if (p.id !== interaction.periodId) return p;

        switch (interaction.type) {
          case 'create': {
            const initialStart = interaction.meta;
            const newStart = Math.min(initialStart, currentMin);
            const newEnd = Math.max(initialStart, currentMin);
            return { ...p, start: newStart, end: newEnd };
          }
          case 'move': {
            const offset = interaction.meta;
            const newStart = currentMin - offset;
            const duration = p.end - p.start;
            const newEnd = newStart + duration;
            if (newStart >= 0 && newEnd <= TOTAL_MINUTES_IN_DAY) {
              return { ...p, start: newStart, end: newEnd };
            }
            return p;
          }
          case 'resize-start': {
            const newStart = Math.min(currentMin, p.end);
            return { ...p, start: newStart };
          }
          case 'resize-end': {
            const newEnd = Math.max(currentMin, p.start);
            return { ...p, end: newEnd };
          }
          default:
            return p;
        }
      })
    );
  }, [interaction, pixelToMinutes]);

  const handleMouseUp = useCallback(() => {
    if (!interaction) return;
    const finalPeriods = activePeriods
      .filter(p => p.end - p.start >= 1) // Keep periods that are at least 1 minute long
      .map(({ start, end }) => ({ start, end }));
    
    commitChanges(finalPeriods);
    setInteraction(null);
    initialPeriodsRef.current = [];
  }, [interaction, activePeriods, commitChanges]);

  const removePeriod = useCallback((id: string) => {
    const newPeriods = activePeriods
      .filter(period => period.id !== id)
      .map(({ start, end }) => ({ start, end }));
    commitChanges(newPeriods);
  }, [activePeriods, commitChanges]);

  const clearAllPeriods = useCallback(() => {
    commitChanges([]);
  }, [commitChanges]);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const timeMarkers = Array.from({ length: 25 }, (_, i) => ({
    time: i * 60,
    label: `${i}h`,
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Active Periods Schedule (24-hour view)</Label>
          <Button variant="outline" size="sm" onClick={clearAllPeriods}>
            Clear All
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Click and drag on the timeline to create periods. Drag periods to move, or drag their edges to resize.
        </p>

        <div className="relative">
          <div className="relative h-5 mb-2 text-xs text-gray-500">
            {timeMarkers.map(({ time, label }) => (
              <div
                key={time}
                className="absolute -translate-x-1/2"
                style={{ left: `${(time / TOTAL_MINUTES_IN_DAY) * 100}%` }}
              >
                <div className="flex flex-col items-center">
                  <span>{label}</span>
                  <div className="w-px h-2 bg-gray-300 mt-0.5" />
                </div>
              </div>
            ))}
          </div>

          <div
            ref={timelineRef}
            className="relative h-16 bg-gray-100 border border-gray-300 rounded cursor-crosshair select-none overflow-hidden"
            onMouseDown={handleMouseDownOnTimeline}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 transform -translate-y-1/2"></div>

            {activePeriods.map((period) => {
              const timelineWidth = timelineRef.current?.clientWidth || 0;
              if (timelineWidth === 0) return null;
              
              const left = minutesToPixel(period.start, timelineWidth);
              const width = minutesToPixel(period.end - period.start, timelineWidth);
              
              return (
                <div
                  key={period.id}
                  className="absolute top-2 h-12 bg-indigo-500 bg-opacity-80 border border-indigo-600 rounded-md cursor-move flex items-center justify-between px-1"
                  style={{ left: `${left}px`, width: `${width}px` }}
                  onMouseDown={(e) => handleMouseDownOnPeriod(e, period.id)}
                  title={`${formatTime(period.start)} - ${formatTime(period.end)}`}
                >
                  <div 
                    className="w-2 h-full cursor-ew-resize rounded-l-md bg-indigo-700 bg-opacity-50"
                    onMouseDown={(e) => handleMouseDownOnResizeHandle(e, period.id, 'start')}
                  />
                  <span className="text-white text-xs font-medium pointer-events-none px-1">
                    {formatTime(period.start)} - {formatTime(period.end)}
                  </span>
                  <div 
                    className="w-2 h-full cursor-ew-resize rounded-r-md bg-indigo-700 bg-opacity-50"
                    onMouseDown={(e) => handleMouseDownOnResizeHandle(e, period.id, 'end')}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {activePeriods.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm font-medium">Active Periods:</Label>
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
              {activePeriods.map((period) => (
                <div key={period.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>{formatTime(period.start)} - {formatTime(period.end)}</span>
                  <Button variant="ghost" size="sm" onClick={() => removePeriod(period.id)} className="text-red-600 hover:text-red-800">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 