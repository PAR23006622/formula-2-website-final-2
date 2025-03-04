"use client";

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarContent } from "@/components/calendar/calendar-content";
import { StructuredData } from "@/components/seo/structured-data";
import { generateWebsiteSchema } from "@/lib/schema";
import calendarData from '@/results/calendar.json';

export default function CalendarPage() {
  // Get years from calendar data and sort them in descending order
  const years = Object.keys(calendarData).sort((a, b) => parseInt(b) - parseInt(a));
  const currentYear = new Date().getFullYear().toString();
  const defaultYear = years.includes(currentYear) ? currentYear : years[0];
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  return (
    <>
      <StructuredData data={generateWebsiteSchema()} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Formula 2 Race Calendar
          </h1>
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
        <CalendarContent defaultYear={selectedYear} years={years} />
      </div>
    </>
  );
}