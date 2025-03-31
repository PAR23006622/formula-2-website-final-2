import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import fs from 'fs/promises';
import path from 'path';

export const dynamic = "force-dynamic";

let browser;

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

async function saveToFile(data) {
    try {
        const resultsDir = path.join(process.cwd(), 'results');
        await fs.mkdir(resultsDir, { recursive: true });
        
        const filePath = path.join(resultsDir, 'calendar.json');
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log('Calendar data saved to file:', filePath);
    } catch (error) {
        console.error('Error saving to file:', error);
    }
}

async function getBrowser() {
    if (browser) return browser;

    if (process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production") {
        browser = await puppeteerCore.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(remoteExecutablePath),
            headless: true,
        });
    } else {
        browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true,
        });
    }
    return browser;
}

async function scrapeCalendar() {
    // Skip during build time
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        console.log('Skipping calendar scraper during build phase');
        return { 2023: { title: "Mock Calendar", races: [] } };
    }

    const allRaces = {};
    let browser;
    let seasonId = 174;
    let year = 2017;
    let dataFound = true;

    try {
        browser = await getBrowser();

        while (dataFound && seasonId <= 183) { // Add upper limit for seasonId
            console.log(`Fetching calendar data for seasonId: ${seasonId}`);
            const page = await browser.newPage();
            
            try {
                const response = await page.goto(`https://www.fiaformula2.com/Calendar?seasonid=${seasonId}`, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                });

                if (!response || response.status() !== 200) {
                    console.log(`Failed to load calendar page for seasonId: ${seasonId}`);
                    dataFound = false;
                    await page.close();
                    continue;
                }

                try {
                    await page.waitForSelector('.result-card.post-race-wrapper', { timeout: 30000 });
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

                    if (races.races.length > 0) {
                        allRaces[year] = races;
                    } else {
                        console.log(`No races found for year ${year}`);
                        dataFound = false;
                    }

                } catch (error) {
                    console.log(`No calendar data found for seasonId: ${seasonId}`);
                    dataFound = false;
                }

                await page.close();
                year++;
                seasonId++;

            } catch (error) {
                console.error(`Error processing seasonId ${seasonId}:`, error);
                await page.close();
                dataFound = false;
            }
        }

        // Save data to file
        await saveToFile(allRaces);
        console.log('Calendar data saved successfully');

    } catch (error) {
        console.error('Error during calendar scraping:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser closed');
        }
    }

    return allRaces;
}

export async function GET(request) {
    try {
        const calendar = await scrapeCalendar();
        return new Response(JSON.stringify(calendar), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error scraping calendar:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to scrape calendar' }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export { scrapeCalendar };