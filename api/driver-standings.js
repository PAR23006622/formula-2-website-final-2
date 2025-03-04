const puppeteer = require('puppeteer');

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

async function scrapeDriverStandings() {
    let browser;
    try {
        browser = await getBrowserInstance();
        console.log('Browser instance created successfully');
        
        const page = await browser.newPage();
        console.log('New page created');

        await page.goto('https://www.fiaformula2.com/Standings/Driver', {
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
                const driverName = row.querySelector('.visible-desktop-up')?.innerText.trim();
                const totalPoints = row.querySelector('.total-points')?.innerText.trim();
                const scores = row.querySelectorAll('.score');
                const sprintRaceScores = [];
                const featureRaceScores = [];

                scores.forEach((score, index) => {
                    let scoreText = score.innerText.trim();
                    if (scoreText === '-') scoreText = '0';
                    if (index % 2 === 0) {
                        sprintRaceScores.push(scoreText);
                    } else {
                        featureRaceScores.push(scoreText);
                    }
                });

                if (driverName) {
                    data.push({
                        driverName,
                        totalPoints,
                        sprintRaceScores,
                        featureRaceScores
                    });
                }
            });

            return {
                title: "2024 Driver Standings",
                standings: data
            };
        });

        console.log('Data extracted successfully:', standingsData);
        await page.close();
        return [{ year: 2024, ...standingsData }];
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

module.exports = { scrapeDriverStandings };