"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface ChartThemeOptions {
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  fontSize: {
    legend: number;
    ticks: number;
    labels: number;
  };
}

export function useChartTheme() {
  const { theme } = useTheme();
  const [options, setOptions] = useState<ChartThemeOptions>(() => ({
    backgroundColor: '#fff',
    textColor: '#000',
    gridColor: 'rgba(0, 0, 0, 0.1)',
    fontSize: {
      legend: 12,
      ticks: 10,
      labels: 11,
    },
  }));

  useEffect(() => {
    const updateTheme = () => {
      const isDark = theme === 'dark';
      const baseFontSize = window.innerWidth <= 640 ? 0.8 : 1;

      setOptions(prevOptions => ({
        ...prevOptions,
        textColor: isDark ? '#fff' : '#000',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        fontSize: {
          legend: 12 * baseFontSize,
          ticks: 10 * baseFontSize,
          labels: 11 * baseFontSize,
        },
      }));
    };

    updateTheme();
    window.addEventListener('resize', updateTheme);
    return () => window.removeEventListener('resize', updateTheme);
  }, [theme]);

  return options;
}