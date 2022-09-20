
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

        // weather information 
        today = json.forecast.properties.periods[0].name;
        today_date = json.forecast.properties.periods[0].startTime;
        today_detail_forecast = json.forecast.properties.periods[0].detailedForecast;

        document.getElementById('today').textContent = today;
        document.getElementById('todayDate').textContent = today_date;
        document.getElementById('todayDetailForecast').textContent = today_detail_forecast;


        // tide information
        currTide = json.tide.predictions[0].v;
        xs = json.xs;
        ys = json.ys;
        document.getElementById('currTide').textContent = currTide;

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
            ],
          }
        })

    });
  } else {
    console.log("geolocation not available");
  }
}
