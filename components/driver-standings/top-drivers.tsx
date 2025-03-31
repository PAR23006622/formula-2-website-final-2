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

interface TopDriversChartProps {
  year: string;
}

export function TopDriversChart({ year }: TopDriversChartProps) {
  const [data, setData] = useState<any>(null);
  const { theme } = useTheme();
  const [options, setOptions] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const yearData = (driverStandings as YearData[]).find(d => d.year.toString() === year);
        if (!yearData) return;
        
        // Sort drivers by total points and get top 5
        const topDrivers = [...yearData.standings]
          .sort((a, b) => parseInt(b.totalPoints) - parseInt(a.totalPoints))
          .slice(0, 5);

        const chartData = {
          labels: topDrivers.map((driver: DriverStanding) => driver.driverName),
          datasets: [{
            label: 'Total Points',
            data: topDrivers.map((driver: DriverStanding) => parseInt(driver.totalPoints)),
            backgroundColor: [
              'rgba(255, 51, 102, 0.8)',
              'rgba(51, 102, 255, 0.8)',
              'rgba(51, 204, 102, 0.8)',
              'rgba(255, 153, 51, 0.8)',
              'rgba(153, 51, 255, 0.8)',
            ],
            borderColor: [
              '#FF3366',
              '#3366FF',
              '#33CC66',
              '#FF9933',
              '#9933FF',
            ],
            borderWidth: 2
          }]
        };
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    fetchData();
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
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
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
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
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