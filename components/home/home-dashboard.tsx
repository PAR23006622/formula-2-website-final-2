"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import driverStandings from "@/results/driver-standings.json";
import teamStandings from "@/results/team-standings.json";
import calendar from "@/results/calendar.json";
import teamsAndDrivers from "@/results/teams-and-drivers.json";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface TeamStanding {
  teamName: string;
  totalPoints: string;
}

interface TeamData {
  year: number;
  title: string;
  standings: TeamStanding[];
}

interface DriverStanding {
  driverName: string;
  totalPoints: string;
  sprintRacePoints?: string;
  featureRacePoints?: string;
}

interface DriverData {
  year: number;
  title: string;
  standings: DriverStanding[];
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

interface TeamDriverYear {
  year: number;
  title: string;
  teams: Array<{
    teamName: string;
    drivers: string[];
  }>;
}

const COLORS = [
  '#FF3838', // Red
  '#36A2EB', // Blue
  '#FFCE56', // Yellow
  '#4BC0C0', // Teal
  '#9966FF', // Purple
  '#FF9F40', // Orange
  '#FF6384', // Pink
  '#33B679', // Green
  '#775DD0', // Purple
  '#00D8B6', // Turquoise
  '#008FFB', // Light Blue
  '#FEB019', // Orange
];

export function HomeDashboard() {
  // Process team performance data over years
  const teamPerformanceData = useMemo(() => {
    try {
      const allTeams = new Set<string>();
      const yearlyData: Record<string, TeamData> = teamStandings as any;
      
      // Collect all unique team names
      Object.values(yearlyData).forEach((yearData) => {
        yearData.standings.forEach((team) => {
          allTeams.add(team.teamName);
        });
      });

      // Create data points for each year
      return Object.entries(yearlyData)
        .map(([year, yearData]) => {
          const dataPoint: Record<string, any> = { year };
          
          // Initialize all teams with 0 points
          allTeams.forEach(team => {
            dataPoint[team] = 0;
          });
          
          // Fill in actual points
          yearData.standings.forEach(team => {
            dataPoint[team.teamName] = parseInt(team.totalPoints || '0');
          });
          
          return dataPoint;
        })
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));
    } catch (error) {
      console.error('Error processing team data:', error);
      return [];
    }
  }, []);

  // Process points distribution for latest season
  const pointsDistributionData = useMemo(() => {
    try {
      const yearlyData: Record<string, DriverData> = driverStandings as any;
      const years = Object.keys(yearlyData);
      const latestYear = years[years.length - 1];
      const yearData = yearlyData[latestYear];
      
      return yearData.standings
        .map(driver => ({
          name: driver.driverName.split(' ')[1] || driver.driverName,
          Sprint: parseInt(driver.sprintRacePoints || '0'),
          Feature: parseInt(driver.featureRacePoints || '0'),
          Total: parseInt(driver.totalPoints || '0')
        }))
        .sort((a, b) => b.Total - a.Total)
        .slice(0, 8);
    } catch (error) {
      console.error('Error processing driver data:', error);
      return [];
    }
  }, []);

  // Process all-time team points for pie chart
  const teamTotalPoints = useMemo(() => {
    try {
      const teamPoints: Record<string, number> = {};
      const yearlyData: Record<string, TeamData> = teamStandings as any;
      
      Object.values(yearlyData).forEach((yearData) => {
        yearData.standings.forEach(team => {
          const points = parseInt(team.totalPoints || '0');
          teamPoints[team.teamName] = (teamPoints[team.teamName] || 0) + points;
        });
      });

      return Object.entries(teamPoints)
        .map(([name, value]) => ({
          name,
          value
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    } catch (error) {
      console.error('Error processing team total points:', error);
      return [];
    }
  }, []);

  // Process driver transfers data
  const driverTransfersData = useMemo(() => {
    try {
      const yearlyDrivers: Record<string, Set<string>> = {};
      const transferCounts: { year: string; transfers: number }[] = [];

      // First, collect drivers for each year
      teamsAndDrivers.forEach((yearData: TeamDriverYear) => {
        const year = yearData.year.toString();
        yearlyDrivers[year] = new Set();
        yearData.teams.forEach(team => {
          team.drivers.forEach(driver => {
            yearlyDrivers[year].add(driver);
          });
        });
      });

      // Calculate transfers between consecutive years
      const years = Object.keys(yearlyDrivers).sort();
      years.forEach((year, index) => {
        if (index > 0) {
          const prevYear = years[index - 1];
          const currentDrivers = yearlyDrivers[year];
          const prevDrivers = yearlyDrivers[prevYear];
          
          // Count drivers in current year who weren't in previous year
          const transfers = Array.from(currentDrivers)
            .filter(driver => !prevDrivers.has(driver)).length;
          
          transferCounts.push({
            year,
            transfers
          });
        }
      });

      return transferCounts;
    } catch (error) {
      console.error('Error processing driver transfers:', error);
      return [];
    }
  }, []);

  // Get current driver standings (2024)
  const currentDriverStandings = useMemo(() => {
    try {
      const yearlyData: Record<string, DriverData> = driverStandings as any;
      const standings = yearlyData['2024']?.standings || [];
      
      return standings
        .map(driver => ({
          position: 0, // Will be set by index
          name: driver.driverName,
          points: parseInt(driver.totalPoints || '0')
        }))
        .sort((a, b) => b.points - a.points)
        .map((driver, index) => ({
          ...driver,
          position: index + 1
        }));
    } catch (error) {
      console.error('Error processing current standings:', error);
      return [];
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance Chart */}
        <Card className="p-6 bg-card shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Team Performance Over Time</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={teamPerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
                <XAxis 
                  dataKey="year"
                  stroke="currentColor"
                  className="text-muted-foreground text-sm"
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground text-sm"
                  label={{ value: 'Points', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                {teamPerformanceData.length > 0 && 
                  Object.keys(teamPerformanceData[0])
                    .filter(key => key !== 'year')
                    .map((team, index) => (
                      <Line
                        key={team}
                        type="monotone"
                        dataKey={team}
                        name={team}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Points Distribution Chart */}
        <Card className="p-6 bg-card shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Points Distribution Per Race</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pointsDistributionData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
                <XAxis 
                  dataKey="name"
                  stroke="currentColor"
                  className="text-muted-foreground text-sm"
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground text-sm"
                  label={{ value: 'Points', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="Sprint" fill={COLORS[0]} stackId="a" />
                <Bar dataKey="Feature" fill={COLORS[1]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Most Successful Teams Chart */}
        <Card className="p-6 bg-card shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Most Successful Teams (All-Time)</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={teamTotalPoints}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {teamTotalPoints.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Driver Transfers Chart */}
        <Card className="p-6 bg-card shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Driver Transfers Over the Years</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverTransfersData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
                <XAxis
                  dataKey="year"
                  stroke="currentColor"
                  className="text-muted-foreground text-sm"
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground text-sm"
                  label={{ value: 'Number of Transfers', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar
                  dataKey="transfers"
                  fill={COLORS[4]}
                  radius={[4, 4, 0, 0]}
                  name="Driver Transfers"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Driver Standings Table */}
      <Card className="p-6 bg-card shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Driver Standings 2024</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDriverStandings.map((driver) => (
              <TableRow key={driver.name}>
                <TableCell>{driver.position}</TableCell>
                <TableCell>{driver.name}</TableCell>
                <TableCell className="text-right">{driver.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 