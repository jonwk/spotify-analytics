import logo from "./logo.svg";
import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const queryString = window.location.search;
    // window.loca tion.search - everyting after localhost:port/

    const urlParams = new URLSearchParams(queryString);
    const access_token = urlParams.get("access_token");
    const refresh_token = urlParams.get("refresh_token");

    // return () => {
    //   cleanup
    // }

    if (refresh_token) {
      fetch(`/refresh_token?refresh_token=${refresh_token}`)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="http://localhost:8888/login">
          Log in to Spotify
        </a>
      </header>
    </div>
  );
}

export default App;
