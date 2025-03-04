"use client";

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamsDriversContent } from "@/components/teams-drivers/teams-drivers-content";
import { StructuredData } from "@/components/seo/structured-data";
import { generateWebsiteSchema } from "@/lib/schema";
import teamsAndDrivers from '@/results/teams-and-drivers.json';

export default function TeamsDrivers() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    // Get unique years from the teams and drivers data
    const availableYears = teamsAndDrivers
      .map(d => d.year.toString())
      .sort((a, b) => Number(b) - Number(a)); // Sort in descending order
    setYears(availableYears);
    
    // Set initial year to the most recent one if not already set
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [selectedYear]);

  return (
    <>
      <StructuredData data={generateWebsiteSchema()} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Formula 2 Teams & Drivers</h1>
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
        <TeamsDriversContent year={selectedYear} showHeader={false} />
      </div>
    </>
  );
}