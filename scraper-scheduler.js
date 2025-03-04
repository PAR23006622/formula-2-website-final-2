const fs = require('fs');
const path = require('path');
const { setTimeout } = require('timers/promises');
const { scrapeDriverStandings } = require('./api/driver-standings');
const { scrapeTeamStandings } = require('./api/team-standings');
const { scrapeTeamsAndDrivers } = require('./api/teams-and-drivers');
const { scrapeCalendar } = require('./api/calendar');

const resultsDir = path.join(process.cwd(), 'results');

if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

async function runScrapers() {
    try {
        console.log('Running scrapers...');

        const driverStandings = await scrapeDriverStandings();
        fs.writeFileSync(
            path.join(resultsDir, 'driver-standings.json'),
            JSON.stringify(driverStandings, null, 2)
        );
        console.log('Driver standings saved.');

        const teamStandings = await scrapeTeamStandings();
        fs.writeFileSync(
            path.join(resultsDir, 'team-standings.json'),
            JSON.stringify(teamStandings, null, 2)
        );
        console.log('Team standings saved.');

        const calendar = await scrapeCalendar();
        fs.writeFileSync(
            path.join(resultsDir, 'calendar.json'),
            JSON.stringify(calendar, null, 2)
        );
        console.log('Calendar saved.');

        const teamsAndDrivers = await scrapeTeamsAndDrivers();
        fs.writeFileSync(
            path.join(resultsDir, 'teams-and-drivers.json'),
            JSON.stringify(teamsAndDrivers, null, 2)
        );
        console.log('Teams and drivers saved.');

        console.log('All scraping tasks completed successfully.');
    } catch (error) {
        console.error('Error running scrapers:', error);
    }
}

async function startScheduler() {
    while (true) {
        await runScrapers();
        console.log('Waiting for 30 minutes before the next run...');
        await setTimeout(30 * 60 * 1000); // Wait for 30 minutes
    }
}

startScheduler();