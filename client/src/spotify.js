import axios from 'axios'

// localStorage keys
const LOCALSTORAGE_KEYS = {
  access_token: 'spotify_access_token',
  refresh_token: 'spotify_refresh_token',
  expire_time: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
}

// localStorage values
const LOCALSTORAGE_VALUES = {
  access_token: globalThis.localStorage.getItem(LOCALSTORAGE_KEYS.access_token),
  refresh_token: globalThis.localStorage.getItem(LOCALSTORAGE_KEYS.refresh_token),
  expire_time: globalThis.localStorage.getItem(LOCALSTORAGE_KEYS.expire_time),
  timestamp: globalThis.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
}

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
const hasTokenExpired = () => {
  const { access_token, timestamp, expire_time } = LOCALSTORAGE_VALUES
  if (!access_token || !timestamp) {
    return false
  }
  const millisecondsElapsed = Date.now() - Number(timestamp)
  return millisecondsElapsed / 1000 > Number(expire_time)
}

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refresh_token ||
      LOCALSTORAGE_VALUES.refresh_token === 'undefined' ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error('No refresh token available')
      logout()
    }

    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refresh_token}`
    )

    // Update localStorage values
    globalThis.localStorage.setItem(
      LOCALSTORAGE_KEYS.access_token,
      data.access_token
    )
    globalThis.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())

    // Reload the page for localStorage updates to be reflected
    globalThis.location.reload()
  } catch (error) {
    console.error(error)
  }
}

const getCookie = (name) => {
  const cookies = document.cookie
  if (cookies.split(';').length > 0) {
    const result = cookies.split(';').find((cookie) => cookie.includes(name))
    if (result) {
      return result.trim().split('=')[1]
    }
  }
  return
}

const clearCookie = (name) => {
  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

const getAccessToken = () => {
  const queryString = globalThis.location.search
  const urlParameters = new URLSearchParams(queryString)

  const queryParameters = {
    [LOCALSTORAGE_KEYS.access_token]: getCookie('access_token'),
    [LOCALSTORAGE_KEYS.refresh_token]: getCookie('refresh_token'),
    [LOCALSTORAGE_KEYS.expire_time]: getCookie('expire_time'),
  }
  console.log('getAccessToken', queryParameters)

  const hasError = urlParameters.get('error')

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.access_token === 'undefined'
  ) {
    refreshToken()
  }

  // If there is a valid access token in localStorage, use that
  if (
    LOCALSTORAGE_VALUES.access_token &&
    LOCALSTORAGE_VALUES.access_token !== 'undefined'
  ) {
    return LOCALSTORAGE_VALUES.access_token
  }

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParameters[LOCALSTORAGE_KEYS.access_token]) {
    // Store the query params in localStorage
    for (const property in queryParameters) {
      globalThis.localStorage.setItem(property, queryParameters[property])
    }
    // Set timestamp
    globalThis.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())
    // Return access token from query params
    return queryParameters[LOCALSTORAGE_KEYS.access_token]
  }
  // We should never get here!
  return false
}

export const access_token = getAccessToken()

/**
 * Axios global request headers
 * https://github.com/axios/axios#global-axios-defaults
 */
axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${access_token}`
axios.defaults.headers['Content-Type'] = 'application/json'

/**
 * Get current User's Profile
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-current-users-profile
 *  @returns {Promise}
 */
export const getCurrentUserProfile = () => axios.get('/me')

/**
* Get a List of Current User's Playlists
* https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-a-list-of-current-users-playlists
* @returns {Promise}
*/
export const getCurrentUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`)
}

/**
 * Get a User's Top Artists and Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getCurrentUserTopArtists = (time_range = 'short_term') => {
  return axios.get(`/me/top/artists?time_range=${time_range}`)
}

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (last 4 weeks) 'medium_term' (last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Defaults to 'short_term'
 * @returns {Promise}
 */
export const getCurrentUserTopTracks = (time_range = 'short_term') => {
  return axios.get(`/me/top/tracks?time_range=${time_range}`)
}

/**
 * Get a Playlist
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-playlist
 * @param {string} playlist_id - The Spotify ID for the playlist.
 * @returns {Promise}
 */
export const getPlaylistById = (playlist_id) => {
  return axios.get(`/playlists/${playlist_id}`)
}

/**
 * Get Current User's Recently Played Tracks
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
 */

export const getRecentlyPlayed = () => axios.get('/me/player/recently-played')

/**
 * Clear out all localStorage items we've set and reload the page
 * @returns {void}
 */
export const logout = () => {
  // Clear all localStorage items
  console.log('LOCALSTORAGE_KEYS', LOCALSTORAGE_KEYS)
  for (const property in LOCALSTORAGE_KEYS) {
    globalThis.localStorage.removeItem(LOCALSTORAGE_KEYS[property])
    clearCookie(property)
  }
  console.log('globalThis.location', globalThis.location)
  // Navigate to homepage
  globalThis.location = globalThis.location.origin
}
