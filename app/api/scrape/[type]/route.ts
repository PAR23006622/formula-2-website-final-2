import { NextResponse } from 'next/server';
import { scrapeDriverStandings } from '@/api/driver-standings';
import { scrapeTeamStandings } from '@/api/team-standings';
import { scrapeTeamsAndDrivers } from '@/api/teams-and-drivers';
import { scrapeCalendar } from '@/api/calendar';

// Use Node.js runtime instead of Edge
export const runtime = 'nodejs';

export async function POST(
    request: Request,
    { params }: { params: { type: string } }
) {
    try {
        const { type } = params;
        let data;

        switch (type) {
            case 'driver-standings':
                data = await scrapeDriverStandings();
                break;
            case 'team-standings':
                data = await scrapeTeamStandings();
                break;
            case 'calendar':
                data = await scrapeCalendar();
                break;
            case 'teams-and-drivers':
                data = await scrapeTeamsAndDrivers();
                break;
            default:
                return NextResponse.json({ error: 'Invalid scraper type' }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error in ${params.type} scraper:`, error);
        return NextResponse.json({ error: 'Scraping failed' }, { status: 500 });
    }
} 