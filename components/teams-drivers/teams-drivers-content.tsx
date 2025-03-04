"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import teamsAndDrivers from '@/results/teams-and-drivers.json';

interface TeamsDriversContentProps {
  year: string;
  showHeader?: boolean;
}

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

export function TeamsDriversContent({ year, showHeader = true }: TeamsDriversContentProps) {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    // Get teams data for the selected year
    const yearData = teamsAndDrivers.find(d => d.year.toString() === year);
    if (yearData) {
      setTeams(yearData.teams);
    } else {
      setTeams([]);
    }
    setLoading(false);
  }, [year]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
}