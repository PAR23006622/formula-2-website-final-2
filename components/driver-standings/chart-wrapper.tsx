"use client";

import { ReactNode, useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

interface ChartWrapperProps {
  children: ReactNode;
}

export function ChartWrapper({ children }: ChartWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup function to destroy any existing charts when component unmounts
    return () => {
      if (chartRef.current) {
        const canvases = chartRef.current.getElementsByTagName('canvas');
        for (const canvas of canvases) {
          const chartInstance = Chart.getChart(canvas);
          if (chartInstance) {
            chartInstance.destroy();
          }
        }
      }
    };
  }, []);

  return (
    <div ref={chartRef} className="w-full h-full">
      {children}
    </div>
  );
}