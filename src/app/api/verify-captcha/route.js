// app/api/verify-captcha/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 400 });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    body: `secret=${secretKey}&response=${token}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const data = await response.json();
  
  if (data.success && data.score > 0.5) { 
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, message: 'Captcha verification failed' }, { status: 400 });
  }
}