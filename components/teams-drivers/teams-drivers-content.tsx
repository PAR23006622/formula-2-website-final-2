"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Users2 } from "lucide-react";
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        {teams.map((team, index) => (
          <div key={index} className="w-full max-w-sm bg-white dark:bg-[#1f2937] rounded-3xl shadow-sm hover:shadow-[0_0_15px_rgba(0,144,208,0.3)] transition-shadow duration-200 border dark:border-gray-800">
            <div className="p-6 space-y-4 text-center">
              <h3 className="text-xl font-semibold">{team.teamName}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Users2 className="h-4 w-4 text-[#0090d0]" />
                  <span className="text-base font-medium">Drivers</span>
                </div>
                {team.drivers.map((driver, dIndex) => (
                  <div key={dIndex}>
                    <span className="text-base text-muted-foreground">{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}