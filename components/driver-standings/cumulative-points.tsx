"use client";

import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";
import { createDriverColorMap } from "@/lib/chart-colors";
import driverStandings from '@/results/driver-standings.json';
import calendarData from '@/results/calendar.json';

// Interface matching the actual JSON data structure
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

// Interface for our processed data
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

interface Race {
  startDate: string;
  endDate: string;
  month: string;
  location: string;
}

interface CalendarYear {
  title: string;
  races: Race[];
}

interface CumulativePointsChartProps {
  year: string;
  externalSelectedDrivers?: Set<string>;
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

const typedCalendarData = calendarData as Record<string, CalendarYear>;

export function CumulativePointsChart({ year, externalSelectedDrivers }: CumulativePointsChartProps) {
  const [data, setData] = useState<any>(null);
  const { theme } = useTheme();
  const [options, setOptions] = useState({});
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [allDrivers, setAllDrivers] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize drivers data
  useEffect(() => {
    const yearData = typedDriverStandings.find(d => d.year.toString() === year);
    if (yearData) {
      const drivers = yearData.standings.map(driver => driver.driverName);
      setAllDrivers(drivers);
      if (!externalSelectedDrivers) {
        setSelectedDrivers(new Set(drivers));
      }
    }
  }, [year, externalSelectedDrivers]);

  // Use external selected drivers if provided
  const effectiveSelectedDrivers = externalSelectedDrivers || selectedDrivers;

  useEffect(() => {
    const yearData = typedDriverStandings.find(d => d.year.toString() === year);
    if (!yearData) return;

    const datasets = yearData.standings.map((driver, index) => {
      const sprintPoints = driver.sprintRaceScores;
      const featurePoints = driver.featureRaceScores;
      let cumulative = 0;
      const cumulativePoints = [];
      
      for (let i = 0; i < Math.max(sprintPoints.length, featurePoints.length); i++) {
        cumulative += (sprintPoints[i] || 0) + (featurePoints[i] || 0);
        cumulativePoints.push(cumulative);
      }

      return {
        label: driver.driverName,
        data: cumulativePoints,
        borderColor: driverColors[index % driverColors.length],
        backgroundColor: driverColors[index % driverColors.length],
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
        fill: false,
        hidden: !effectiveSelectedDrivers.has(driver.driverName)
      };
    });

    const raceLocations = typedCalendarData[year]?.races.map(race => race.location) || [];

    setData({
      labels: raceLocations.slice(0, Math.max(...datasets.map(d => d.data.length))),
      datasets
    });
  }, [year, effectiveSelectedDrivers, theme]);

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
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 8,
          bodySpacing: 4,
          titleSpacing: 4,
          cornerRadius: 4,
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
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            callback: function(value: any) {
              return value + ' pts';
            }
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    });
  }, [theme, isMobile]);

  if (!data) return null;

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} className="w-full h-full" />
    </div>
  );
}

const driverColors = [
  '#FF3366', // Red
  '#3366FF', // Blue
  '#33CC66', // Green
  '#FF9933', // Orange
  '#9933FF', // Purple
  '#33CCCC', // Teal
  '#FFCC33', // Yellow
  '#FF33CC', // Pink
  '#6D78AD', // Blue Gray
  '#CC6600', // Brown
  '#808080', // Gray
  '#0099CC', // Light Blue
];