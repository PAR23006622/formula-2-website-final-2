"use client";

// Define consistent team name mappings
const teamNameMappings: Record<string, string> = {
  "RUSSIAN TIME": "Russian Time",
  "PREMA Racing": "PREMA Racing",
  "DAMS Lucas Oil": "DAMS",
  "PERTAMINA PREMA Theodore Racing": "PREMA Racing",
  "UNI-Virtuosi Racing": "Virtuosi Racing",
  "Invicta Racing": "Virtuosi Racing",
  "Rodin Motorsport": "Rodin Carlin",
  "Rodin Carlin": "Rodin Carlin",
  "Carlin": "Carlin",
  "BWT Arden": "Arden",
  "Pertamina Arden": "Arden",
  "Campos Vexatec Racing": "Campos Racing",
  "Sauber Junior Team by Charouz": "Charouz Racing System",
  "BWT HWA RACELAB": "HWA RACELAB",
  "Hitech TGR": "Hitech Grand Prix",
  "Hitech Pulse-Eight": "Hitech Grand Prix",
  "Hitech Grand Prix": "Hitech Grand Prix",
  "PHM Racing": "PHM Racing by Charouz",
  "AIX Racing": "AIX Racing",
  "Van Amersfoort Racing": "VAR",
  "MP Motorsport": "MP Motorsport",
  "ART Grand Prix": "ART Grand Prix",
  "TRIDENT": "Trident",
  "Racing Engineering": "Racing Engineering"
};

// Generate a fixed set of colors for teams
export function generateTeamColors(count: number) {
  const baseColors = [
    { h: 348, s: 83, l: 47 }, // Red
    { h: 207, s: 90, l: 54 }, // Blue
    { h: 142, s: 71, l: 45 }, // Green
    { h: 27, s: 96, l: 61 }, // Orange
    { h: 271, s: 81, l: 56 }, // Purple
    { h: 180, s: 77, l: 42 }, // Teal
    { h: 45, s: 93, l: 47 }, // Yellow
    { h: 315, s: 70, l: 50 }, // Pink
    { h: 235, s: 85, l: 65 }, // Light Blue
    { h: 90, s: 75, l: 45 }, // Lime
    { h: 0, s: 85, l: 55 }, // Bright Red
    { h: 200, s: 95, l: 45 } // Deep Blue
  ];

  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = baseColors[i % baseColors.length];
    colors.push(`hsla(${color.h}, ${color.s}%, ${color.l}%, 0.8)`);
  }
  return colors;
}

// Normalize team name to ensure consistency
export function normalizeTeamName(teamName: string): string {
  return teamNameMappings[teamName] || teamName;
}

// Create a consistent color mapping for teams
export function createTeamColorMap(teams: string[]) {
  // Normalize team names first
  const normalizedTeams = teams.map(normalizeTeamName);
  // Remove duplicates
  const uniqueTeams = Array.from(new Set(normalizedTeams));
  
  const colors = generateTeamColors(uniqueTeams.length);
  const colorMap: Record<string, string> = {};
  
  // Create mapping for both original and normalized team names
  teams.forEach((team, index) => {
    if (team) {
      const normalizedName = normalizeTeamName(team);
      const colorIndex = uniqueTeams.indexOf(normalizedName);
      colorMap[team] = colors[colorIndex];
      colorMap[normalizedName] = colors[colorIndex];
    }
  });
  
  return colorMap;
}

// Generate a fixed set of colors for drivers
export function generateDriverColors(count: number) {
  const colors = [];
  const baseHues = [348, 207, 142, 27, 271, 180, 45, 315, 235, 90];
  
  for (let i = 0; i < count; i++) {
    const hue = baseHues[i % baseHues.length];
    colors.push(`hsla(${hue}, 70%, 50%, 0.8)`);
  }
  
  return colors;
}

// Create a consistent color mapping for drivers
export function createDriverColorMap(drivers: string[]) {
  const colors = generateDriverColors(drivers.length);
  return Object.fromEntries(drivers.map((driver, index) => [driver, colors[index]]));
}