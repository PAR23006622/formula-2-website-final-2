"use client";

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { createDriverColorMap } from "@/lib/chart-colors";
import driverStandings from '@/results/driver-standings.json';

// Interface for raw data from JSON
interface RawStanding {
  driverName: string;
  totalPoints: string;
  sprintRaceScores: string[];
  featureRaceScores: string[];
}

interface RawYearData {
  year: number;
  title: string;
  standings: RawStanding[];
}

// Interface for processed data
interface DriverStanding {
  driverName: string;
  totalPoints: string;
  sprintRaceScores: number[];
  featureRaceScores: number[];
  position: number;
}

interface YearData {
  year: number;
  title: string;
  standings: DriverStanding[];
}

// Process the raw data to match our expected format
const typedDriverStandings = (driverStandings as RawYearData[]).map(yearData => ({
  year: yearData.year,
  title: yearData.title,
  standings: yearData.standings.map((standing, index) => ({
    driverName: standing.driverName,
    totalPoints: standing.totalPoints,
    sprintRaceScores: standing.sprintRaceScores.map(Number),
    featureRaceScores: standing.featureRaceScores.map(Number),
    position: index + 1
  }))
})) as YearData[];

export function TotalPointsChart({ year }: { year: string }) {
  const [data, setData] = useState<any>(null);
  const { theme } = useTheme();
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      const currentYear = typedDriverStandings.find(d => d.year.toString() === year);
      console.log('Current Year Data:', currentYear);
      
      if (!currentYear) {
        throw new Error('Year data not found');
      }

      const driverNames = currentYear.standings.map(driver => driver.driverName);
      const colorMap = createDriverColorMap(driverNames);
      
      const chartData = {
        labels: driverNames,
        datasets: [{
          label: 'Total Points',
          data: currentYear.standings.map(driver => parseInt(driver.totalPoints)),
          backgroundColor: driverNames.map(driver => colorMap[driver]),
          borderColor: driverNames.map(driver => colorMap[driver]),
          borderWidth: 1,
          borderRadius: 4,
        }]
      };
      
      setData(chartData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    const textColor = theme === 'dark' ? '#fff' : '#000';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    setOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          cornerRadius: 4
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
            drawBorder: false,
            lineWidth: 1
          },
          ticks: {
            color: textColor,
            font: {
              size: window.innerWidth <= 640 ? 8 : 10,
            },
            padding: 8
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: window.innerWidth <= 640 ? 8 : 10,
            },
            padding: 8
          },
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0
        }
      },
      barPercentage: 0.9,
      categoryPercentage: 0.9
    });
  }, [theme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
}