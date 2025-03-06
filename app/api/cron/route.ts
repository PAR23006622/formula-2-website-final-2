import { NextResponse } from 'next/server';
import { scrapeDriverStandings } from '../../../api/driver-standings';
import { scrapeTeamStandings } from '../../../api/team-standings';
import { scrapeCalendar } from '../../../api/calendar';
import { scrapeTeamsAndDrivers } from '../../../api/teams-and-drivers';
import { put } from '@vercel/blob';

// Set runtime to edge for better performance
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

async function triggerScraper() {
    try {
        // Scrape all data
        console.log('Starting scraping cycle...');
        
        // Driver Standings
        console.log('Scraping driver standings...');
        const driverStandings = await scrapeDriverStandings();
        await put('driver-standings.json', JSON.stringify(driverStandings), {
            access: 'public',
            addRandomSuffix: false
        });
        
        // Team Standings
        console.log('Scraping team standings...');
        const teamStandings = await scrapeTeamStandings();
        await put('team-standings.json', JSON.stringify(teamStandings), {
            access: 'public',
            addRandomSuffix: false
        });
        
        // Calendar
        console.log('Scraping calendar...');
        const calendar = await scrapeCalendar();
        await put('calendar.json', JSON.stringify(calendar), {
            access: 'public',
            addRandomSuffix: false
        });
        
        // Teams and Drivers
        console.log('Scraping teams and drivers...');
        const teamsAndDrivers = await scrapeTeamsAndDrivers();
        await put('teams-and-drivers.json', JSON.stringify(teamsAndDrivers), {
            access: 'public',
            addRandomSuffix: false
        });

        return { success: true, message: 'All data scraped and saved successfully' };
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