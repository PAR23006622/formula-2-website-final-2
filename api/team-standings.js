import puppeteer from 'puppeteer';

async function getBrowserInstance() {
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        return await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });
    } else {
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
}

async function scrapeTeamStandings() {
    const allStandingsData = [];
    const browser = await getBrowserInstance();
    let seasonId = 174; // Start with 2017 season ID
    let year = 2017;
    let dataFound = true;

    try {
        while (dataFound) {
            console.log(`Fetching data for seasonId: ${seasonId}`);
            const page = await browser.newPage();
            await page.goto(`https://www.fiaformula2.com/Standings/Team?seasonId=${seasonId}`, { 
                waitUntil: 'networkidle2',
                timeout: 6000
            });

            try {
                await page.waitForSelector('.driver-name', { timeout: 60000 });
                const standingsData = await page.evaluate(() => {
                    const titleElement = document.querySelector('.container.standings-header .col-xl-6');
                    const title = titleElement ? titleElement.innerText.trim() : 'No Title Found';
                    const rows = document.querySelectorAll('.table.table-bordered tbody tr');
                    const data = [];

                    rows.forEach(row => {
                        let teamName = row.querySelector('.visible-desktop-up')?.innerText.trim();
                        const totalPoints = row.querySelector('.total-points')?.innerText.trim();
                        const scores = row.querySelectorAll('.score');
                        const sprintRaceScores = [];
                        const featureRaceScores = [];

                        scores.forEach((score, index) => {
                            let scoreText = score.innerText.trim();
                            if (scoreText === '-') {
                                scoreText = '0';
                            }
                            if (index % 2 === 0) {
                                sprintRaceScores.push(scoreText);
                            } else {
                                featureRaceScores.push(scoreText);
                            }
                        });

                        if (teamName) {
                            data.push({
                                driverName: teamName, // Keep as driverName for compatibility
                                totalPoints,
                                sprintRaceScores,
                                featureRaceScores
                            });
                        }
                    });

                    return { title, standings: data };
                });

                allStandingsData.push({ year, ...standingsData });
                await page.close();
                year++;
                seasonId++;
            } catch (error) {
                console.log(`No data found for seasonId: ${seasonId}`);
                dataFound = false;
                await page.close();
            }
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        await browser.close();
        console.log('Browser closed');
    }

    return allStandingsData;
}

// For API routes
export default async function handler(req, res) {
    try {
        const standings = await scrapeTeamStandings();
        res.status(200).json(standings);
    } catch (error) {
        console.error('Error scraping team standings:', error);
        res.status(500).json({ error: 'Failed to scrape team standings' });
    }
}

// For CommonJS require
export { scrapeTeamStandings };

// Fallback for CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scrapeTeamStandings };
}