"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { RacePointsDistributionChart } from "./race-points-distribution";
import { ChartDescription } from "@/components/ui/chart-description";
import calendarData from '@/results/calendar.json';

interface RacePointsCarouselProps {
  year: string;
  selectedDrivers: Set<string>;
}

export function RacePointsCarousel({ year, selectedDrivers }: RacePointsCarouselProps) {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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

  // Create pairs of races for the carousel
  const racePairs = useMemo(() => {
    const totalRaces = 14; // Assuming 14 races in a season
    const pairs = [];
    
    for (let i = 1; i < totalRaces; i += 2) {
      if (i + 1 <= totalRaces) {
        pairs.push([i, i + 1]);
      } else {
        pairs.push([i]);
      }
    }
    
    return pairs;
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative border rounded-lg bg-white shadow-md hover:shadow-[0_0_15px_rgba(0,144,208,0.3)] transition-shadow duration-200 dark:bg-[#1f2937] dark:border-gray-800">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {racePairs.map((pair, index) => (
              <CarouselItem key={index}>
                <Card className={`chart-card bg-white border-0 ${isMobile ? 'h-[400px]' : 'h-[600px]'} dark:bg-[#1f2937]`}>
                  <CardHeader className={isMobile ? 'p-3' : 'p-4'}>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {pair.length === 2 
                        ? `Points distribution for ${raceLocations[pair[0]-1] || `Race ${pair[0]}`} and ${raceLocations[pair[1]-1] || `Race ${pair[1]}`}`
                        : `Points distribution for ${raceLocations[pair[0]-1] || `Race ${pair[0]}`}`
                      }
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className={`${isMobile ? 'h-[350px]' : 'h-[500px]'}`}>
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

      <Card className="bg-white border shadow-md hover:shadow-[0_0_15px_rgba(0,144,208,0.3)] transition-shadow duration-200 dark:bg-[#1f2937] dark:border-gray-800">
        <CardContent className="flex items-center justify-center py-4">
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
                      ? 'bg-[#0090d0] dark:bg-[#0090d0] border-[#0090d0]' 
                      : 'dark:bg-[#1f2937] dark:hover:bg-[#2d3748] dark:border-gray-600'
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