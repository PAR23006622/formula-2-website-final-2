import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Team {
  teamName: string;
  totalPoints: string;
  sprintRaceScores: string[];
  featureRaceScores: string[];
}

interface YearData {
  year: number;
  standings: Team[];
}

export async function GET() {
  try {
    const resultsDir = path.join(process.cwd(), 'results');
    const standingsPath = path.join(resultsDir, 'team-standings.json');
    
    // Ensure results directory exists
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
      return NextResponse.json({ error: 'Data not yet available. Please try again later.' }, { status: 404 });
    }

    // Check if the file exists
    if (!fs.existsSync(standingsPath)) {
      return NextResponse.json({ error: 'Team standings data not found. Please try again later.' }, { status: 404 });
    }

    // Read and validate the file content
    const fileContent = fs.readFileSync(standingsPath, 'utf-8');
    if (!fileContent.trim()) {
      return NextResponse.json({ error: 'Team standings data is empty. Please try again later.' }, { status: 500 });
    }

    try {
      const standingsData = JSON.parse(fileContent) as YearData[];
      
      // Validate data structure
      if (!Array.isArray(standingsData) || standingsData.length === 0) {
        return NextResponse.json({ error: 'Invalid team standings data format' }, { status: 500 });
      }

      // Validate each year's data structure
      const validData = standingsData.every((yearData: YearData) => 
        yearData && 
        typeof yearData.year === 'number' && 
        Array.isArray(yearData.standings) &&
        yearData.standings.every((team: Team) => 
          team && 
          typeof team.teamName === 'string' && 
          typeof team.totalPoints === 'string' &&
          Array.isArray(team.sprintRaceScores) &&
          Array.isArray(team.featureRaceScores)
        )
      );

      if (!validData) {
        return NextResponse.json({ error: 'Invalid data structure in team standings' }, { status: 500 });
      }

      // Sort the data by year in descending order
      const sortedData = [...standingsData].sort((a, b) => b.year - a.year);

      return NextResponse.json(sortedData);
    } catch (parseError) {
      console.error('Error parsing team standings JSON:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in team standings file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error reading team standings:', error);
    return NextResponse.json({ 
      error: 'Failed to load team standings. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}