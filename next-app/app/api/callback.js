import { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    res.redirect(`/?error=missing_code`);
    return;
  }

  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

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

    res.redirect(`${FRONTEND_URI}?${query}`);
  } else {
    res.redirect(`/?error=invalid_token`);
  }
}
