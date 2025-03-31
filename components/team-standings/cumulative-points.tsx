"use client";

import { Line } from "react-chartjs-2";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { TeamFilter } from "./team-filter";
import teamStandings from '@/results/team-standings.json';
import calendarData from '@/results/calendar.json';

// Interface for raw data from JSON
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
}));

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

  // Initialize teams data
  useEffect(() => {
    try {
      const yearData = typedTeamStandings.find(d => d.year.toString() === year);
      if (yearData) {
        const teams = yearData.standings.map(team => team.teamName);
        setAllTeams(teams);
        if (!externalSelectedTeams) {
          setSelectedTeams(new Set(teams));
        }
      }
    } catch (error) {
      // Handle error silently or show user-facing error
    }
  }, [year, externalSelectedTeams]);

  // Update data when teams change
  useEffect(() => {
    try {
      const selectedYearData = typedTeamStandings.find(d => d.year.toString() === year);
      if (!selectedYearData) {
        console.error('No data found for year:', year);
        return;
      }

      const effectiveTeams = externalSelectedTeams || selectedTeams;
      console.log('Effective teams:', effectiveTeams);

      const datasets = selectedYearData.standings
        .filter(team => effectiveTeams.has(team.teamName))
        .map((team, index) => {
          const sprintPoints = team.sprintRaceScores;
          const featurePoints = team.featureRaceScores;
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
            tension: 0.1,
            fill: false
          };
        });

      const yearCalendar = typedCalendarData[year];
      const locations = yearCalendar ? yearCalendar.races.map(race => race.location) : [];

      setData({
        labels: locations.slice(0, Math.max(...datasets.map(d => d.data.length))),
        datasets
      });

      console.log('Updated chart data:', datasets);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }, [year, selectedTeams, externalSelectedTeams, teamColors]);

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

  if (!data) {
    return <div className="text-center">Loading data...</div>;
  }

  return (
    <div>
      {!externalSelectedTeams && (
        <div className="mb-4">
          <TeamFilter
            teams={allTeams}
            selectedTeams={selectedTeams}
            onToggleTeam={toggleTeam}
            onToggleAll={toggleAllTeams}
          />
        </div>
      )}
      <div className={`${isMobile ? 'h-[400px]' : 'h-[500px]'}`}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}