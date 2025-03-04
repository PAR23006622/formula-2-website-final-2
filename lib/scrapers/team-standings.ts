import puppeteer from 'puppeteer-core';
import path from 'path';
import { getBrowserInstance } from './driver-standings';

interface TeamStanding {
    teamName: string;
    totalPoints: string;
    sprintRaceScores: string[];
    featureRaceScores: string[];
}

interface YearData {
    year: number;
    title: string;
    standings: TeamStanding[];
}

export async function scrapeTeamStandings(): Promise<YearData[]> {
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

        await page.waitForSelector('.table.table-bordered', { timeout: 60000 });
        console.log('Content loaded successfully');

        const standingsData = await page.evaluate(() => {
            const rows = document.querySelectorAll('.table.table-bordered tbody tr');
            const data: Array<{
                teamName: string;
                totalPoints: string;
                sprintRaceScores: string[];
                featureRaceScores: string[];
            }> = [];

            rows.forEach(row => {
                const teamNameEl = row.querySelector('.visible-desktop-up') as HTMLElement;
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

                if (teamNameEl) {
                    data.push({
                        teamName: teamNameEl.innerText.trim(),
                        totalPoints: totalPointsEl?.innerText.trim() || '0',
                        sprintRaceScores,
                        featureRaceScores
                    });
                }
            });

            return {
                title: "2024 Team Standings",
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