import React from 'react'
import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom'
import styled from 'styled-components/macro'

import { Login, Playlist, Playlists, Profile, RecentlyPlayed, TopArtists, TopTracks } from './pages'
import { access_token, logout } from './spotify'
import { GlobalStyle } from './styles'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // eslint-disable-next-line unicorn/no-null
  return null
}

const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`

const App = () => {
  const [token, setToken] = useState()

  useEffect(() => {
    setToken(access_token)
  }, [])

  const handleLogout = () => {
    logout()
    setToken(undefined)
  }

  return (
    <div className="App">
      <GlobalStyle />

      <header className="App-header">
        {token ? (
          <div>
            <StyledLogoutButton onClick={handleLogout}>Log Out</StyledLogoutButton>
            <Router>
              <ScrollToTop />

              <Switch>
                <Route path="/top-artists">
                  <TopArtists />
                </Route>
                <Route path="/top-tracks">
                  <TopTracks />
                </Route>
                <Route path="/recently-played">
                  <RecentlyPlayed />
                </Route>
                <Route path="/playlists/:id">
                  <Playlist />
                </Route>
                <Route path="/playlists">
                  <Playlists />
                </Route>
                <Route path="/">
                  <Profile />
                </Route>
              </Switch>
            </Router>
          </div>
        ) : (
          <Login />
        )}
      </header>
    </div>
  )
}

export default App
