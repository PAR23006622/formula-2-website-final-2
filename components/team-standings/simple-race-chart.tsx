"use client";

import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import calendarData from '@/results/calendar.json';
import teamStandings from '@/results/team-standings.json';
import { createTeamColorMap } from "@/lib/chart-colors";
import "@/lib/chart-config"; // Import chart configuration

interface SimpleRaceChartProps {
  year: string;
  startRace?: number;
  endRace?: number;
  selectedTeams?: Set<string>;
}

export function SimpleRaceChart({ 
  year, 
  startRace = 1, 
  endRace = 2,
  selectedTeams
}: SimpleRaceChartProps) {
  const { theme } = useTheme();
  
  // Get race locations from calendar
  const raceLocations = useMemo(() => {
    const yearCalendar = calendarData[year as keyof typeof calendarData];
    if (!yearCalendar) return [];
    return yearCalendar.races.map(race => race.location);
  }, [year]);
  
  // Create chart data from team standings
  const data = useMemo(() => {
    // Find the year data
    const yearData = teamStandings.find(d => d.year.toString() === year);
    if (!yearData) return null;
    
    // Get team names and create color map
    const teamNames = yearData.standings.map(team => team.driverName);
    const colorMap = createTeamColorMap(teamNames);
    
    // Create datasets for each team
    const datasets = yearData.standings
      .map(team => {
        // Convert string scores to numbers
        const sprintPoints = team.sprintRaceScores.map(score => parseInt(score, 10) || 0);
        const featurePoints = team.featureRaceScores.map(score => parseInt(score, 10) || 0);
        
        // Calculate total points for each race
        const totalPoints = sprintPoints.map((sprint, index) => 
          sprint + (featurePoints[index] || 0)
        );
        
        // Slice to get only the races we want to display
        const slicedPoints = totalPoints.slice(startRace - 1, endRace);
        
        // Check if team has any points in the selected races
        const hasPoints = slicedPoints.some(points => points > 0);
        
        // Check if team is selected
        const isSelected = selectedTeams ? selectedTeams.has(team.driverName) : true;
        
        // Skip this team if it has no points or isn't selected
        if (!hasPoints || !isSelected) return null;
        
        return {
          label: team.driverName,
          data: slicedPoints.map(points => points || null),
          backgroundColor: colorMap[team.driverName],
          borderColor: colorMap[team.driverName],
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
      hasPoints: datasets.some(dataset => dataset.data[index] > 0)
    })).filter(race => race.hasPoints);

    // Update datasets to only include races with points
    const filteredDatasets = datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.filter((_, index) => 
        datasets.some(d => d.data[index] > 0)
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
              if (!context.raw) return null;
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
      <Bar data={data} options={options} />
    </div>
  );
} 