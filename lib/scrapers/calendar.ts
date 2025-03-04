import puppeteer from 'puppeteer-core';
import { getBrowserInstance } from './driver-standings';

interface Race {
    startDate: string;
    endDate: string;
    month: string;
    location: string;
}

interface YearData {
    title: string;
    races: Race[];
}

interface CalendarData {
    [key: number]: YearData;
}

export async function scrapeCalendar() {
    const allRaces: CalendarData = {};
    const browser = await getBrowserInstance();
    let seasonId = 174; // Start with 2017 season ID
    let year = 2017;
    let dataFound = true;

    while (dataFound) {
        console.log(`Fetching data for seasonId: ${seasonId}`);
        const page = await browser.newPage();
        const url = `https://www.fiaformula2.com/Calendar?seasonid=${seasonId}`;
        await page.goto(url, { 
            waitUntil: 'networkidle2', 
            timeout: 60000 
        });

        try {
            await page.waitForSelector('.result-card.post-race-wrapper', { timeout: 60000 });

            const races = await page.evaluate(() => {
                const titleElement = document.querySelector('.col-xl-6') as HTMLElement;
                const title = titleElement ? titleElement.innerText.trim() : 'No Title Found';

                const containers = document.querySelectorAll('.result-card.post-race-wrapper');
                const racesData = Array.from(containers).map(container => {
                    const dateElement = container.querySelector('.date');
                    const startDateEl = dateElement?.querySelector('.start-date') as HTMLElement;
                    const endDateEl = dateElement?.querySelector('.end-date') as HTMLElement;
                    const monthEl = container.querySelector('.month') as HTMLElement;
                    const locationEl = container.querySelector('.event-place') as HTMLElement;

                    const startDate = startDateEl ? startDateEl.innerText.trim() : '';
                    const endDate = endDateEl ? endDateEl.innerText.trim() : '';
                    const month = monthEl ? monthEl.innerText.trim() : '';
                    const location = locationEl ? locationEl.innerText.trim() : '';

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

    await browser.close();
    return allRaces;
}