// Debug page to print env variables at runtime (client and server)
'use client';

export default function DebugEnv() {
  return (
    <div style={{ padding: 24, fontFamily: 'monospace', background: '#f6f6f6', minHeight: '100vh' }}>
      <h1>Environment Variables Debug</h1>
      <div><strong>NEXT_PUBLIC_CONTENTFUL_SPACE_ID:</strong> {process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 'undefined'}</div>
      <div><strong>NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN:</strong> {process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ? 'set' : 'undefined'}</div>
      <div><strong>CONTENTFUL_SPACE_ID:</strong> {process.env.CONTENTFUL_SPACE_ID || 'undefined'}</div>
      <div><strong>CONTENTFUL_ACCESS_TOKEN:</strong> {process.env.CONTENTFUL_ACCESS_TOKEN ? 'set' : 'undefined'}</div>
      <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
      <div><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'undefined'}</div>
      <div><strong>Other known vars:</strong></div>
      <div>GOOGLE_ID: {process.env.GOOGLE_ID ? 'set' : 'undefined'}</div>
      <div>GH_CLIENT_ID: {process.env.GH_CLIENT_ID ? 'set' : 'undefined'}</div>
      <div>REDDIT_CLIENT_ID: {process.env.REDDIT_CLIENT_ID ? 'set' : 'undefined'}</div>
      <p style={{marginTop: 24, color: '#b00'}}>If any of the above are 'undefined', your build/deploy is NOT picking them up.<br/>Check Netlify env vars, clear cache, and redeploy.</p>
    </div>
  );
}
