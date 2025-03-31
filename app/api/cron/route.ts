import { scrapeDriverStandings } from '../driver-standings';
import { scrapeTeamStandings } from '../team-standings';
import { scrapeTeamsAndDrivers } from '../teams-and-drivers';
import { scrapeCalendar } from '../calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute

export async function GET(request: Request) {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        console.log('Starting scheduled data update...');

        // Run scrapers sequentially
        console.log('Running Driver Standings Scraper...');
        await scrapeDriverStandings();

        console.log('Running Team Standings Scraper...');
        await scrapeTeamStandings();

        console.log('Running Calendar Scraper...');
        await scrapeCalendar();

        console.log('Running Teams and Drivers Scraper...');
        await scrapeTeamsAndDrivers();

        console.log('All scrapers completed successfully!');

        return new Response(JSON.stringify({
            success: true,
            message: 'All scrapers completed successfully'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error running scrapers:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to run scrapers'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
