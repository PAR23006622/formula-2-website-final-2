const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function getBrowserInstance() {
    return await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });
}

async function scrapeTeamStandings() {
    let browser;
    try {
        browser = await getBrowserInstance();
        console.log('Browser instance created successfully');
        
        const page = await browser.newPage();
        console.log('New page created');

        await page.goto('https://www.fiaformula2.com/Standings/Team', {
            waitUntil: 'networkidle0',
            timeout: 60000
        });
        console.log('Page loaded successfully');

        // Wait for the content to load
        await page.waitForSelector('.table.table-bordered', { timeout: 60000 });
        console.log('Content loaded successfully');

        const standingsData = await page.evaluate(() => {
            const rows = document.querySelectorAll('.table.table-bordered tbody tr');
            const data = [];

            rows.forEach(row => {
                const teamName = row.querySelector('.visible-desktop-up')?.innerText.trim();
                const totalPoints = row.querySelector('.total-points')?.innerText.trim();
                const scores = row.querySelectorAll('.score');
                const sprintRaceScores = [];
                const featureRaceScores = [];

                scores.forEach((score, index) => {
                    let scoreText = score.innerText.trim();
                    if (scoreText === '-') scoreText = '0';
                    if (index % 2 === 0) {
                        sprintRaceScores.push(parseInt(scoreText) || 0);
                    } else {
                        featureRaceScores.push(parseInt(scoreText) || 0);
                    }
                });

                if (teamName) {
                    data.push({
                        teamName,
                        totalPoints,
                        sprintRaceScores,
                        featureRaceScores,
                        position: data.length + 1
                    });
                }
            });

            return {
                title: "2024 Team Standings",
                standings: data
            };
        });

        console.log('Data extracted successfully');

        // Save the data to file
        const filePath = path.join(process.cwd(), 'results', 'team-standings.json');
        const currentData = await fs.readFile(filePath, 'utf8')
            .then(data => JSON.parse(data))
            .catch(() => []);

        // Update or add 2024 data
        const newData = [{ year: 2024, ...standingsData }];
        await fs.writeFile(filePath, JSON.stringify(newData, null, 2));
        console.log('Data saved to file successfully');

        await page.close();
        return newData;
    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser closed');
        }
    }
}

module.exports = { scrapeTeamStandings };