require(`dotenv`).config();
// console.log(process.env.CLIENT_ID)
// console.log(process.env.CLIENT_SECRET)
console.log(process.env.REDIRECT_URI);

const express = require(`express`);
const app = express();
const port = 3000;

const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

const querystring = require("querystring");
// const qstr = require("URLSearchParams");

app.get(`/`, (req, res) => {
  const data = {
    id: `4333`,
    name: `fvvfdkj`,
    supp: true,
  };
  res.json(data);
  // res.send(`Hello World ! 😊`)
});

// app.get(`/route1`, (req, res) => {
//     const {id, name, supp} = req.query;
//     res.send(`${name} has an id of ${id} is ${supp}`)
// })

app.get(`/login`, (req, res) => {
  // const queryParams = querystring.stringify(client_id: CLIENT_ID,response_type:'code',redirect_uri:REDIRECT_URI)
  const response_type = "code";
  const paramsObj = {
    response_type: response_type,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
  };

  const searchParams = new URLSearchParams(paramsObj);
  console.log(searchParams.toString());
//   console.log(`?response_type=${response_type}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`)
//   console.log
  //   var scopes = "user-read-private user-read-email";
  //   res.redirect(
  //     "https://accounts.spotify.com/authorize" +
  //       "?response_type=code" +
  //       "&client_id=" +
  //       my_client_id +
  //       (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
  //       "&redirect_uri=" +
  //       encodeURIComponent(redirect_uri)
  //   );
  res.redirect(
    `https://accounts.spotify.com/authorize?${searchParams}`
  );
  res.send(`Log in to Spotify`);
});

app.listen(port, () => {
  console.log(`spotify-analytics app listening at http://localhost:${port}`);
});
