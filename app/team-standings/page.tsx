"use client";

import { useState } from 'react';
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

export default function TeamStandings() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const years = [...new Set(teamStandings.map(d => d.year.toString()))].sort().reverse();
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [allTeams, setAllTeams] = useState<string[]>([]);

  // Initialize teams data
  useState(() => {
    const yearData = teamStandings.find(d => d.year.toString() === selectedYear);
    if (yearData) {
      const teams = yearData.standings.map(team => team.driverName);
      setAllTeams(teams);
      setSelectedTeams(new Set(teams));
    }
  });

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
        <h1 className="text-3xl font-bold mb-4">Team Standings</h1>
        <div className="">
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
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
          
          <div className="card p-4 rounded-lg border bg-card text-card-foreground shadow-sm h-[600px] dark:bg-[#1f2937] dark:border-gray-800">
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