import { NextResponse } from 'next/server';
import { addIQScore } from '../../../../contentful/add-iq-scores';

export async function POST(request) {
    try {
        console.log('Received score save request');

        // Parse request body to get score data
        const scoreData = await request.json();

        console.log('Score data received:', JSON.stringify(scoreData, null, 2));

        // Validate required fields
        if (!scoreData.playerName || scoreData.score === undefined || !scoreData.level) {
            console.warn('Missing required fields in score data');
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Add IP address if available (for anti-cheat measures)
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';
        scoreData.playerIp = ip;

        // Add timestamp if not provided
        if (!scoreData.date) {
            scoreData.date = new Date().toISOString();
        }

        // Save score to Contentful
        console.log('Attempting to save score to Contentful');
        const result = await addIQScore(scoreData);

        if (result.success) {
            console.log('Score saved successfully to Contentful');
            return NextResponse.json({ success: true, message: 'Score saved successfully' });
        } else {
            console.error('Failed to save score to Contentful:', result.error);
            // Still return success if it saved locally but failed on Contentful
            // This prevents disrupting the user experience
            return NextResponse.json(
                { success: true, warning: 'Score saved locally but not to global leaderboard' },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error in save-score API route:', error);
        // Return a user-friendly error
        return NextResponse.json(
            { success: false, error: 'Server error', message: 'Your score was saved locally' },
            { status: 500 }
        );
    }
} 