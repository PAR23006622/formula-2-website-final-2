"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { RacePointsDistributionChart } from "./race-points-distribution";
import { ChartDescription } from "@/components/ui/chart-description";
import calendarData from '@/results/calendar.json';
import { DriverFilter } from "./driver-filter";
import driverStandings from '@/results/driver-standings.json';

interface RacePointsCarouselProps {
  year: string;
}

export function RacePointsCarousel({ year }: RacePointsCarouselProps) {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [allDrivers, setAllDrivers] = useState<string[]>([]);

  // Get race locations from calendar
  const raceLocations = useMemo(() => {
    const yearCalendar = calendarData[year as keyof typeof calendarData];
    if (!yearCalendar) return [];
    return yearCalendar.races.map(race => race.location);
  }, [year]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Initialize drivers data
  useEffect(() => {
    const yearData = driverStandings.find(d => d.year.toString() === year);
    if (yearData) {
      const drivers = yearData.standings.map(driver => driver.driverName);
      setAllDrivers(drivers);
      setSelectedDrivers(new Set(drivers));
    }
  }, [year]);

  // Create pairs of races for the carousel
  const racePairs = useMemo(() => {
    const totalRaces = 14; // Assuming 14 races in a season
    const pairs = [];
    
    for (let i = 1; i < totalRaces; i += 2) {
      if (i + 1 <= totalRaces) {
        // Add a pair of races
        pairs.push([i, i + 1]);
      } else {
        // Add the last race by itself if there's an odd number
        pairs.push([i]);
      }
    }
    
    return pairs;
  }, []);

  const toggleDriver = React.useCallback((driverName: string) => {
    setSelectedDrivers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(driverName)) {
        newSet.delete(driverName);
      } else {
        newSet.add(driverName);
      }
      return newSet;
    });
  }, []);

  const toggleAllDrivers = React.useCallback(() => {
    setSelectedDrivers(prev => 
      prev.size === allDrivers.length ? new Set() : new Set(allDrivers)
    );
  }, [allDrivers]);

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Global filter that applies to all charts */}
        <div className="absolute top-2 right-2 z-20">
          <DriverFilter
            drivers={allDrivers}
            selectedDrivers={selectedDrivers}
            onToggleDriver={toggleDriver}
            onToggleAll={toggleAllDrivers}
          />
        </div>
        
        <Carousel setApi={setApi}>
          <CarouselContent>
            {racePairs.map((pair, index) => (
              <CarouselItem key={index}>
                <Card className={`chart-card ${isMobile ? 'h-[400px]' : 'h-[600px]'}`}>
                  <CardHeader className={isMobile ? 'p-3' : 'p-6'}>
                    <CardTitle className={isMobile ? 'text-base' : 'text-xl'}>
                      Total Points Per Race - Drivers Performance Overview
                    </CardTitle>
                    <ChartDescription className={isMobile ? 'text-xs' : 'text-sm'}>
                      {pair.length === 2 
                        ? `Points distribution for ${raceLocations[pair[0]-1] || `Race ${pair[0]}`} and ${raceLocations[pair[1]-1] || `Race ${pair[1]}`}`
                        : `Points distribution for ${raceLocations[pair[0]-1] || `Race ${pair[0]}`}`
                      }
                    </ChartDescription>
                  </CardHeader>
                  <CardContent className="chart-content p-0">
                    <div className="chart-wrapper">
                      <RacePointsDistributionChart
                        year={year}
                        startRace={pair[0]}
                        endRace={pair.length === 2 ? pair[1] : pair[0]}
                        title={pair.length === 2 
                          ? `${raceLocations[pair[0]-1] || `Race ${pair[0]}`} - ${raceLocations[pair[1]-1] || `Race ${pair[1]}`}`
                          : `${raceLocations[pair[0]-1] || `Race ${pair[0]}`}`
                        }
                        selectedDrivers={selectedDrivers}
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <Card className="chart-card h-auto py-4">
        <CardContent className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => api?.scrollPrev()}
              disabled={!api}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <Button
                  key={index}
                  variant={current === index ? "default" : "outline"}
                  className={`h-2.5 w-2.5 rounded-full p-0 ${
                    current === index 
                      ? 'bg-primary' 
                      : 'bg-muted border-2 border-primary/50 dark:border-primary/70'
                  }`}
                  onClick={() => api?.scrollTo(index)}
                  disabled={!api}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => api?.scrollNext()}
              disabled={!api}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}