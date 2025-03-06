"use client";

import { Line } from "react-chartjs-2";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { TeamFilter } from "./team-filter";
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

interface CumulativePointsChartProps {
  year: string;
  externalSelectedTeams?: Set<string>;
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

export function CumulativePointsChart({ year, externalSelectedTeams }: CumulativePointsChartProps) {
  const [data, setData] = useState<any>(null);
  const { theme } = useTheme();
  const [options, setOptions] = useState({});
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    const handleResize = () => {
      checkMobile();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTeam = useCallback((teamName: string) => {
    setSelectedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamName)) {
        newSet.delete(teamName);
      } else {
        newSet.add(teamName);
      }
      return newSet;
    });
  }, []);

  const toggleAllTeams = useCallback(() => {
    setSelectedTeams(prev => 
      prev.size === allTeams.length ? new Set() : new Set(allTeams)
    );
  }, [allTeams]);

  const teamColors = useMemo(() => [
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
  ], []);

  useEffect(() => {
    const selectedYearData = typedTeamStandings.find(d => d.year.toString() === year);
    if (!selectedYearData) return;

    const teamNames = selectedYearData.standings.map(team => team.teamName);
    setAllTeams(teamNames);
    setSelectedTeams(new Set(teamNames));
  }, [year]);

  // Get race locations from calendar
  const raceLocations = useMemo(() => {
    const yearCalendar = typedCalendarData[year];
    if (!yearCalendar) return [];
    return yearCalendar.races.map(race => race.location);
  }, [year]);

  // Use external selected teams if provided
  const effectiveSelectedTeams = externalSelectedTeams || selectedTeams;

  useEffect(() => {
    const selectedYearData = typedTeamStandings.find(d => d.year.toString() === year);
    if (!selectedYearData) return;

    const datasets = selectedYearData.standings.map((team, index) => {
      const sprintPoints = team.sprintRaceScores.map(Number);
      const featurePoints = team.featureRaceScores.map(Number);
      let cumulative = 0;
      const cumulativePoints = [];
      
      for (let i = 0; i < Math.max(sprintPoints.length, featurePoints.length); i++) {
        cumulative += (sprintPoints[i] || 0) + (featurePoints[i] || 0);
        cumulativePoints.push(cumulative);
      }

      return {
        label: team.teamName,
        data: cumulativePoints,
        borderColor: teamColors[index % teamColors.length],
        backgroundColor: teamColors[index % teamColors.length],
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: teamColors[index % teamColors.length],
        pointBorderColor: teamColors[index % teamColors.length],
        pointBorderWidth: 1,
        tension: 0.1,
        fill: false,
        hidden: !effectiveSelectedTeams.has(team.teamName)
      };
    }).filter(Boolean);

    setData({
      labels: raceLocations.slice(0, Math.max(...datasets.map(d => d.data.length))),
      datasets
    });
  }, [year, effectiveSelectedTeams, isMobile, teamColors, theme, raceLocations]);

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
            font: {
              size: isMobile ? 8 : 10,
            },
            callback: function(value: any) {
              return value + ' pts';
            }
          },
          title: {
            display: true,
            text: 'Points',
            color: textColor,
            font: {
              size: isMobile ? 10 : 12,
            }
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
            maxRotation: isMobile ? 45 : 60,
            minRotation: isMobile ? 45 : 60,
            font: {
              size: isMobile ? 8 : 9,
            },
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
          }
        },
      }
    });
  }, [theme, isMobile]);

  if (!data) return null;

  return (
    <div>
      <div className={`${isMobile ? 'h-[400px]' : 'h-[500px]'}`}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}