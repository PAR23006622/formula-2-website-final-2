import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

async function triggerScraper(name: string) {
    try {
        const response = await fetch(`${process.env.VERCEL_URL}/api/scrape/${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to trigger ${name} scraper`);
        }

        const data = await response.json();
        if (data) {
            // Store the data in Vercel Blob Storage
            const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.json`;
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            await put(filename, blob, { access: 'public' });
            console.log(`✅ ${name} completed and stored successfully`);
        }
        return data;
    } catch (error) {
        console.error(`❌ Error in ${name} scraper:`, error);
        return null;
    }
}

export async function GET() {
    try {
        console.log('📊 Starting scraping cycle');
        const startTime = Date.now();

        // Trigger scrapers sequentially
        const driverStandings = await triggerScraper('driver-standings');
        const teamStandings = await triggerScraper('team-standings');
        const calendar = await triggerScraper('calendar');
        const teamsAndDrivers = await triggerScraper('teams-and-drivers');

        const duration = (Date.now() - startTime) / 1000;
        console.log(`✨ Scraping cycle completed in ${duration.toFixed(1)} seconds`);

        return NextResponse.json({
            success: true,
            duration: `${duration.toFixed(1)}s`,
            timestamp: new Date().toISOString(),
            data: {
                driverStandings,
                teamStandings,
                calendar,
                teamsAndDrivers
            }
        });
    } catch (error) {
        console.error('❌ Error in cron job:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to run scrapers',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}