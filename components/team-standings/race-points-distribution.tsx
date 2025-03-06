"use client";

import { Bar } from "react-chartjs-2";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { createTeamColorMap } from "@/lib/chart-colors";
import { TeamFilter } from "./team-filter";
import "@/lib/chart-config";
import teamStandings from '@/results/team-standings.json';
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

interface RacePointsDistributionChartProps {
  year: string;
  startRace: number;
  endRace: number;
  title: string;
  selectedTeams?: Set<string>;
  useTopRightFilter?: boolean;
}

// Process the raw data to match our expected format
const typedTeamStandings = (teamStandings as RawYearData[]).map(yearData => ({
  year: yearData.year,
  title: yearData.title,
  standings: yearData.standings.map((standing, index) => ({
    teamName: standing.driverName, // Map driverName to teamName
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
  selectedTeams: externalSelectedTeams,
  useTopRightFilter = false
}: RacePointsDistributionChartProps) {
  const { theme } = useTheme();
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Get race locations from calendar
  const raceLocations = useMemo(() => {
    const yearCalendar = typedCalendarData[year];
    if (!yearCalendar) return [];
    return yearCalendar.races.map(race => race.location);
  }, [year]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize teams data
  useEffect(() => {
    try {
      const yearData = typedTeamStandings.find(d => d.year.toString() === year);
      if (!yearData) {
        setError('No data available for selected year');
        return;
      }

      const teamNames = yearData.standings.map(team => team.teamName);
      setAllTeams(teamNames);
      
      if (!externalSelectedTeams) {
        setSelectedTeams(new Set(teamNames));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      setError('Failed to initialize data');
    }
  }, [year, externalSelectedTeams]);

  const toggleTeam = useCallback((teamName: string) => {
    if (externalSelectedTeams) return; // Don't modify if using external selection
    
    setSelectedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamName)) {
        newSet.delete(teamName);
      } else {
        newSet.add(teamName);
      }
      return newSet;
    });
  }, [externalSelectedTeams]);

  const toggleAllTeams = useCallback(() => {
    if (externalSelectedTeams) return; // Don't modify if using external selection
    
    setSelectedTeams(prev => 
      prev.size === allTeams.length ? new Set() : new Set(allTeams)
    );
  }, [allTeams, externalSelectedTeams]);

  // Prepare chart data
  const data = useMemo(() => {
    try {
      const yearData = typedTeamStandings.find(d => d.year.toString() === year);
      if (!yearData) return null;

      const teamNames = yearData.standings.map(team => team.teamName);
      const colorMap = createTeamColorMap(teamNames);
      const currentSelectedTeams = externalSelectedTeams || selectedTeams;
      
      const datasets = yearData.standings.map(team => {
        const sprintPoints = team.sprintRaceScores.map(Number);
        const featurePoints = team.featureRaceScores.map(Number);
        
        const totalPoints = sprintPoints.map((sprint, index) => 
          sprint + (featurePoints[index] || 0)
        );
        
        const slicedPoints = totalPoints.slice(startRace - 1, endRace).map(points => 
          points === 0 ? null : points
        );

        return {
          label: team.teamName,
          data: slicedPoints,
          backgroundColor: colorMap[team.teamName],
          borderColor: colorMap[team.teamName],
          borderWidth: 1,
          borderRadius: 4,
          hidden: !currentSelectedTeams.has(team.teamName)
        };
      });
      
      return {
        labels: raceLocations.slice(startRace - 1, endRace),
        datasets
      };
    } catch (error) {
      console.error('Error preparing chart data:', error);
      setError('Failed to prepare chart data');
      return null;
    }
  }, [year, startRace, endRace, raceLocations, selectedTeams, externalSelectedTeams]);

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
          type: 'linear' as const,
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
              weight: 'normal' as const
            },
            padding: isMobile ? 0 : 2,
            maxTicksLimit: isMobile ? 6 : 8
          }
        },
        x: {
          type: 'category' as const,
          grid: {
            display: true,
            color: gridColor,
            drawBorder: false,
            lineWidth: 1
          },
          ticks: {
            color: textColor,
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: isMobile ? 8 : 10,
              weight: 'bold' as const
            },
            padding: isMobile ? 2 : 4
          },
          title: {
            display: true,
            text: 'Race Location',
            color: textColor,
            font: {
              size: isMobile ? 10 : 12,
              weight: 'normal' as const
            }
          },
          border: {
            display: false
          }
        }
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

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="w-full h-full relative">
      {!externalSelectedTeams && (
        <div className="absolute z-10 top-10 right-10 pt-4 pr-4">
          <TeamFilter
            teams={allTeams}
            selectedTeams={selectedTeams}
            onToggleTeam={toggleTeam}
            onToggleAll={toggleAllTeams}
          />
        </div>
      )}
      <Bar data={data} options={options} />
    </div>
  );
}