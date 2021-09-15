const express = require(`express`);
const app = express();
const port = 3000;

app.get(`/`, (req, res) => {
    const data = {
        id : `123`,
        name : `fvjvfdkj`,
        supp : false
    }
    res.json(data)
    // res.send(`Hello World ! 😊`)
})

app.get(`/route1`, (req, res) => {
    const {id, name, supp} = req.query;
    res.send(`${name} has an id of ${id} is ${supp}`)
})

app.listen(port, ()=>{
    console.log(`spotify-analytics app listening at http://localhost:${port}`)
});