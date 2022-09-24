
// sketch.js is what what colls the API from node.js and serves to client 

api_call();
async function api_call() {
  let lat, lon;
  if ("geolocation" in navigator) {
      console.log("geolocation available");
        navigator.geolocation.getCurrentPosition(async (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        // calling api from index.js
        const api_url = `/api/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json);


        // weather information 
        shortForecast = json.forecast.properties.periods[0].shortForecast;
        document.getElementById('weatherDesc').textContent = shortForecast;

        //current time 
        time = json.timestamp;
 

        // tide information
        currentTime = json.now_xs;
        currTideLevel = json.now_ys;
        console.log(currentTime);
        console.log(currTideLevel[0]);
     
      
        document.getElementById('currentTime').textContent = currentTime;
        document.getElementById('currTideLevel').textContent = currTideLevel;

        xs = json.xs;
        ys = json.ys;
        scatter = [{x: currentTime[0], y : currTideLevel}];

        const ctx = document.getElementById("chart").getContext("2d");
        const myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: xs,
            datasets: [
              {
                label: "Tide Levels",
                data: ys,
                borderColor: "#5287E8",
                borderWidth: 3,
                fill: true,
                pointRadius: 0,
                stepped: false,
                tension: 0,
              },
              {
                type: 'scatter',
                label: 'current time',
                data: scatter,
                pointRadius: 9,
                pointBackgroundColor: '#5287E8',
              }
            ],
          },
        })

    });
  } else {
    console.log("geolocation not available");
  }
}
