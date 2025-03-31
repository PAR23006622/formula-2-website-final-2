"use client";

import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import calendarData from '@/results/calendar.json';
import teamStandings from '@/results/team-standings.json';
import { createTeamColorMap } from "@/lib/chart-colors";
import "@/lib/chart-config"; // Import chart configuration

// Interface matching the actual JSON data structure
interface RawStanding {
  teamName: string;
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
interface TeamStanding {
  teamName: string;
  totalPoints: string;
  sprintRaceScores: number[];
  featureRaceScores: number[];
  position: number;
}

interface YearData {
  year: number;
  title: string;
  standings: TeamStanding[];
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

interface SimpleRaceChartProps {
  year: string;
  startRace?: number;
  endRace?: number;
  selectedTeams?: Set<string>;
}

// Process the raw data to match our expected format
const typedTeamStandings = (teamStandings as unknown as RawYearData[]).map(yearData => ({
  year: yearData.year,
  title: yearData.title,
  standings: yearData.standings.map((standing, index) => ({
    teamName: standing.teamName,
    totalPoints: standing.totalPoints,
    sprintRaceScores: standing.sprintRaceScores.map(Number),
    featureRaceScores: standing.featureRaceScores.map(Number),
    position: index + 1
  }))
})) as YearData[];

const typedCalendarData = calendarData as Record<string, CalendarYear>;

export function SimpleRaceChart({ 
  year, 
  startRace = 1, 
  endRace = 2,
  selectedTeams
}: SimpleRaceChartProps) {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  
  // Get race locations from calendar
  const raceLocations = useMemo(() => {
    const yearCalendar = typedCalendarData[year];
    if (!yearCalendar) return [];
    return yearCalendar.races.map(race => race.location);
  }, [year]);
  
  // Create chart data from team standings
  const data = useMemo(() => {
    try {
      const yearData = typedTeamStandings.find(d => d.year.toString() === year);
      if (!yearData) return null;

      const teamNames = yearData.standings.map(team => team.teamName);
      const colorMap = createTeamColorMap(teamNames);
      
      const datasets = yearData.standings
        .filter(team => selectedTeams ? selectedTeams.has(team.teamName) : true)
        .map(team => {
          const sprintPoints = team.sprintRaceScores;
          const featurePoints = team.featureRaceScores;
          
          const totalPoints = sprintPoints.map((sprint: number, index: number) => 
            (sprint || 0) + (featurePoints[index] || 0)
          );
          
          const slicedPoints = totalPoints.slice(startRace - 1, endRace);
          
          return {
            label: team.teamName,
            data: slicedPoints,
            backgroundColor: colorMap[team.teamName],
            borderColor: colorMap[team.teamName],
            borderWidth: 1,
            borderRadius: 4,
            spanGaps: true
          };
        });
      
      return {
        labels: raceLocations.slice(startRace - 1, endRace),
        datasets
      };
    } catch (error) {
      setError('Failed to create chart data');
      return null;
    }
  }, [year, startRace, endRace, selectedTeams, raceLocations]);
  
  // Create chart options
  const options = useMemo(() => {
    const textColor = theme === 'dark' ? '#fff' : '#000';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: function(context: any) {
              if (context.raw === null || context.raw === undefined) return '';
              return `${context.dataset.label}: ${context.raw} points`;
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear' as const,
          beginAtZero: true,
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: {
              size: 10,
              weight: 'normal' as const
            }
          }
        },
        x: {
          type: 'category' as const,
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            font: {
              size: 12,
              weight: 'normal' as const
            }
          },
          title: {
            display: true,
            text: '',
            color: textColor,
            font: {
              size: 12,
              weight: 'normal' as const
            }
          }
        }
      }
    };
  }, [theme]);
  
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center">Loading data...</div>;
  }
  
  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
} 