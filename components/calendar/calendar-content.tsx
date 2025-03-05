"use client";

import { useEffect, useState } from "react";
import calendarData from "@/results/calendar.json";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";
import Image from 'next/image';

interface CalendarContentProps {
  defaultYear: string;
  years: string[];
}

const getCountryCode = (location: string): string => {
  // Convert location to lowercase for case-insensitive matching
  const locationLower = location.toLowerCase();
  const countryMap: { [key: string]: string } = {
    'sakhir': 'bh',
    'jeddah': 'sa',
    'melbourne': 'au',
    'baku': 'az',
    'imola': 'it',
    'monte carlo': 'mc',
    'barcelona': 'es',
    'spielberg': 'at',
    'silverstone': 'gb',
    'budapest': 'hu',
    'spa-francorchamps': 'be',
    'monza': 'it',
    'sochi': 'ru',
    'yas island': 'ae',
    'le castellet': 'fr',
    'zandvoort': 'nl',
    'lusail': 'qa',
    'mugello': 'it',
    'jerez de la frontera': 'es'
  };
  return countryMap[locationLower] || 'unknown';
};

const getFlagBackground = (countryCode: string): string => {
  // Define background colors based on country
  const backgroundColors: { [key: string]: string } = {
    'bh': 'bg-red-50', // Light red for Bahrain
    'sa': 'bg-green-50', // Light green for Saudi Arabia
    // Add more colors as needed
  };
  return backgroundColors[countryCode] || 'bg-gray-50';
};

export function CalendarContent({ defaultYear }: CalendarContentProps) {
  const [races, setRaces] = useState<any[]>([]);

  useEffect(() => {
    if (defaultYear) {
      const yearData = calendarData[defaultYear as keyof typeof calendarData];
      if (yearData && yearData.races) {
        setRaces(yearData.races);
      } else {
        setRaces([]);
      }
    }
  }, [defaultYear]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {races.map((race, index) => {
        const countryCode = getCountryCode(race.location);
        return (
          <Card key={index} className="overflow-hidden bg-white dark:bg-[#1f2937] shadow-sm hover:shadow-[0_0_15px_rgba(0,144,208,0.3)] transition-shadow duration-200 rounded-3xl dark:border-gray-800">
            <div className="text-center p-4">
              <h3 className="text-lg font-medium">Round {index + 1}</h3>
            </div>
            <div className="px-10 pb-4">
              <div className="aspect-[3/2] w-full rounded-xl border dark:border-gray-800 overflow-hidden flex items-center justify-center relative">
                <Image
                  src={`https://flagcdn.com/w640/${countryCode}.png`}
                  alt={`Flag of ${race.location}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
            <div className="px-4 pb-4 space-y-2 flex flex-col items-center">
              <div className="flex items-center gap-2 justify-center">
                <MapPin className="h-4 w-4 text-[#0090d0]" />
                <span className="text-base">{race.location}</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Calendar className="h-4 w-4 text-[#0090d0]" />
                <span className="text-sm text-muted-foreground">
                  {race.startDate} - {race.endDate} {race.month}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}