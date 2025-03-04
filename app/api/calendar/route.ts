import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const calendarPath = path.join(process.cwd(), 'results', 'calendar.json');
    const calendarData = JSON.parse(fs.readFileSync(calendarPath, 'utf-8'));
    return NextResponse.json(calendarData);
  } catch (error) {
    console.error('Error reading calendar data:', error);
    return NextResponse.json({ error: 'Failed to load calendar data' }, { status: 500 });
  }
}