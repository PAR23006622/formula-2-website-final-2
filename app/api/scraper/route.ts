import { NextResponse } from 'next/server';
import { startScheduler } from '@/lib/scraper-scheduler';

let scraperStarted = false;

export async function GET() {
    if (!scraperStarted) {
        console.log('🚀 Initializing F2 Data Scraper from API route');
        startScheduler();
        scraperStarted = true;
    }
    
    return NextResponse.json({ status: 'Scraper is running' });
} 