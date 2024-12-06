import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

export async function POST(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    NextResponse.redirect(`${FRONTEND_URI}?error=missing_code`);
    return;
  }

  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: data.toString(),
    });

    if (response.ok) {
      const { access_token, refresh_token, expires_in } = await response.json();
      const query = new URLSearchParams({
        access_token,
        refresh_token,
        expires_in: expires_in.toString(),
      });
      return NextResponse.redirect(`${FRONTEND_URI}?${query}`);
    } else {
      return NextResponse.redirect(`${FRONTEND_URI}?error=invalid_token`);
    }
  } catch (error) {
    console.log('error', error)
    NextResponse.redirect(`${FRONTEND_URI}?error=invalid_token`);
    return;
  }
}

