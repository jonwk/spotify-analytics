import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { serveStatic } from 'hono/serve-static'
import { Buffer } from 'buffer'
import { readFile } from 'fs/promises'
import path from 'path'
import { URLSearchParams } from 'url'
import 'dotenv/config'

const app = new Hono()

const CLIENT_SECRET = process.env.CLIENT_SECRET
const CLIENT_ID = process.env.CLIENT_ID
const REDIRECT_URI = process.env.REDIRECT_URI
const FRONTEND_URI = process.env.FRONTEND_URI
const PORT = process.env.PORT || 8888

app.get('/', (context) => {
  console.log(`Hono app listening at http://localhost:${PORT}`)
  return context.text(`Hono app listening at http://localhost:${PORT}`)
})

app.use('/static/*', serveStatic({
  root: '../../client/build',
  getContent: async (filePath) => {
    try {
      const absolutePath = path.resolve('../../client/build', filePath)
      const content = await readFile(absolutePath)
      return content
    } catch {
      return null
    }
  }
}))

// Helper function to generate random string for state
function generateState(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('')
}

const stateKey = 'spotify_auth_state'

app.get('/login', (context) => {
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
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope
  }

  const searchParams = new URLSearchParams(paramsObj)
  const redirectUrl = `https://accounts.spotify.com/authorize?${searchParams}`
  return context.redirect(redirectUrl)
})

app.get('/callback', async (context) => {
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
    redirect_uri: REDIRECT_URI
  }).toString()

  const postUrl = 'https://accounts.spotify.com/api/token'
  const contentType = 'application/x-www-form-urlencoded'
  const authorization = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`

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

      return context.redirect(`${FRONTEND_URI}?${searchParams}`)
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
app.get('*', async (context) => {
  const indexFilePath = path.resolve('../../client/build', 'index.html')
  try {
    const content = await readFile(indexFilePath, 'utf-8')
    return context.html(content)
  } catch (error: any) {
    return context.text(`Index file not found. Error: ${error.message}`, 404)
  }
})

serve({
  fetch: app.fetch,
  port: PORT
})
