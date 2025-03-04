"use client";

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer } from "@/components/driver-standings/chart-container";
import { TotalPointsChart } from "@/components/driver-standings/total-points";
import { RaceTypePointsChart } from "@/components/driver-standings/race-type-points";
import { CumulativePointsChart } from "@/components/driver-standings/cumulative-points";
import { RacePointsCarousel } from "@/components/driver-standings/race-points-carousel";
import { TopDriversChart } from "@/components/driver-standings/top-drivers";
import { AveragePointsChart } from "@/components/driver-standings/average-points";
import { PointsDistributionPieChart } from "@/components/driver-standings/points-distribution-pie";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCw } from "lucide-react";
import { StructuredData } from "@/components/seo/structured-data";
import { generateWebsiteSchema } from "@/lib/schema";
import { DriverFilter } from "@/components/driver-standings/driver-filter";
import driverStandings from '@/results/driver-standings.json';

interface DriverData {
  driverName: string;
  sprintRaceScores: string[];
  featureRaceScores: string[];
}

interface YearData {
  year: number;
  standings: DriverData[];
}

export default function DriverStandings() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [allDrivers, setAllDrivers] = useState<string[]>([]);

  // Initialize drivers data when year changes
  useEffect(() => {
    const yearData = driverStandings.find((d: YearData) => d.year.toString() === selectedYear);
    if (yearData) {
      const drivers = yearData.standings.map((driver: DriverData) => driver.driverName);
      setAllDrivers(drivers);
      setSelectedDrivers(new Set(drivers)); // Initialize with all drivers selected
    }
  }, [selectedYear]);

  // Toggle driver selection
  const toggleDriver = (driverName: string) => {
    setSelectedDrivers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(driverName)) {
        newSet.delete(driverName);
      } else {
        newSet.add(driverName);
      }
      return newSet;
    });
  };

  // Toggle all drivers
  const toggleAllDrivers = () => {
    setSelectedDrivers(prev => 
      prev.size === allDrivers.length ? new Set() : new Set(allDrivers)
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/driver-standings');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch standings data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid data format received from server');
        }
        
        const availableYears = data
          .map((d: any) => d.year.toString())
          .sort((a: string, b: string) => Number(b) - Number(a));
        
        setYears(availableYears);
        
        if (!data.find((d: any) => d.year.toString() === selectedYear)) {
          setSelectedYear(availableYears[0]);
        }
      } catch (error) {
        console.error('Error loading standings data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Driver Standings & Analytics</h1>
        <div className="flex justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-3xl">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Driver Standings & Analytics</h1>
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            {error}
          </AlertDescription>
        </Alert>
        <button
          onClick={() => window.location.reload()}
          className="mx-auto block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <StructuredData data={generateWebsiteSchema()} />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Driver Standings & Analytics</h1>
          <div className="w-45">
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="">
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
        
        <div className="grid grid-cols-1 gap-6">
          {/* Line Charts - Full Width */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-xl font-semibold">Cumulative Points</h3>
                <DriverFilter
                  drivers={allDrivers}
                  selectedDrivers={selectedDrivers}
                  onToggleDriver={toggleDriver}
                  onToggleAll={toggleAllDrivers}
                />
              </div>
            </div>
            
            <ChartContainer
              title=""
              description="Track how drivers accumulate championship points throughout the season."
            >
              <CumulativePointsChart 
                year={selectedYear} 
                selectedDrivers={selectedDrivers}
              />
            </ChartContainer>
            
            <RacePointsCarousel year={selectedYear} />
          </div>

          {/* Other Charts - Grid Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            <ChartContainer 
              title="Total Points per Driver" 
              description="Bar chart showing the total championship points accumulated by each driver, providing a clear view of the overall standings."
            >
              <TotalPointsChart year={selectedYear} />
            </ChartContainer>
            
            <ChartContainer 
              title="Sprint vs Feature Race Points" 
              description="Comparison of points earned in sprint races versus feature races for each driver, highlighting performance across different race formats."
            >
              <RaceTypePointsChart year={selectedYear} />
            </ChartContainer>
            
            <ChartContainer 
              title="Top 5 Drivers Comparison" 
              description="Focused comparison of the championship's leading drivers, showing their total points and relative performance."
            >
              <TopDriversChart year={selectedYear} />
            </ChartContainer>
            
            <ChartContainer 
              title="Average Points per Race" 
              description="Bar chart displaying each driver's average points scored per race, indicating consistent performance levels."
            >
              <AveragePointsChart year={selectedYear} />
            </ChartContainer>
            
            <ChartContainer 
              title="Points Distribution by Race Type" 
              description="Pie chart showing the overall distribution of points between sprint races and feature races across all drivers."
            >
              <PointsDistributionPieChart year={selectedYear} />
            </ChartContainer>
          </div>
        </div>
      </div>
    </>
  );
}