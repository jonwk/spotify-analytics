require(`dotenv`).config();

const express = require(`express`);
const axios = require(`axios`);

const path = require("path");
const app = express();

const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;
const PORT = process.env.PORT || 8888;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.get(`/`, (req, res) => {
  const data = {
    id: `4333`,
    name: `fvvfdkj`,
    supp: true,
  };
  res.json(data);
});

// generates random string for state
function generateState(length) {
  var result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const stateKey = `spotify_auth_state`;

app.get(`/login`, (req, res) => {
  const state = generateState(16);
  res.cookie(stateKey, state);

  const scope = ["user-read-private", "user-read-email", "user-top-read"].join(
    " "
  );

  const response_type = "code";
  const paramsObj = {
    response_type: response_type,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  };

  const searchParams = new URLSearchParams(paramsObj);
  const redirect_url = `https://accounts.spotify.com/authorize?${searchParams}`;
  res.redirect(redirect_url);
});

app.get(`/callback`, (req, res) => {
  const code = req.query.code || null;

  const grant_type = `authorization_code`;

  const data = new URLSearchParams({
    grant_type: grant_type,
    code: code,
    redirect_uri: REDIRECT_URI,
  }).toString();

  const post_url = `https://accounts.spotify.com/api/token`;

  const content_type = `application/x-www-form-urlencoded`;

  const authorization = `Basic ${new Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  ).toString("base64")}`;

  axios({
    method: "post",
    url: post_url,
    data: data,
    headers: {
      "content-type": content_type,
      Authorization: authorization,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;

        const searchParams = new URLSearchParams({
          access_token: access_token,
          refresh_token: refresh_token,
          expires_in: expires_in,
        }).toString();

        // redirect to react app
        res.redirect(`${FRONTEND_URI}?${searchParams}`);
        // pass along tokens in query params
      } else
        res.redirect(
          `/?${new URLSearchParams({ error: "invalid_token" }).toString()}`
        );
    })
    .catch((error) => {
      res.send(error);
    });

  //   res.send(`callback`);
});

// All remaining requests return the React app, so it can handle routing.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`spotify-analytics app listening at http://localhost:${PORT}`);
});
