
// index.js is what is used to make API Calls using from the server using node.js
// the app.get('/api') creates an API that the sketch.js pulls directly into the client 

// for FUTURE USE this pulls ALL Stations
// https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json

const express = require('express');
const app = express();
const fetch = require('node-fetch');
const Chart = require('chart.js');
app.listen(3000, () => console.log('listening at localhost:3000'));
app.use(express.static('public'));

app.get('/api/:latlon', async (request, response) => {
    //  getting lat and lon from client page
    console.log(request.params)
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    // console.log({lat, lon});

    // getting grid corridinates for local forecasts
    const api_url = `https://api.weather.gov/points/${lat},${lon}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    const gridId = JSON.stringify(json.properties.gridId);
    const gridX = JSON.stringify(json.properties.gridX);
    const gridY = JSON.stringify(json.properties.gridY);

    // getting local forecasts using the grids pulled from api above 
    const forecast_url =`https://api.weather.gov/gridpoints/CHS/${gridX},${gridY}/forecast`;
    const fore_response = await fetch(forecast_url);
    const fore_json = await fore_response.json(); 
    console.log(fore_json.properties.periods)

    // date variable 
    var date = new Date(); 

    const today_year = date.getFullYear().toString();
    var today_month = (date.getMonth() + 1).toString();
    var today_day = date.getDate().toString();
    var today_hr = date.getHours().toString();
    var today_min = date.getMinutes().toString();

    (today_day.length == 1) && (today_day = '0' + today_day);
    (today_month.length == 1) && (today_month = '0' + today_month);
    (today_hr.length == 1) && (today_hr = '0' + today_hr);
    var today_wTime = today_year + '-' + today_month + '-' + today_day + ' ' + today_hr + ':' + today_min;
    var today = today_year + today_month + today_day;

    // future date formatted
    var future_date = date.getDate() + 0;
    var future_year = date.getFullYear().toString();
    var future_month = (date.getMonth() + 1).toString();
    var future_day = future_date.toString();
    (future_day.length == 1) && (future_day = '0' + future_day);
    (future_month.length == 1) && (future_month = '0' + future_month);
    var future = future_year + future_month + future_day;
    // console.log(`Future Date: ${future}`)

    // tide predictions multiple days
    const xs = [];
    const ys = [];
    const tide_url =`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${today}&end_date=${future}&station=8665530&product=predictions&datum=MLW&time_zone=lst_ldt&units=english&format=json`;
    const tide_response = await fetch(tide_url);
    const tide_json = await tide_response.json();
    for (let i = 0; i < tide_json.predictions.length; i++) {
        const date = tide_json.predictions[i].t;
        const level = tide_json.predictions[i].v;
        xs.push(date);
        ys.push(level);
    };

    // current tide level 
    const current_tide_time = [];
    const current_tide_level = [];
    const now_tide_url =`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8665530&product=predictions&datum=MLW&time_zone=lst_ldt&units=english&format=json`;    
    const now_tide_response = await fetch(now_tide_url);
    const now_tide_json = await now_tide_response.json();
    const max_tide_entry = Object.keys(now_tide_json.predictions).pop();
    const max_date = now_tide_json.predictions[max_tide_entry].t;
    const max_level = now_tide_json.predictions[max_tide_entry].v;
    current_tide_time.push(max_date);
    current_tide_level.push(max_level);

    const data = {
        timestamp: today_wTime,
        location: gridId,
        forecast: fore_json,
        xs: xs,
        ys: ys,
        current_tide_time: current_tide_time,
        current_tide_level: current_tide_level,
    };
    response.json(data)
});

