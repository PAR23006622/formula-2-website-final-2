import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { scrapeDriverStandings } from '@/lib/scrapers/driver-standings';
import { scrapeTeamStandings } from '@/lib/scrapers/team-standings';
import { scrapeTeamsAndDrivers } from '@/lib/scrapers/teams-and-drivers';
import { scrapeCalendar } from '@/lib/scrapers/calendar';

const resultsDir = path.join(process.cwd(), 'results');

// Ensure results directory exists
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
}

export async function GET() {
    try {
        console.log('Starting manual data update...');

        // Run scrapers sequentially
        const driverStandings = await scrapeDriverStandings();
        fs.writeFileSync(
            path.join(resultsDir, 'driver-standings.json'),
            JSON.stringify(driverStandings, null, 2)
        );
        console.log('Driver standings updated');

        const teamStandings = await scrapeTeamStandings();
        fs.writeFileSync(
            path.join(resultsDir, 'team-standings.json'),
            JSON.stringify(teamStandings, null, 2)
        );
        console.log('Team standings updated');

        const calendar = await scrapeCalendar();
        fs.writeFileSync(
            path.join(resultsDir, 'calendar.json'),
            JSON.stringify(calendar, null, 2)
        );
        console.log('Calendar updated');

        const teamsAndDrivers = await scrapeTeamsAndDrivers();
        fs.writeFileSync(
            path.join(resultsDir, 'teams-and-drivers.json'),
            JSON.stringify(teamsAndDrivers, null, 2)
        );
        console.log('Teams and drivers updated');

        return NextResponse.json({
            success: true,
            message: 'Data updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error during data update:', error);
        return NextResponse.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}