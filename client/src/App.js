import { useState, useEffect } from "react";
import { access_token, logout, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./util";

import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(access_token);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      console.log(data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8888/login">
            Log in to Spotify
          </a>
        ) : (
          <div>
            <h1>Logged in !</h1>
            <button onClick={logout}>Log Out</button>

            {profile && (
              <div>
                <h1>{profile.display_name}</h1>
                <p>{profile.email}</p>
                <p>
                  Profile URL : <a href={profile.external_urls.spotify}>Link</a>
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
        )}
      </header>
    </div>
  );
}

export default App;
