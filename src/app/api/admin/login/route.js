import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();
  
  if (username !== process.env.ADMIN_USERNAME || 
      password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  response.cookies.set({
    name: 'admin_session',
    value: 'true',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response;
}
