import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { scrapeDriverStandings } from '@/lib/scrapers/driver-standings';
import { scrapeTeamStandings } from '@/lib/scrapers/team-standings';
import { scrapeTeamsAndDrivers } from '@/lib/scrapers/teams-and-drivers';
import { scrapeCalendar } from '@/lib/scrapers/calendar';

const resultsDir = path.join(process.cwd(), 'results');

if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

export async function GET() {
    try {
        // Run scrapers sequentially
        console.log('Starting scraping process...');

        // 1. Driver Standings
        console.log('Scraping driver standings...');
        const driverStandings = await scrapeDriverStandings();
        fs.writeFileSync(
            path.join(resultsDir, 'driver-standings.json'),
            JSON.stringify(driverStandings, null, 2)
        );

        // 2. Team Standings
        console.log('Scraping team standings...');
        const teamStandings = await scrapeTeamStandings();
        fs.writeFileSync(
            path.join(resultsDir, 'team-standings.json'),
            JSON.stringify(teamStandings, null, 2)
        );

        // 3. Calendar
        console.log('Scraping calendar...');
        const calendar = await scrapeCalendar();
        fs.writeFileSync(
            path.join(resultsDir, 'calendar.json'),
            JSON.stringify(calendar, null, 2)
        );

        // 4. Teams and Drivers
        console.log('Scraping teams and drivers...');
        const teamsAndDrivers = await scrapeTeamsAndDrivers();
        fs.writeFileSync(
            path.join(resultsDir, 'teams-and-drivers.json'),
            JSON.stringify(teamsAndDrivers, null, 2)
        );

        return NextResponse.json({ 
            status: 'success',
            message: 'All data scraped successfully'
        });
    } catch (error: unknown) {
        console.error('Error during scraping:', error);
        return NextResponse.json({ 
            status: 'error',
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}