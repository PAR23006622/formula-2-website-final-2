import puppeteer, { Page } from 'puppeteer-core';
import { getBrowserInstance } from './driver-standings';

interface Team {
    teamName: string;
    drivers: string[];
}

interface YearData {
    year: number;
    title: string;
    teams: Team[];
}

export async function scrapeTeamsAndDrivers(): Promise<YearData[]> {
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

    const browser = await getBrowserInstance();
    const allData: YearData[] = [];
    let year = 2017;

    for (const url of urls) {
        console.log(`Scraping data for year: ${year} from URL: ${url}`);
        const page = await browser.newPage();

        try {
            await page.goto(url, { 
                waitUntil: 'networkidle2', 
                timeout: 60000 
            });

            const data = year >= 2020 ? await scrape2020Onwards(page) : await scrapeBefore2020(page);
            allData.push({ year, ...data });
        } catch (error) {
            console.error(`Failed to load URL for year ${year}:`, error);
        } finally {
            await page.close();
        }

        year++;
    }

    await browser.close();
    return allData;
}

async function scrapeBefore2020(page: Page) {
    return page.evaluate(() => {
        const yearElement = document.querySelector('.c') as HTMLElement;
        const year = yearElement ? yearElement.innerText.match(/\d{4}/) : null;
        const title = year ? `Teams & Drivers Formula 2 ${year[0]}` : 'Teams & Drivers Formula 2';

        const teamElements = document.querySelectorAll('.team-drivers');
        const teams = Array.from(teamElements).map(teamElement => {
            const teamNameElement = (teamElement.querySelector('.name') || teamElement.querySelector('.brand-link')) as HTMLElement | null;
            const teamName = teamNameElement ? teamNameElement.innerText.trim() : 'Unknown Team';
            
            const driverElements = teamElement.querySelectorAll('.caption .name');
            const drivers = Array.from(driverElements).map(driverElement => {
                const driver = driverElement as HTMLElement;
                return driver ? driver.innerText.trim() : 'Unknown Driver';
            });

            return { teamName, drivers };
        });

        const filteredTeams = teams.filter(team => team.teamName !== 'Unknown Team');

        return { title, teams: filteredTeams };
    });
}

async function scrape2020Onwards(page: Page) {
    return page.evaluate(() => {
        const yearElement = document.querySelector('.c') as HTMLElement;
        const year = yearElement ? yearElement.innerText.match(/\d{4}/) : null;
        const title = year ? `Teams & Drivers Formula 2 ${year[0]}` : 'Teams & Drivers Formula 2';

        const teamElements = document.querySelectorAll('.wrapper');
        const teams = Array.from(teamElements).map(teamElement => {
            const teamNameElement = teamElement.querySelector('.brand-link') as HTMLElement | null;
            const teamName = teamNameElement ? teamNameElement.innerText.trim() : 'Unknown Team';
            
            const driverElements = teamElement.querySelectorAll('.name-wrapper.has-link .name');
            const drivers = Array.from(driverElements).map(driverElement => {
                const driver = driverElement as HTMLElement;
                return driver ? driver.innerText.trim() : 'Unknown Driver';
            });

            return { teamName, drivers };
        });

        const filteredTeams = teams.filter(team => team.teamName !== 'Unknown Team');

        return { title, teams: filteredTeams };
    });
}