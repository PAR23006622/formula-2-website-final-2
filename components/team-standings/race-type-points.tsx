"use client";

import { Bar } from "react-chartjs-2";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import teamStandings from '@/results/team-standings.json';
import { TeamFilter } from "./team-filter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function RaceTypePointsChart({ year, showFilter = true }: { year: string, showFilter?: boolean }) {
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setSelectedTeams(new Set(teamNames));
    } catch (error) {
      console.error('Error initializing data:', error);
      setError('Failed to initialize data');
    }
  }, [year]);

  const toggleTeam = (teamName: string) => {
    setSelectedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamName)) {
        newSet.delete(teamName);
      } else {
        newSet.add(teamName);
      }
      return newSet;
    });
  };

  const toggleAllTeams = () => {
    setSelectedTeams(prev => 
      prev.size === allTeams.length ? new Set() : new Set(allTeams)
    );
  };

  // Prepare chart data
  const data = useMemo(() => {
    try {
      const yearData = typedTeamStandings.find(d => d.year.toString() === year);
      if (!yearData) return null;
      
      // Calculate total sprint and feature race points for each team
      const teamsData = yearData.standings
        .filter(team => selectedTeams.has(team.teamName))
        .map(team => {
          const sprintPoints = team.sprintRaceScores.reduce((sum: number, score: number) => sum + score, 0);
          const featurePoints = team.featureRaceScores.reduce((sum: number, score: number) => sum + score, 0);
          return {
            name: team.teamName,
            sprintPoints,
            featurePoints,
            totalPoints: sprintPoints + featurePoints
          };
        });
      
      // Sort teams by total points in descending order
      teamsData.sort((a, b) => b.totalPoints - a.totalPoints);
      
      return {
        labels: teamsData.map(team => team.name),
        datasets: [
          {
            label: 'Sprint Race Points',
            data: teamsData.map(team => team.sprintPoints),
            backgroundColor: 'rgba(51, 102, 255, 0.8)', // Blue for sprint
            borderColor: 'rgb(51, 102, 255)',
            borderWidth: 1,
            stack: 'Stack 0',
          },
          {
            label: 'Feature Race Points',
            data: teamsData.map(team => team.featurePoints),
            backgroundColor: 'rgba(255, 51, 102, 0.8)', // Red for feature
            borderColor: 'rgb(255, 51, 102)',
            borderWidth: 1,
            stack: 'Stack 0',
          }
        ]
      };
    } catch (error) {
      console.error('Error preparing chart data:', error);
      setError('Failed to prepare chart data');
      return null;
    }
  }, [year, selectedTeams]);

  // Memoize chart options
  const options: ChartOptions<'bar'> = useMemo(() => {
    const textColor = theme === 'dark' ? '#fff' : '#000';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
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
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: isMobile ? 8 : 10,
            },
            padding: 8
          },
          stacked: true
        },
        x: {
          position: 'bottom',
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
            padding: 8,
            callback: function(value: any) {
              return value % 100 === 0 ? value : '';
            }
          },
          stacked: true,
          title: {
            display: true,
            text: 'Points',
            color: textColor,
            font: {
              size: isMobile ? 10 : 12,
            }
          }
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0
        }
      },
      barPercentage: 0.8,
      categoryPercentage: 0.8
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
      {showFilter && (
        <div className="absolute top-2 right-2 z-10">
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