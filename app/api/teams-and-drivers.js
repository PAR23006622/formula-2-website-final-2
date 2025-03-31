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
        
        const filePath = path.join(resultsDir, 'teams-and-drivers.json');
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log('Teams and drivers data saved to file:', filePath);
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

async function scrapeTeamsAndDrivers() {
    // Skip during build time
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        console.log('Skipping teams and drivers scraper during build phase');
        return [{ year: 2023, title: "Mock Teams & Drivers", teams: [] }];
    }

    const urls = [
        'https://web.archive.org/web/20171201034903/http://www.fiaformula2.com/Teams-and-Drivers',
        'https://web.archive.org/web/20181109085950/http://www.fiaformula2.com/Teams-and-Drivers',
        'https://web.archive.org/web/20190904102437/http://www.fiaformula2.com/Teams-and-Drivers',
        'https://web.archive.org/web/20201230055450/http://www.fiaformula2.com/Teams-and-Drivers',
        'https://web.archive.org/web/20211203193245/http://www.fiaformula2.com/Teams-and-Drivers',
        'https://web.archive.org/web/20221209121832/http://www.fiaformula2.com/Teams-and-Drivers',
        'https://web.archive.org/web/20231203234515/http://www.fiaformula2.com/Teams-and-Drivers',
        'https://web.archive.org/web/20241203011952/http://www.fiaformula2.com/Teams-and-Drivers',
        'https://www.fiaformula2.com/Teams-and-Drivers'
    ];

    const browser = await getBrowser();
    const allData = [];
    let year = 2017;

    try {
        for (const url of urls) {
            console.log(`Scraping data for year: ${year} from URL: ${url}`);
            const page = await browser.newPage();

            try {
                await page.goto(url, { 
                    waitUntil: 'domcontentloaded', 
                    timeout: 60000
                });

                const data = year >= 2020 ? 
                    await scrape2020Onwards(page) : 
                    await scrapeBefore2020(page);
                
                allData.push({ year, ...data });
            } catch (error) {
                console.error(`Error scraping data for year: ${year} from URL: ${url}`, error);
            }
        }
    } catch (error) {
        console.error('Error scraping teams and drivers data:', error);
    }
}

export { scrapeTeamsAndDrivers};