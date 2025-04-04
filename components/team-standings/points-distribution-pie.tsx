"use client";

import { Pie } from "react-chartjs-2";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import teamStandings from '@/results/team-standings.json';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

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

// Process the raw data to match our expected format
const typedTeamStandings = (teamStandings as unknown as RawYearData[]).map(yearData => ({
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
  ArcElement,
  Tooltip,
  Legend
);

export function PointsDistributionPie({ year }: { year: string }) {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prepare chart data
  const data = useMemo(() => {
    const currentYear = typedTeamStandings.find(d => d.year.toString() === year);
    
    if (!currentYear) return null;

    let totalSprintPoints = 0;
    let totalFeaturePoints = 0;

    currentYear.standings.forEach(team => {
      totalSprintPoints += team.sprintRaceScores.reduce((sum: number, score: number) => 
        sum + score, 0);
      totalFeaturePoints += team.featureRaceScores.reduce((sum: number, score: number) => 
        sum + score, 0);
    });

    return {
      labels: ['Sprint Race Points', 'Feature Race Points'],
      datasets: [{
        data: [totalSprintPoints, totalFeaturePoints],
        backgroundColor: [
          '#4372ff', // Sprint race blue
          '#ff4372', // Feature race pink
        ],
        borderWidth: 0
      }]
    };
  }, [year]);

  // Memoize chart options
  const options: ChartOptions<'pie'> = useMemo(() => {
    const textColor = theme === 'dark' ? '#fff' : '#000';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
          labels: {
            color: textColor,
            font: {
              size: 12,
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          },
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${context.raw} points (${percentage}%)`;
            }
          }
        }
      },
      layout: {
        padding: {
          top: 20
        }
      }
    };
  }, [theme]);

  if (!data) return null;

  return (
    <div className="w-full h-full">
      <Pie data={data} options={options} />
    </div>
  );
} 