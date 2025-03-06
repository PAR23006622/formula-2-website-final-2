import fs from 'fs';
import path from 'path';
import { setTimeout } from 'timers/promises';
import { scrapeDriverStandings } from '@/api/driver-standings';
import { scrapeTeamStandings } from '@/api/team-standings';
import { scrapeTeamsAndDrivers } from '@/api/teams-and-drivers';
import { scrapeCalendar } from '@/api/calendar';

const resultsDir = path.join(process.cwd(), 'results');

// Create results directory if it doesn't exist
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
    console.log('📁 Results directory created');
}

async function runScraper(name: string, scraperFn: () => Promise<any>, fileName: string) {
    console.log(`\n🔄 Starting ${name} scraper...`);
    try {
        const data = await scraperFn();
        fs.writeFileSync(
            path.join(resultsDir, fileName),
            JSON.stringify(data, null, 2)
        );
        console.log(`✅ ${name} completed and saved successfully`);
        return true;
    } catch (error) {
        console.error(`❌ Error in ${name} scraper:`, error);
        return false;
    }
}

async function runScrapers() {
    const startTime = new Date();
    console.log(`\n📊 Starting scraping cycle at ${startTime.toLocaleTimeString()}`);
    
    // Run scrapers sequentially
    const scrapers = [
        {
            name: 'Driver Standings',
            fn: scrapeDriverStandings,
            file: 'driver-standings.json'
        },
        {
            name: 'Team Standings',
            fn: scrapeTeamStandings,
            file: 'team-standings.json'
        },
        {
            name: 'Calendar',
            fn: scrapeCalendar,
            file: 'calendar.json'
        },
        {
            name: 'Teams and Drivers',
            fn: scrapeTeamsAndDrivers,
            file: 'teams-and-drivers.json'
        }
    ];

    for (const scraper of scrapers) {
        await runScraper(scraper.name, scraper.fn, scraper.file);
        // Add a small delay between scrapers to prevent rate limiting
        await setTimeout(2000);
    }

    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;
    console.log(`\n✨ Scraping cycle completed in ${duration.toFixed(1)} seconds`);
    console.log(`📅 Next update will start at ${new Date(endTime.getTime() + 30 * 60 * 1000).toLocaleTimeString()}\n`);
}

export async function startScheduler() {
    console.log('🚀 Starting F2 Data Scraper Scheduler');
    console.log('⏰ Updates will run every 30 minutes');
    
    while (true) {
        try {
            await runScrapers();
            console.log('⏳ Waiting for next update cycle...');
            await setTimeout(30 * 60 * 1000); // Wait for 30 minutes
        } catch (error) {
            console.error('❌ Error in scheduler:', error);
            // Wait 1 minute before retrying if there's an error
            await setTimeout(60 * 1000);
        }
    }
} 