import { scrapeDriverStandings } from './app/api/driver-standings.js';
import { scrapeTeamStandings } from './app/api/team-standings.js';
import { scrapeTeamsAndDrivers } from './app/api/teams-and-drivers.js';
import { scrapeCalendar } from './app/api/calendar.js';

async function runScrapers() {
    try {
        console.log('Running Driver Standings Scraper...');
        const driverStandings = await scrapeDriverStandings();
        console.log('Driver Standings:', driverStandings);

        console.log('Running Team Standings Scraper...');
        const teamStandings = await scrapeTeamStandings();
        console.log('Team Standings:', teamStandings);

        console.log('Running Calendar Scraper...');
        const calendar = await scrapeCalendar();
        console.log('Calendar:', calendar);

        console.log('Running Teams and Drivers Scraper...');
        const teamsAndDrivers = await scrapeTeamsAndDrivers();
        console.log('Teams and Drivers:', teamsAndDrivers);

        console.log('All scrapers completed successfully!');
        process.exit(0); // Exit successfully

    } catch (error) {
        console.error('Error running scrapers:', error);
        process.exit(1); // Exit with error
    }
}

runScrapers().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
