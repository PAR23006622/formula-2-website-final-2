"use client";

import { Pie } from "react-chartjs-2";
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

interface PointsDistributionPieChartProps {
  year: string;
}

export function PointsDistributionPieChart({ year }: PointsDistributionPieChartProps) {
  const [data, setData] = useState<any>(null);
  const { theme } = useTheme();
  const [options, setOptions] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const yearData = (driverStandings as YearData[]).find(d => d.year.toString() === year);
        if (!yearData) return;
        
        let totalSprintPoints = 0;
        let totalFeaturePoints = 0;

        yearData.standings.forEach((driver: DriverStanding) => {
          totalSprintPoints += driver.sprintRaceScores.reduce((sum: number, score: string) => sum + parseInt(score), 0);
          totalFeaturePoints += driver.featureRaceScores.reduce((sum: number, score: string) => sum + parseInt(score), 0);
        });

        const chartData = {
          labels: ['Sprint Race Points', 'Feature Race Points'],
          datasets: [{
            data: [totalSprintPoints, totalFeaturePoints],
            backgroundColor: [
              'rgba(51, 102, 255, 0.8)',
              'rgba(255, 51, 102, 0.8)',
            ],
            borderColor: [
              '#3366FF',
              '#FF3366',
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
      });
    };

    updateOptions();
    window.addEventListener('resize', updateOptions);
    return () => window.removeEventListener('resize', updateOptions);
  }, [theme]);

  if (!data) return null;

  return (
    <div className="w-full h-full">
      <Pie data={data} options={options} />
    </div>
  );
}