
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
        detailedForecast = json.forecast.properties.periods[0].detailedForecast;
        document.getElementById('detailedForecast').textContent = detailedForecast;

        //current time 
        time = json.timestamp;
 
        // current tide information
        currentTime = json.current_tide_time;
        currTideLevel = json.current_tide_level;     
        document.getElementById('currentTime').textContent = currentTime;
        document.getElementById('currTideLevel').textContent = currTideLevel;

        xs = json.xs;
        ys = json.ys;
        scatter_data = [{x: currentTime[0], y : currTideLevel}];

        const ctx = document.getElementById("chart").getContext("2d");
        const myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: xs,
            datasets: [
              {
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
                data: scatter_data,
                pointRadius: 9,
                pointBackgroundColor: '#5287E8',
              }
            ],
          },
          options: {
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || 'Other';
                      var label = data.labels[tooltipItem.index];
                      return datasetLabel + ': ' + label;
                  }
              }
          },
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                },
              },
            }
          }
        })

    });
  } else {
    console.log("geolocation not available");
  }
}
