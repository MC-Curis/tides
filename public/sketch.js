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
      document.getElementById("detailedForecast").textContent =
        detailedForecast;

      //current time
      time = json.timestamp;

      // current tide information
      currentTime = json.current_tide_time;
      currTideLevel_text = json.current_tide_level + " ft";
      currTideLevel = json.current_tide_level;
      document.getElementById("currentTime").textContent = currentTime;
      document.getElementById("currTideLevel_text").textContent =
        currTideLevel_text;

      xs = json.xs;
      ys = json.ys;
      scatter_data = [{ x: currentTime[0], y: currTideLevel }];

      const ctx = document.getElementById("chart").getContext("2d");
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: xs,
          datasets: [
            {
              type: "scatter",
              data: scatter_data,
              pointRadius: 9,
              pointBackgroundColor: "rgb(77, 163, 110)",
            },
            {
              data: ys,
              borderColor: "white",
              borderWidth: 3,
              fill: true,
              pointRadius: 0,
              stepped: false,
              tension: 0,
            },
          ],
        },
        options: {
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var datasetLabel =
                  data.datasets[tooltipItem.datasetIndex].label || "Other";
                var label = data.labels[tooltipItem.index];
                return datasetLabel + ": " + label;
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "minute",
                  unitStepSize: 120,
                  displayFormats: {
                    minute: "h:mm A",
                  },
                },
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontColor: "white", // Change this line
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontColor: "white", // Change this line
                  callback: function (value, index, ticks) {
                    return value + " ft";
                  },
                },
              },
            ],
          },
        },
      });
    });
  } else {
    console.log("geolocation not available");
  }
}
