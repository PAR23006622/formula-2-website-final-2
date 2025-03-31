"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TeamFilter } from "./team-filter";
import teamStandings from '@/results/team-standings.json';
import calendarData from '@/results/calendar.json';
import { SimpleRaceChart } from "./simple-race-chart";
import "@/lib/chart-config";

// Interface for raw data from JSON
interface RawStanding {
  teamName: string;
  totalPoints: string;
  sprintRaceScores: string[];
  featureRaceScores: string[];
}

interface RawYearData {
  year: number;
  title: string;
  standings: RawStanding[];
}

// Interface for processed data
interface TeamStanding {
  teamName: string;
  totalPoints: string;
  sprintRaceScores: number[];
  featureRaceScores: number[];
  position: number;
}

interface YearData {
  year: number;
  title: string;
  standings: TeamStanding[];
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

interface RacePointsCarouselProps {
  year: string;
  externalSelectedTeams?: Set<string>;
}

// Process the raw data to match our expected format
const typedTeamStandings = (teamStandings as unknown as RawYearData[]).map(yearData => ({
  year: yearData.year,
  title: yearData.title,
  standings: yearData.standings.map((standing, index) => ({
    teamName: standing.teamName,
    totalPoints: standing.totalPoints,
    sprintRaceScores: standing.sprintRaceScores.map(Number),
    featureRaceScores: standing.featureRaceScores.map(Number),
    position: index + 1
  }))
})) as YearData[];

const typedCalendarData = calendarData as Record<string, CalendarYear>;

export function RacePointsCarousel({ year, externalSelectedTeams }: RacePointsCarouselProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [raceLocations, setRaceLocations] = useState<string[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!api) return;
    
    const pairCount = Math.ceil(raceLocations.length / 2);
    setCount(pairCount);
    setCurrentPage(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentPage(api.selectedScrollSnap());
    });
  }, [api, raceLocations.length]);

  // Get race locations from calendar
  useEffect(() => {
    const yearCalendar = typedCalendarData[year];
    if (yearCalendar) {
      setRaceLocations(yearCalendar.races.map(race => race.location));
    }
  }, [year]);

  // Initialize teams data
  useEffect(() => {
    try {
      const yearData = typedTeamStandings.find(d => d.year.toString() === year);
      if (yearData) {
        const teams = yearData.standings.map(team => team.teamName);
        setAllTeams(teams);
        if (!externalSelectedTeams) {
          setSelectedTeams(new Set(teams));
        }
      }
    } catch (error) {
      // Handle error silently or show user-facing error
    }
  }, [year, externalSelectedTeams]);

  // Toggle team selection
  const toggleTeam = (teamName: string) => {
    if (externalSelectedTeams) return;
    setSelectedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamName)) {
        newSet.delete(teamName);
      } else {
        newSet.add(teamName);
      }
      return newSet;
    });
  };

  // Toggle all teams
  const toggleAllTeams = () => {
    if (externalSelectedTeams) return; // Don't modify if using external selection
    setSelectedTeams(prev => 
      prev.size === allTeams.length ? new Set() : new Set(allTeams)
    );
  };
  
  // Create pairs of races for the carousel
  const racePairs = useMemo(() => {
    const totalRaces = raceLocations.length;
    const pairs = [];
    
    for (let i = 0; i < totalRaces; i += 2) {
      if (i + 1 < totalRaces) {
        // Add a pair of races (using 0-based index)
        pairs.push([i, i + 1]);
      } else {
        // Add the last race by itself if there's an odd number
        pairs.push([i]);
      }
    }
    
    return pairs;
  }, [raceLocations]);

  const currentTeams = externalSelectedTeams || selectedTeams;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Race Points Distribution</h3>
        </div>
        {!externalSelectedTeams && (
          <TeamFilter
            teams={allTeams}
            selectedTeams={selectedTeams}
            onToggleTeam={toggleTeam}
            onToggleAll={toggleAllTeams}
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="relative border rounded-lg bg-white shadow-sm hover:shadow-[0_0_15px_rgba(0,144,208,0.3)] transition-shadow duration-200 dark:bg-[#1f2937] dark:border-gray-800">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {racePairs.map((pair, index) => (
                <CarouselItem key={index}>
                  <Card className={`chart-card bg-white border-0 ${isMobile ? 'h-[400px]' : 'h-[600px]'} dark:bg-[#1f2937]`}>
                    <CardHeader className={isMobile ? 'p-3' : 'p-4'}>
                      <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {pair.length === 2 
                          ? `Points distribution for ${raceLocations[pair[0]] || `Race ${pair[0] + 1}`} and ${raceLocations[pair[1]] || `Race ${pair[1] + 1}`}`
                          : `Points distribution for ${raceLocations[pair[0]] || `Race ${pair[0] + 1}`}`
                        }
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className={`${isMobile ? 'h-[350px]' : 'h-[500px]'}`}>
                        <SimpleRaceChart
                          year={year}
                          startRace={pair[0] + 1}
                          endRace={pair.length === 2 ? pair[1] + 1 : pair[0] + 1}
                          selectedTeams={currentTeams}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <Card className="bg-white dark:bg-[#1f2937] border shadow-sm hover:shadow-[0_0_15px_rgba(0,144,208,0.3)] transition-shadow duration-200 dark:border-gray-800 rounded-3xl">
          <CardContent className="flex items-center justify-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => api?.scrollPrev()}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                {Array.from({ length: count }).map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index ? "default" : "outline"}
                    className={`h-2.5 w-2.5 rounded-full p-0 ${
                      currentPage === index 
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
                disabled={currentPage === count - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}