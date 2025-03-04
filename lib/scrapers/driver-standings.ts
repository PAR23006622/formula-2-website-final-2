import puppeteer from 'puppeteer-core';
import path from 'path';

interface DriverStanding {
    driverName: string;
    totalPoints: string;
    sprintRaceScores: string[];
    featureRaceScores: string[];
}

interface YearData {
    year: number;
    title: string;
    standings: DriverStanding[];
}

export async function getBrowserInstance() {
    return await puppeteer.launch({
        headless: true,
        executablePath: path.join(process.cwd(), 'node_modules', 'chromium', 'lib', 'chromium', 'chrome-linux', 'chrome'),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });
}

export async function scrapeDriverStandings(): Promise<YearData[]> {
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

        await page.waitForSelector('.table.table-bordered', { timeout: 60000 });
        console.log('Content loaded successfully');

        const standingsData = await page.evaluate(() => {
            const rows = document.querySelectorAll('.table.table-bordered tbody tr');
            const data: DriverStanding[] = [];

            rows.forEach(row => {
                const driverNameEl = row.querySelector('.visible-desktop-up') as HTMLElement;
                const totalPointsEl = row.querySelector('.total-points') as HTMLElement;
                const scores = row.querySelectorAll('.score');
                const sprintRaceScores: string[] = [];
                const featureRaceScores: string[] = [];

                scores.forEach((score, index) => {
                    const scoreEl = score as HTMLElement;
                    let scoreText = scoreEl.innerText.trim();
                    if (scoreText === '-') scoreText = '0';
                    if (index % 2 === 0) {
                        sprintRaceScores.push(scoreText);
                    } else {
                        featureRaceScores.push(scoreText);
                    }
                });

                if (driverNameEl) {
                    data.push({
                        driverName: driverNameEl.innerText.trim(),
                        totalPoints: totalPointsEl?.innerText.trim() || '0',
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