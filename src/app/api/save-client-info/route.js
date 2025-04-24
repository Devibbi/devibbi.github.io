// app/api/save-client-info/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { saveAskBbiLog } from '../../../utils/contentfulAskBbi';

export async function POST(req) {
    try {
        const clientInfo = await req.json();
        if (!clientInfo || typeof clientInfo !== 'object') {
            return NextResponse.json({ error: 'Invalid client information' }, { status: 400 });
        }

        // Required fields validation
        if (!clientInfo.name || !clientInfo.email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // Prepare client info summary for logging
        const clientSummary = `
Name: ${clientInfo.name}
Email: ${clientInfo.email}
Location: ${clientInfo.location || 'Not provided'}
Contact: ${clientInfo.contact || 'Not provided'}
Service Interest: ${clientInfo.service || 'Not provided'}
`.trim();

        // Save to Contentful using the existing log function
        await saveAskBbiLog({
            question: 'New Client Registration',
            answer: clientSummary,
            model: 'system-clientinfo',
            metadata: {
                type: 'client_info',
                name: clientInfo.name,
                email: clientInfo.email,
                location: clientInfo.location || '',
                contact: clientInfo.contact || '',
                service: clientInfo.service || ''
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Error saving client info:', e);
        return NextResponse.json(
            { error: 'Failed to save client information' },
            { status: 500 }
        );
    }
}