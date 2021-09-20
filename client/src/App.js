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

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(access_token);

    const fetchData = async () => {
      console.log(`fetching data`);
      const { data } = await getCurrentUserProfile();
      console.log(`data: \n ${JSON.stringify(data)}`);
      setProfile(data);
      console.log(`finished fetching data`);
    };

    catchErrors(fetchData());
  }, []);

  // Replacing with react router

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8888/login">
            Log in to Spotify
          </a>
        ) : (
          <Router>
            <ScrollToTop />

            <Switch>
              <Route path="/top-artists">
                <h1>Top Artists</h1>
              </Route>
              <Route path="/top-tracks">
                <h1>Top Tracks</h1>
              </Route>
              <Route path="/playlists/:id">
                <h1>Playlist</h1>
              </Route>
              <Route path="/playlists">
                <h1>Playlists</h1>
              </Route>
              <Route path="/">
                <div>
                  <button onClick={logout}>Log Out</button>
                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>{profile.email}</p>
                      <p>
                        Profile URL :{" "}
                        <a href={profile.external_urls.spotify}>Link</a>
                      </p>
                      <p>Followers : {profile.followers.total}</p>
                      {profile.images.length && profile.images[0].url && (
                        <p>
                          <img src={profile.images[0].url} alt="profile-pic" />
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Route>
            </Switch>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
