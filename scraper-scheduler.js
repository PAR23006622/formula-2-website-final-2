const fs = require('fs');
const path = require('path');
const { setTimeout } = require('timers/promises');
const { scrapeDriverStandings } = require('./api/driver-standings');
const { scrapeTeamStandings } = require('./api/team-standings');
const { scrapeTeamsAndDrivers } = require('./api/teams-and-drivers');
const { scrapeCalendar } = require('./api/calendar');

const resultsDir = path.join(process.cwd(), 'results');

// Ensure results directory exists
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

async function saveData(filename, data) {
    try {
        await fs.promises.writeFile(
            path.join(resultsDir, filename),
            JSON.stringify(data, null, 2)
        );
        console.log(`✓ ${filename} saved successfully`);
    } catch (error) {
        console.error(`✗ Error saving ${filename}:`, error);
        throw error;
    }
}

async function runScrapers() {
    const startTime = new Date();
    console.log('Starting scraping cycle:', startTime.toISOString());

    try {
        // Scrape driver standings
        console.log('Scraping driver standings...');
        const driverStandings = await scrapeDriverStandings();
        await saveData('driver-standings.json', driverStandings);
        await setTimeout(2000); // Add delay between scrapes

        // Scrape team standings
        console.log('Scraping team standings...');
        const teamStandings = await scrapeTeamStandings();
        await saveData('team-standings.json', teamStandings);
        await setTimeout(2000);

        // Scrape calendar
        console.log('Scraping calendar...');
        const calendar = await scrapeCalendar();
        await saveData('calendar.json', calendar);
        await setTimeout(2000);

        // Scrape teams and drivers
        console.log('Scraping teams and drivers...');
        const teamsAndDrivers = await scrapeTeamsAndDrivers();
        await saveData('teams-and-drivers.json', teamsAndDrivers);

        const endTime = new Date();
        const duration = (endTime - startTime) / 1000;
        console.log(`✓ Scraping cycle completed in ${duration}s:`, endTime.toISOString());
    } catch (error) {
        console.error('✗ Error during scraping cycle:', error);
        // Don't throw the error to keep the scheduler running
    }
}

async function startScheduler() {
    console.log('F2 Scraper Service Started:', new Date().toISOString());
    
    // Run immediately on startup
    await runScrapers();

    // Then run every 30 minutes
    while (true) {
        try {
            console.log('Waiting for 30 minutes before next scraping cycle...');
            await setTimeout(30 * 60 * 1000);
            await runScrapers();
        } catch (error) {
            console.error('Error in scheduler loop:', error);
            // Wait 1 minute before retrying if there's an error
            await setTimeout(60 * 1000);
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    process.exit(0);
});

// Start the scheduler
startScheduler().catch(error => {
    console.error('Fatal error in scheduler:', error);
    process.exit(1);
});