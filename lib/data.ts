import fs from 'fs';
import path from 'path';

const resultsDir = path.join(process.cwd(), 'results');

// Ensure results directory exists
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
}

// Helper function to safely read JSON files
function safeReadJson(filePath: string, defaultValue: any) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
        return defaultValue;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return defaultValue;
    }
}

export function getDriverStandings() {
    return safeReadJson(path.join(resultsDir, 'driver-standings.json'), []);
}

export function getTeamStandings() {
    return safeReadJson(path.join(resultsDir, 'team-standings.json'), []);
}

export function getCalendar() {
    return safeReadJson(path.join(resultsDir, 'calendar.json'), {});
}

export function getTeamsAndDrivers() {
    return safeReadJson(path.join(resultsDir, 'teams-and-drivers.json'), []);
}