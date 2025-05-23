import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { location } = await request.json();

        if (!location) {
            return NextResponse.json(
                { error: 'Location is required' },
                { status: 400 }
            );
        }

        const result = {
            condition: 'Cold',
            temperature: 20,
            location
        };
        
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in weather tool:', error);
        return NextResponse.json(
            { error: 'Failed to get weather data' },
            { status: 500 }
        );
    }
} 