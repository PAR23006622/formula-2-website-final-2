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

// Vercel cron job will hit this endpoint every 30 minutes
export async function GET(request: Request) {
    try {
        // Check for secret token to prevent unauthorized access
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        
        if (token !== process.env.CRON_SECRET_TOKEN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Starting scheduled scraping process...');

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
    } catch (error: unknown) {
        console.error('Error during scheduled scraping:', error);
        return NextResponse.json({ 
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }, { status: 500 });
    }
}