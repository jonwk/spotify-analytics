import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { access_token, logout, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./util";
import { GlobalStyle } from "./styles";
import { Login, Profile, TopArtists, TopTracks, Playlists, Playlist } from "./pages";
import styled from "styled-components/macro";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
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
`;

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(access_token);
  }, []);

  // Replacing with react router

  return (
    <div className="App">
      <GlobalStyle />

      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <div>
            <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
            <Router>
              <ScrollToTop />

              <Switch>
                <Route path="/top-artists">
                  <TopArtists />
                </Route>
                <Route path="/top-tracks">
                  <TopTracks />
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
        )}
      </header>
    </div>
  );
}

export default App;
