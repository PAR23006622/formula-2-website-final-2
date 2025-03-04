import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const resultsDir = path.join(process.cwd(), 'results');
    const standingsPath = path.join(resultsDir, 'driver-standings.json');
    
    // Ensure results directory exists
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
      return NextResponse.json({ error: 'Data not yet available. Please try again later.' }, { status: 404 });
    }

    // Check if the file exists
    if (!fs.existsSync(standingsPath)) {
      return NextResponse.json({ error: 'Driver standings data not found. Please try again later.' }, { status: 404 });
    }

    // Read and validate the file content
    const fileContent = fs.readFileSync(standingsPath, 'utf-8');
    if (!fileContent.trim()) {
      return NextResponse.json({ error: 'Driver standings data is empty. Please try again later.' }, { status: 500 });
    }

    try {
      const standingsData = JSON.parse(fileContent);
      
      // Validate data structure
      if (!Array.isArray(standingsData) || standingsData.length === 0) {
        return NextResponse.json({ error: 'Invalid driver standings data format' }, { status: 500 });
      }

      // Validate each year's data structure
      const validData = standingsData.every(yearData => 
        yearData && 
        typeof yearData.year === 'number' && 
        Array.isArray(yearData.standings) &&
        yearData.standings.every(driver => 
          driver && 
          typeof driver.driverName === 'string' && 
          typeof driver.totalPoints === 'string' &&
          Array.isArray(driver.sprintRaceScores) &&
          Array.isArray(driver.featureRaceScores)
        )
      );

      if (!validData) {
        return NextResponse.json({ error: 'Invalid data structure in driver standings' }, { status: 500 });
      }

      // Sort the data by year in descending order
      const sortedData = [...standingsData].sort((a, b) => b.year - a.year);

      return NextResponse.json(sortedData);
    } catch (parseError) {
      console.error('Error parsing driver standings JSON:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in driver standings file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error reading driver standings:', error);
    return NextResponse.json({
      error: 'Failed to load driver standings. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}