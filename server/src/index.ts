import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { serveStatic } from 'hono/serve-static';
import { URLSearchParams } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';
import { Buffer } from 'buffer';
import path from 'path';
import { readFile } from 'fs/promises';
import { setCookie } from 'hono/cookie'
dotenv.config()

const app = new Hono()

const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;

app.get('/', (context) => {
  const data = {
    id: `4333`,
    name: `fvvfdkj`,
    supp: true,
  }
  return context.json(data)
})

app.use('/static/*', serveStatic({
  root: '../../client/build',
  getContent: async (filePath) => {
    try {
      const absolutePath = path.resolve('../../client/build', filePath);
      const content = await readFile(absolutePath);
      return content;
    } catch {
      return null;
    }
  },
}))

// Helper function to generate random string for state
function generateState(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');
}

const stateKey = 'spotify_auth_state';

app.get('/login', (context) => {
  const state = generateState(16);
  setCookie(context, stateKey, state);

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-read-recently-played',
    'user-top-read',
  ].join(' ');

  const paramsObj = {
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  };

  const searchParams = new URLSearchParams(paramsObj);
  const redirectUrl = `https://accounts.spotify.com/authorize?${searchParams}`;
  return context.redirect(redirectUrl);
});

app.get('/callback', async (context) => {
  const code = context.req.query('code') || null;

  if (!code) {
    return context.redirect(
      `/?${new URLSearchParams({ error: 'missing_code' }).toString()}`
    );
  }

  const grantType = 'authorization_code';
  const data = new URLSearchParams({
    grant_type: grantType,
    code: code,
    redirect_uri: REDIRECT_URI,
  }).toString();

  const postUrl = 'https://accounts.spotify.com/api/token';
  const contentType = 'application/x-www-form-urlencoded';
  const authorization = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;

  try {
    const response = await axios.post(postUrl, data, {
      headers: {
        'Content-Type': contentType,
        Authorization: authorization,
      },
    });

    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;

      const searchParams = new URLSearchParams({
        access_token,
        refresh_token,
        expires_in,
      }).toString();

      return context.redirect(`${FRONTEND_URI}?${searchParams}`);
    } else {
      return context.redirect(
        `/?${new URLSearchParams({ error: 'invalid_token' }).toString()}`
      );
    }
  } catch (error: any) {
    return context.text(`Error: ${error.message}`, 500);
  }
});

// // Catch-all route to serve the React app
// app.get('*', async (context) => {
//   return serveStatic({ root: './client/build', path: 'index.html' })(context);
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Hono Spotify app listening at http://localhost:${PORT}`);
// });

serve({
  fetch: app.fetch,
  port: PORT,
})
