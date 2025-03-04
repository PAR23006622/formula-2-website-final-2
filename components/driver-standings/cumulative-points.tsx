"use client";

import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { createDriverColorMap } from "@/lib/chart-colors";
import driverStandings from '@/results/driver-standings.json';
import calendarData from '@/results/calendar.json';

interface CumulativePointsChartProps {
  year: string;
  selectedDrivers?: Set<string>;
}

export function CumulativePointsChart({ year, selectedDrivers }: CumulativePointsChartProps) {
  const { theme } = useTheme();

  // Get race locations from calendar
  const raceLocations = useMemo(() => {
    const yearCalendar = calendarData[year as keyof typeof calendarData];
    if (!yearCalendar) return [];
    return yearCalendar.races.map(race => race.location);
  }, [year]);

  const data = useMemo(() => {
    const yearData = driverStandings.find(d => d.year.toString() === year);
    if (!yearData) return null;

    const driverNames = yearData.standings.map(driver => driver.driverName);
    const colorMap = createDriverColorMap(driverNames);

    const datasets = yearData.standings
      .filter(driver => selectedDrivers?.has(driver.driverName))
      .map(driver => {
        const sprintPoints = driver.sprintRaceScores.map(score => parseInt(score, 10) || 0);
        const featurePoints = driver.featureRaceScores.map(score => parseInt(score, 10) || 0);
        
        let cumulative = 0;
        const cumulativePoints = [];
        
        for (let i = 0; i < Math.max(sprintPoints.length, featurePoints.length); i++) {
          cumulative += (sprintPoints[i] || 0) + (featurePoints[i] || 0);
          cumulativePoints.push(cumulative);
        }

        return {
          label: driver.driverName,
          data: cumulativePoints,
          borderColor: colorMap[driver.driverName],
          backgroundColor: colorMap[driver.driverName],
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
        };
      });

    return {
      labels: raceLocations,
      datasets
    };
  }, [year, raceLocations, selectedDrivers]);

  const options = useMemo(() => {
    const textColor = theme === 'dark' ? '#fff' : '#000';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: ${context.raw} points`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          },
          title: {
            display: true,
            text: 'Points',
            color: textColor
          }
        },
        x: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            maxRotation: 45,
            minRotation: 45
          },
          title: {
            display: true,
            text: 'Race Location',
            color: textColor
          }
        }
      }
    };
  }, [theme]);

  if (!data) {
    return <div className="flex items-center justify-center h-full">No data available for selected year</div>;
  }

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
}