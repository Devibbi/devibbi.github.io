import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Validate credentials (replace with your actual admin credentials check)
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
      
      // Set admin session cookie
      const cookieOptions = {
        name: 'admin_session',
        value: 'true',
        httpOnly: true,
        secure: false, // Allow non-HTTPS in development
        sameSite: 'lax', // More flexible than 'strict' for local dev
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      };
      cookies().set(cookieOptions);
      console.log('Cookie set with options:', cookieOptions);
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
