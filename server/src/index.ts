import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { serveStatic } from 'hono/bun'
import { Buffer } from 'buffer'
import { URLSearchParams } from 'url'
import { resolve } from "path"
import 'dotenv/config'

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  FRONTEND_URI: process.env.FRONTEND_URI,
  PORT: parseInt(process.env.PORT || '8888', 10),
}

if (!config.CLIENT_ID || !config.CLIENT_SECRET || !config.REDIRECT_URI || !config.FRONTEND_URI) {
  throw new Error('Missing required environment variables.')
}

const app = new Hono()

app.use('/static/*', serveStatic({ root: '../../client/build' }))

// Helper function to generate random string for state
function generateState(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('')
}

const stateKey = 'spotify_auth_state'

app.get('/login', (context: any) => {
  const state = generateState(16)
  setCookie(context, stateKey, state)

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-read-recently-played',
    'user-top-read'
  ].join(' ')

  const paramsObj = {
    response_type: 'code',
    client_id: config.CLIENT_ID,
    redirect_uri: config.REDIRECT_URI,
    state: state,
    scope: scope
  }

  const searchParams = new URLSearchParams(paramsObj)
  const redirectUrl = `https://accounts.spotify.com/authorize?${searchParams}`
  return context.redirect(redirectUrl)
})

app.get('/callback', async (context: any) => {
  const code = context.req.query('code') || null

  if (!code) {
    return context.redirect(
      `/?${new URLSearchParams({ error: 'missing_code' }).toString()}`
    )
  }

  const grantType = 'authorization_code'

  const data = new URLSearchParams({
    grant_type: grantType,
    code: code,
    redirect_uri: config.REDIRECT_URI
  }).toString()

  const postUrl = 'https://accounts.spotify.com/api/token'
  const contentType = 'application/x-www-form-urlencoded'
  const authorization = `Basic ${Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64')}`

  try {
    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: authorization
      },
      body: data.toString()
    })

    if (response.ok || response.status === 200) {
      const responseData = await response.json()
      const { access_token, refresh_token, expires_in } = responseData

      const searchParams = new URLSearchParams({
        access_token,
        refresh_token,
        expires_in: expires_in.toString()
      }).toString()

      return context.redirect(`${config.FRONTEND_URI}?${searchParams}`)
    } else {
      return context.redirect(
        `/?${new URLSearchParams({ error: 'invalid_token' }).toString()}`
      )
    }
  } catch (error: any) {
    return context.text(`Error: ${error.message}`, 500)
  }
})

// Catch-all route to serve the React app
app.get('*', async (context: any) => {
  const indexFilePath = resolve('../../client/public', 'index.html')
  try {
    const content = await Bun.file(indexFilePath).text()
    return context.html(content)
  } catch (error: any) {
    return context.text(`Index file not found. Error: ${error.message}`, 404)
  }
})

export default {
  port: config.PORT,
  fetch: app.fetch,
}

console.log(`Hono-Bun app listening at http://localhost:${config.PORT}`)