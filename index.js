
// index.js is what is used to make API Calls using from the server using node.js
// the app.get('/api') creates an API that the sketch.js pulls directly into the client 

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

    // date variable 
    var date = new Date(); 
   
    // current Time
    // var time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    // todays date formatted
    // const today_year = date.getFullYear().toString();
    // var today_month = (date.getMonth() + 1).toString();
    // var today_day = date.getDate().toString();
    // (today_day.length == 1) && (today_day = '0' + today_day);
    // (today_month.length == 1) && (today_month = '0' + today_month);
    // var today = today_year + today_month + today_day;
    // // console.log(`Today's Date: ${today}`)


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
    const tide_url =`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${today}&end_date=${future}&station=8665530&product=predictions&datum=STND&time_zone=lst_ldt&units=english&format=json`;
    const tide_response = await fetch(tide_url);
    const tide_json = await tide_response.json();
    for (let i = 0; i < tide_json.predictions.length; i++) {
        const date = tide_json.predictions[i].t;
        const level = tide_json.predictions[i].v;
        xs.push(date);
        ys.push(level);
    };


    // current tide level 
    const now_xs = [];
    const now_ys = [];
    const now_tide_url =`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8665530&product=predictions&datum=STND&time_zone=lst_ldt&units=english&format=json`;    
    const now_tide_response = await fetch(now_tide_url);
    const now_tide_json = await now_tide_response.json();
    const max_tide_entry = Object.keys(now_tide_json.predictions).pop();
    const max_tide_arr = now_tide_json.predictions[max_tide_entry]; 
    const max_date = now_tide_json.predictions[max_tide_entry].t;
    const max_level = now_tide_json.predictions[max_tide_entry].v;
    now_xs.push(max_date);
    now_ys.push(max_level);
    // xs.push(max_date);
    // ys.push(max_level)

    const p_all = tide_json.predictions;
    p_all.push(max_tide_arr); 
    
    const xs2 = [];
    const ys2 = [];

    const var_arr = p_all.map(p_all => {
        return {...p_all, date: new Date(p_all.t)};
      });

    const sortedAsc = var_arr.sort(
        (objA, objB) => Number(objA.date) - Number(objB.date),
        );

    for (let i = 0; i < sortedAsc.length; i++) {
        const date = sortedAsc[i].t;
        const level = sortedAsc[i].v;
        xs2.push(date);
        ys2.push(level);
    };
    obj = tide_json.predictions;


    const data = {
        timestamp: today_wTime,
        forecast: fore_json,
        // tide: tide_json,
        // t_predict: tide_json.predictions,
        xs: xs,
        ys: ys,
        now_xs: now_xs,
        now_ys: now_ys,
        xs2: xs2,
        ys2: ys2
    };
    // console.log(t_predict)
    response.json(data)
});

