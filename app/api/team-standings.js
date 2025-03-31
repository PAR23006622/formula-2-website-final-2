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
    if (process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === "production") {
        return; // Skip file writing in production
    }

    try {
        const resultsDir = path.join(process.cwd(), 'results');
        await fs.mkdir(resultsDir, { recursive: true });
        
        const filePath = path.join(resultsDir, 'team-standings.json');
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log('Team standings data saved to file:', filePath);
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

async function scrapeTeamStandings() {
    // Skip during build time
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        console.log('Skipping team standings scraper during build phase');
        return [{ year: 2023, title: "Mock Data", standings: [] }];
    }

    const allStandingsData = [];
    const browser = await getBrowser();
    let seasonId = 174;
    let year = 2017;
    let dataFound = true;

    console.log('Starting scrapeTeamStandings...');

    try {
        while (dataFound) {
            console.log(`Fetching data for seasonId: ${seasonId}`);
            const page = await browser.newPage();
            const response = await page.goto(`https://www.fiaformula2.com/Standings/Team?seasonId=${seasonId}`, { 
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            if (!response || response.status() !== 200) {
                console.log(`Failed to load page for seasonId: ${seasonId}`);
                dataFound = false;
                await page.close();
                continue;
            }

            try {
                await page.waitForSelector('.driver-name', { timeout: 30000 });
                const standingsData = await page.evaluate(() => {
                    const titleElement = document.querySelector('.container.standings-header .col-xl-6');
                    const title = titleElement ? titleElement.innerText.trim() : 'No Title Found';
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
                            scoreText = scoreText === '-' ? '0' : scoreText;
                            if (index % 2 === 0) {
                                sprintRaceScores.push(scoreText);
                            } else {
                                featureRaceScores.push(scoreText);
                            }
                        });

                        if (teamName) {
                            data.push({
                                teamName,
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

        // Save data to file
        await saveToFile(allStandingsData);
        console.log('Team standings saved successfully');

    } catch (error) {
        console.error('Error during team standings scraping:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser closed');
        }
    }

    return allStandingsData;
}

export async function GET(request) {
    try {
        const standings = await scrapeTeamStandings();
        return new Response(JSON.stringify(standings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error scraping team standings:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to scrape team standings' }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export { scrapeTeamStandings };