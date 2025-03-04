"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface Driver {
  name: string;
}

interface Team {
  teamName: string;
  drivers: string[];
}

interface YearData {
  year: number;
  title: string;
  teams: Team[];
}

export function TeamsDriversContent() {
  const [teamsData, setTeamsData] = useState<YearData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamsData() {
      try {
        const response = await fetch('/api/teams-drivers');
        if (!response.ok) throw new Error('Failed to fetch teams data');
        const data = await response.json();
        
        setTeamsData(data);
        const availableYears = data.map((d: YearData) => d.year.toString())
                                 .sort((a: string, b: string) => Number(b) - Number(a));
        setYears(availableYears);
        if (!data.find((d: YearData) => d.year.toString() === selectedYear)) {
          setSelectedYear(availableYears[0]);
        }
      } catch (error) {
        console.error('Error loading teams data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamsData();
  }, []);

  const currentYearData = teamsData.find(d => d.year.toString() === selectedYear);
  const teams = currentYearData?.teams || [];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Formula 2 Teams & Drivers</h1>
        <div className="flex justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-3xl">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Formula 2 Teams & Drivers</h1>
      
      <div className="flex justify-center mb-8">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year} Season
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team.teamName} className="chart-card h-auto w-[280px] mx-auto">
            <CardHeader className="text-center py-3">
              <CardTitle className="text-lg">{team.teamName}</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div>
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Drivers</p>
                </div>
                <div className="space-y-1">
                  {team.drivers.map((driver) => (
                    <div key={driver} className="text-center">
                      <p className="text-sm font-medium">{driver}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}