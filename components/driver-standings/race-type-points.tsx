"use client";

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import driverStandings from '@/results/driver-standings.json';

interface DriverStanding {
  driverName: string;
  totalPoints: string;
  sprintRaceScores: string[];
  featureRaceScores: string[];
}

interface YearData {
  year: number;
  title: string;
  standings: DriverStanding[];
}

interface RaceTypePointsChartProps {
  year: string;
}

export function RaceTypePointsChart({ year }: RaceTypePointsChartProps) {
  const [data, setData] = useState<any>(null);
  const { theme } = useTheme();
  const [options, setOptions] = useState({});

  useEffect(() => {
    const yearData = (driverStandings as YearData[]).find(d => d.year.toString() === year);
    if (!yearData) return;
    
    const chartData = {
      labels: yearData.standings.map(driver => driver.driverName),
      datasets: [
        {
          label: 'Sprint Race Points',
          data: yearData.standings.map(driver => 
            driver.sprintRaceScores.reduce((sum: number, score: string) => sum + parseInt(score), 0)
          ),
          backgroundColor: 'rgba(51, 102, 255, 0.8)',
          borderColor: '#3366FF',
          borderWidth: 2
        },
        {
          label: 'Feature Race Points',
          data: yearData.standings.map(driver => 
            driver.featureRaceScores.reduce((sum: number, score: string) => sum + parseInt(score), 0)
          ),
          backgroundColor: 'rgba(255, 51, 102, 0.8)',
          borderColor: '#FF3366',
          borderWidth: 2
        }
      ]
    };
    
    setData(chartData);
  }, [year]);

  useEffect(() => {
    const updateOptions = () => {
      const textColor = theme === 'dark' ? '#fff' : '#000';
      const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

      setOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              color: textColor,
              font: {
                size: window.innerWidth <= 640 ? 10 : 12,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
            grid: {
              color: gridColor,
              drawBorder: false,
            },
            ticks: {
              color: textColor,
              font: {
                size: window.innerWidth <= 640 ? 8 : 10,
              },
            },
          },
          x: {
            stacked: true,
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
            },
          },
        },
      });
    };

    updateOptions();
    window.addEventListener('resize', updateOptions);
    return () => window.removeEventListener('resize', updateOptions);
  }, [theme]);

  if (!data) return null;

  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
}