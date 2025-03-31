"use client";

import { Bar } from "react-chartjs-2";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { createDriverColorMap } from "@/lib/chart-colors";
import { DriverFilter } from "./driver-filter";
import "@/lib/chart-config";
import driverStandings from '@/results/driver-standings.json';
import calendarData from '@/results/calendar.json';

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

interface RacePointsDistributionChartProps {
  year: string;
  startRace: number;
  endRace: number;
  title: string;
  selectedDrivers?: Set<string>;
  useTopRightFilter?: boolean;
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

export function RacePointsDistributionChart({ 
  year, 
  startRace, 
  endRace, 
  title,
  selectedDrivers: externalSelectedDrivers,
  useTopRightFilter = false
}: RacePointsDistributionChartProps) {
  const { theme } = useTheme();
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [allDrivers, setAllDrivers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize year data
  const yearData = useMemo(() => {
    const data = typedDriverStandings.find(d => d.year.toString() === year);
    if (!data) return null;
    return data;
  }, [year]);

  // Get race locations from calendar
  const raceLocations = useMemo(() => {
    const yearCalendar = typedCalendarData[year];
    if (!yearCalendar) return [];
    return yearCalendar.races.map(race => race.location);
  }, [year]);

  // Memoize driver names and color map
  const { allDrivers: computedDrivers, colorMap } = useMemo(() => {
    if (!yearData) return { allDrivers: [], colorMap: {} };
    const drivers = yearData.standings.map(driver => driver.driverName);
    return {
      allDrivers: drivers,
      colorMap: createDriverColorMap(drivers)
    };
  }, [yearData]);

  // Initialize selected drivers when allDrivers changes
  useEffect(() => {
    setAllDrivers(computedDrivers);
    if (!externalSelectedDrivers) {
      setSelectedDrivers(new Set(computedDrivers));
    }
  }, [computedDrivers, externalSelectedDrivers]);

  // Update selected drivers when external selection changes
  useEffect(() => {
    if (externalSelectedDrivers) {
      setSelectedDrivers(externalSelectedDrivers);
    }
  }, [externalSelectedDrivers]);

  const toggleDriver = useCallback((driverName: string) => {
    if (externalSelectedDrivers) return; // Don't modify if using external selection
    
    setSelectedDrivers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(driverName)) {
        newSet.delete(driverName);
      } else {
        newSet.add(driverName);
      }
      return newSet;
    });
  }, [externalSelectedDrivers]);

  const toggleAllDrivers = useCallback(() => {
    if (externalSelectedDrivers) return; // Don't modify if using external selection
    
    setSelectedDrivers(prev => 
      prev.size === allDrivers.length ? new Set() : new Set(allDrivers)
    );
  }, [allDrivers, externalSelectedDrivers]);

  // Memoize chart data
  const data = useMemo(() => {
    if (!yearData) return null;

    const datasets = yearData.standings.map(driver => {
      const sprintPoints = driver.sprintRaceScores.map(Number);
      const featurePoints = driver.featureRaceScores.map(Number);
      const totalPoints = sprintPoints.map((sprint: number, index: number) => 
        sprint + (featurePoints[index] || 0)
      );

      const slicedPoints = totalPoints.slice(startRace - 1, endRace).map((points: number) => 
        points === 0 ? null : points
      );

      return {
        label: driver.driverName,
        data: slicedPoints,
        backgroundColor: colorMap[driver.driverName],
        borderColor: colorMap[driver.driverName],
        borderWidth: 1,
        borderRadius: 4,
        hidden: !selectedDrivers.has(driver.driverName)
      };
    });

    const chartData = {
      labels: raceLocations.slice(startRace - 1, endRace),
      datasets
    };

    return chartData;
  }, [yearData, startRace, endRace, colorMap, selectedDrivers, raceLocations]);

  // Memoize chart options
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
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 8,
          bodySpacing: 4,
          titleSpacing: 4,
          cornerRadius: 4,
          callbacks: {
            label: function(context: any) {
              if (context.raw === null) return `${context.dataset.label}: 0 points`;
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
            lineWidth: 1
          },
          ticks: {
            color: textColor,
            font: {
              size: isMobile ? 8 : 10,
            },
            padding: isMobile ? 0 : 2,
            maxTicksLimit: isMobile ? 6 : 8
          },
        },
        x: {
          grid: {
            display: true,
            color: gridColor,
            drawBorder: false,
            lineWidth: 1
          },
          ticks: {
            color: textColor,
            font: {
              size: isMobile ? 8 : 9,
            },
            padding: isMobile ? 2 : 4,
            autoSkip: true,
            maxTicksLimit: isMobile ? 7 : 14
          },
          title: {
            display: true,
            text: '',
            color: textColor,
            font: {
              size: isMobile ? 10 : 12,
            }
          },
          border: {
            display: false
          }
        },
      },
      layout: {
        padding: {
          left: isMobile ? 0 : 8,
          right: isMobile ? 0 : 8,
          top: isMobile ? 4 : 16,
          bottom: isMobile ? 0 : 8
        }
      },
      barPercentage: 0.9,
      categoryPercentage: 0.9,
      skipNull: true
    };
  }, [theme, isMobile]);

  if (!yearData) {
    return <div className="text-center text-red-500">No data available for selected year</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="w-full h-full relative">
      {!externalSelectedDrivers && (
        <div className="absolute z-10 top-10 right-10 pt-4 pr-4">
          <DriverFilter
            drivers={allDrivers}
            selectedDrivers={selectedDrivers}
            onToggleDriver={toggleDriver}
            onToggleAll={toggleAllDrivers}
          />
        </div>
      )}
      <Bar data={data} options={options} />
    </div>
  );
}