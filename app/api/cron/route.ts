import { NextResponse } from 'next/server';
import { scrapeDriverStandings } from '../../../api/driver-standings';
import { scrapeTeamStandings } from '../../../api/team-standings';
import { scrapeCalendar } from '../../../api/calendar';
import { scrapeTeamsAndDrivers } from '../../../api/teams-and-drivers';

// Use Node.js runtime instead of Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function triggerScraper() {
    try {
        // Scrape all data
        console.log('Starting scraping cycle...');
        
        // Driver Standings
        console.log('Scraping driver standings...');
        const driverStandings = await scrapeDriverStandings();
        
        // Team Standings
        console.log('Scraping team standings...');
        const teamStandings = await scrapeTeamStandings();
        
        // Calendar
        console.log('Scraping calendar...');
        const calendar = await scrapeCalendar();
        
        // Teams and Drivers
        console.log('Scraping teams and drivers...');
        const teamsAndDrivers = await scrapeTeamsAndDrivers();

        return { 
            success: true, 
            message: 'All data scraped successfully',
            data: {
                driverStandings,
                teamStandings,
                calendar,
                teamsAndDrivers
            }
        };
    } catch (error: unknown) {
        console.error('Error in scraping cycle:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
        };
    }
}

export async function GET() {
    try {
        const result = await triggerScraper();
        return NextResponse.json(result);
    } catch (error: unknown) {
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to run scraping cycle' 
            },
            { status: 500 }
        );
    }
}