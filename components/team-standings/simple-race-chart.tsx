"use client";

import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import calendarData from '@/results/calendar.json';
import teamStandings from '@/results/team-standings.json';
import { createTeamColorMap } from "@/lib/chart-colors";
import "@/lib/chart-config"; // Import chart configuration

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
const typedTeamStandings = (teamStandings as RawYearData[]).map(yearData => ({
  year: yearData.year,
  title: yearData.title,
  standings: yearData.standings.map((standing, index) => ({
    teamName: standing.driverName,
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
  
  // Get race locations from calendar
  const raceLocations = useMemo(() => {
    const yearCalendar = typedCalendarData[year];
    if (!yearCalendar) return [];
    return yearCalendar.races.map(race => race.location);
  }, [year]);
  
  // Create chart data from team standings
  const data = useMemo(() => {
    // Find the year data
    const yearData = typedTeamStandings.find(d => d.year.toString() === year);
    if (!yearData) return null;
    
    // Get team names and create color map
    const teamNames = yearData.standings.map(team => team.teamName);
    const colorMap = createTeamColorMap(teamNames);
    
    // Create datasets for each team
    const datasets = yearData.standings
      .map(team => {
        // Scores are already numbers from our data transformation
        const sprintPoints = team.sprintRaceScores;
        const featurePoints = team.featureRaceScores;
        
        // Calculate total points for each race
        const totalPoints = sprintPoints.map((sprint: number, index: number) => 
          sprint + (featurePoints[index] || 0)
        );
        
        // Slice to get only the races we want to display
        const slicedPoints = totalPoints.slice(startRace - 1, endRace);
        
        // Check if team has any points in the selected races
        const hasPoints = slicedPoints.some((points: number) => points > 0);
        
        // Check if team is selected
        const isSelected = selectedTeams ? selectedTeams.has(team.teamName) : true;
        
        // Skip this team if it has no points or isn't selected
        if (!hasPoints || !isSelected) return null;
        
        return {
          label: team.teamName,
          data: slicedPoints.map((points: number) => points || null),
          backgroundColor: colorMap[team.teamName],
          borderColor: colorMap[team.teamName],
          borderWidth: 1,
          borderRadius: 4,
          spanGaps: true
        };
      })
      .filter((dataset): dataset is NonNullable<typeof dataset> => dataset !== null);

    // Get the race locations for the selected range
    const selectedLocations = raceLocations.slice(startRace - 1, endRace);
    
    // Find races where at least one team scored points
    const racesWithPoints = selectedLocations.map((location, index) => ({
      location,
      hasPoints: datasets.some(dataset => {
        const value = dataset.data[index];
        return typeof value === 'number' && value > 0;
      })
    })).filter(race => race.hasPoints);

    // Update datasets to only include races with points
    const filteredDatasets = datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.filter((_: any, index: number) => 
        datasets.some(d => {
          const points = d.data[index];
          return typeof points === 'number' && points > 0;
        })
      )
    }));

    return {
      labels: racesWithPoints.map(race => race.location),
      datasets: filteredDatasets
    };
  }, [year, startRace, endRace, raceLocations, selectedTeams]);
  
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
  
  if (!data) {
    return <div className="flex items-center justify-center h-full">No data available for selected year</div>;
  }
  
  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
} 