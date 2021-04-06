const express = require('express');
const agg = require('./getData');
const menu = require('./getMenu')
const city = require('./citySuggest')
const locInfo = require('./getLocInfo')
const food = require('./getFoodSuggestion');
const agg2 = require('./fetch');
const zom = require('./zomdets');
const cors = require('cors')

var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use(cors())


app.get('/getFood',async (req,res) => {
    var response = {};
    response.success = true;
    response.data = await agg.getData(req.query)
    res.json(response)
})

app.get('/getFood/v2',async (req,res) => {
    var response = {};
    let date = new Date();
    response.data = await agg.getData(req.query);
    response.success = true;
    res.json(response)
})



app.get('/citySuggest/:q',async (req,res) => {
    var response = {};
    response.success = true;
    response.data = await city.citySuggest(req.params.q)
    res.json(response)
})

app.get('/getMenu', async (req,res) => {
    var response = {};
    response.success = true;
    response["menu"] = await menu.getMenu(req.body.url);
    res.json(response)
})

app.get('/getLocInfo', async (req,res) => {
    var response = {};
    response.success = true;
    response.data = await locInfo.getLocInfo(req.query.lat,req.query.long,req.query.pid)
    res.json(response)
})

app.get('/getFoodSuggestion', async (req,res)=>{
    const response = {};
    response.success = true;
    response.data = await food.getFoodSuggestion(req.query);
    res.json(response)
})

app.get('/getZomDets', async (req,res)=>{
    const response = {};
    response.success = true;
    response.data = await zom.zomdets(req.query.url);
    res.json(response)
})


const PORT = process.env.PORT || 5001;
app.listen(PORT)

console.log("Api running on Heroku")