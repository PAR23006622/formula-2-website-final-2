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

async function scrapeCalendar() {
    const allRaces = {};
    const browser = await getBrowserInstance();
    let seasonId = 174; // Start with 2017 season ID
    let year = 2017;
    let dataFound = true;

    try {
        while (dataFound) {
            console.log(`Fetching data for seasonId: ${seasonId}`);
            const page = await browser.newPage();
            const url = `https://www.fiaformula2.com/Calendar?seasonid=${seasonId}`;
            await page.goto(url, { 
                waitUntil: 'networkidle2', 
                timeout: 6000 
            });

            try {
                await page.waitForSelector('.result-card.post-race-wrapper', { timeout: 60000 });

                const races = await page.evaluate(() => {
                    const titleElement = document.querySelector('.col-xl-6');
                    const title = titleElement ? titleElement.innerText.trim() : 'No Title Found';

                    const containers = document.querySelectorAll('.result-card.post-race-wrapper');
                    const racesData = Array.from(containers).map(container => {
                        const dateElement = container.querySelector('.date');
                        const startDate = dateElement ? dateElement.querySelector('.start-date').innerText.trim() : '';
                        const endDate = dateElement ? dateElement.querySelector('.end-date').innerText.trim() : '';
                        const month = container.querySelector('.month') ? container.querySelector('.month').innerText.trim() : '';
                        const location = container.querySelector('.event-place') ? container.querySelector('.event-place').innerText.trim() : '';
                        return { startDate, endDate, month, location };
                    });

                    return { title, races: racesData };
                });

                allRaces[year] = races;
                await page.close();
                year++;
                seasonId++;
            } catch (error) {
                console.log(`No data found for seasonId: ${seasonId}`);
                dataFound = false;
                await page.close();
            }
        }
    } finally {
        await browser.close();
    }

    return allRaces;
}

module.exports = { scrapeCalendar };