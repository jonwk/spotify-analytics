import logo from "./logo.svg";

import { useState, useEffect } from "react";
import { access_token, logout } from "./spotify";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(access_token);
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
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
