const { scrapeDriverStandings } = require('./api/driver-standings');
const { scrapeTeamStandings } = require('./api/team-standings');

async function runScrapers() {
    try {
        console.log('Starting driver standings scraper...');
        await scrapeDriverStandings();
        console.log('Driver standings scraping completed');

        console.log('Starting team standings scraper...');
        await scrapeTeamStandings();
        console.log('Team standings scraping completed');
    } catch (error) {
        console.error('Error running scrapers:', error);
    }
}

// Run immediately
runScrapers();

// Then run every 30 minutes
setInterval(runScrapers, 30 * 60 * 1000); 