const fs = require('fs');
const path = require('path');
const { setTimeout } = require('timers/promises');
const { scrapeDriverStandings } = require('../api/driver-standings');
const { scrapeTeamStandings } = require('../api/team-standings');
const { scrapeTeamsAndDrivers } = require('../api/teams-and-drivers');
const { scrapeCalendar } = require('../api/calendar');

const resultsDir = path.join(__dirname, '..', 'results');

// Create results directory if it doesn't exist
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
    console.log('📁 Results directory created');
}

async function runScraper(name, scraperFn, fileName) {
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
    const duration = (endTime - startTime) / 1000;
    console.log(`\n✨ Scraping cycle completed in ${duration.toFixed(1)} seconds`);
    console.log(`📅 Next update will start at ${new Date(endTime.getTime() + 30 * 60 * 1000).toLocaleTimeString()}\n`);
}

async function startBackgroundService() {
    console.log('🚀 Starting F2 Data Scraper Background Service');
    console.log('⏰ Service will run every 30 minutes');
    
    // Run immediately on startup
    await runScrapers();
    
    // Set up the interval for subsequent runs
    setInterval(async () => {
        try {
            await runScrapers();
        } catch (error) {
            console.error('❌ Error in scraper service:', error);
        }
    }, 30 * 60 * 1000); // Run every 30 minutes
}

// Start the background service
startBackgroundService(); 