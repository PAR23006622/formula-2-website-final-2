"use client";

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer } from "../../components/team-standings/chart-container";
import { CumulativePointsChart } from "../../components/team-standings/cumulative-points";
import { RacePointsCarousel } from "../../components/team-standings/race-points-carousel";
import { TotalPointsChart } from "../../components/team-standings/total-points";
import { SprintFeaturePointsChart } from "../../components/team-standings/sprint-feature-points";
import { TopTeamsChart } from "../../components/team-standings/top-teams";
import { PointsDistributionPie } from "../../components/team-standings/points-distribution-pie";
import { TeamFilter } from "../../components/team-standings/team-filter";
import teamStandings from '@/results/team-standings.json';

// Debug data loading
console.log('Initial team standings data:', teamStandings);

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

export default function TeamStandings() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [allTeams, setAllTeams] = useState<string[]>([]);

  // Debug data loading
  useEffect(() => {
    console.log('Current state:', {
      selectedYear,
      dataLoaded,
      selectedTeams: Array.from(selectedTeams),
      allTeams
    });
  }, [selectedYear, dataLoaded, selectedTeams, allTeams]);

  // Add debug logging
  useEffect(() => {
    try {
      console.log('Raw team standings:', teamStandings);
      const years = Array.from(new Set(typedTeamStandings.map(d => d.year.toString())));
      console.log('Available years:', years);
      
      if (years.length > 0) {
        // Set the most recent year as default
        const mostRecentYear = years.sort((a, b) => b.localeCompare(a))[0];
        setSelectedYear(mostRecentYear);
      }
      
      setDataLoaded(true);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }, []);

  // Initialize teams data with debug logging
  useEffect(() => {
    try {
      console.log('Looking for year data:', selectedYear);
      const yearData = typedTeamStandings.find(d => d.year.toString() === selectedYear);
      console.log('Found year data:', yearData);
      
      if (yearData) {
        const teams = yearData.standings.map(team => team.teamName);
        console.log('Found teams:', teams);
        setAllTeams(teams);
        setSelectedTeams(new Set(teams));
      }
    } catch (err) {
      console.error('Error initializing teams:', err);
    }
  }, [selectedYear]);

  // Toggle team selection
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

  // Toggle all teams
  const toggleAllTeams = () => {
    setSelectedTeams(prev => 
      prev.size === allTeams.length ? new Set() : new Set(allTeams)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Team Standings & Analytics</h1>
        <div className="">
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(typedTeamStandings.map(d => d.year.toString()))).sort((a, b) => b.localeCompare(a)).map(year => (
                <SelectItem key={year} value={year}>
                  {year} Season
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Cumulative Points</h3>
            </div>
            <TeamFilter
              teams={allTeams}
              selectedTeams={selectedTeams}
              onToggleTeam={toggleTeam}
              onToggleAll={toggleAllTeams}
            />
          </div>
          
          <div className="card p-4 rounded-lg border bg-white text-card-foreground shadow-sm h-[550px] dark:bg-[#1f2937] dark:border-gray-800">
            <div className="mb-4">
              <p className="text-muted-foreground text-sm">
                Track how teams accumulate championship points throughout the season.
              </p>
            </div>
            <div className="h-[calc(100%-2rem)]">
              <CumulativePointsChart 
                year={selectedYear} 
                externalSelectedTeams={selectedTeams}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <RacePointsCarousel year={selectedYear} />
        </div>

        <ChartContainer
          title="Total Points"
          description="Compare the total points earned by each team in the championship."
        >
          <TotalPointsChart year={selectedYear} showFilter={false} />
        </ChartContainer>

        <ChartContainer
          title="Sprint vs Feature Race Points"
          description="Compare points earned in sprint races versus feature races for each team."
        >
          <SprintFeaturePointsChart year={selectedYear} />
        </ChartContainer>

        <ChartContainer
          title="Top Teams"
          description="The top-performing teams based on total championship points."
        >
          <TopTeamsChart year={selectedYear} showFilter={false} />
        </ChartContainer>

        <ChartContainer
          title="Points Distribution"
          description="Distribution of points between sprint and feature races across all teams."
        >
          <PointsDistributionPie year={selectedYear} />
        </ChartContainer>
      </div>
    </div>
  );
}