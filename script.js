var APIkey = "5e1fbf26e7999bc26ec11e0fd6c6c7b1";
var coords = document.getElementById("coords");
var historyArr = JSON.parse(localStorage.getItem("historyArr")) || [];
var set = new Set();

function onStart() {
  var ranLat = Math.round((Math.random() * 180 - 90) * 10000) / 10000;
  var ranLon = Math.round((Math.random() * 360 - 180) * 10000) / 10000;
  let center = [ranLon, ranLat];
  const map = tt.map({
    key: "jYV23H6TtSrbMJGiwDcq5hEw8TVbcnQn",
    container: "map",
    center: center,
    zoom: 4,
  });
  map.on("load", () => {
    new tt.Marker().setLngLat(center).addTo(map);
  });
}

onStart();

function citySearch() {
  var userInput = document.getElementById("userInput").value;
  if (userInput == "") {
    return;
  }

  var cityAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=${APIkey}`;

  historyArr.push(userInput);
  localStorage.setItem("historyArr", JSON.stringify(historyArr));

  searchHistory(userInput);

  fetch(cityAPI).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var latCoord = data[0].lat;
        var lonCoord = data[0].lon;

        let center = [lonCoord, latCoord];
        const map = tt.map({
          key: "jYV23H6TtSrbMJGiwDcq5hEw8TVbcnQn",
          container: "map",
          center: center,
          zoom: 12,
        });
        map.on("load", () => {
          new tt.Marker().setLngLat(center).addTo(map);
        });
      });
    }
  });
}

function searchHistory(userInput) {
	if (set.has(userInput)){
		return;
	}
  var cityButton = document.createElement("button");
  cityButton.textContent = userInput;
  var listItem = document.createElement("li");
  listItem.appendChild(cityButton);
  var parentList = document.querySelector(".search-history");
  parentList.appendChild(listItem);
  cityButton.addEventListener("click", historySearch);
  set.add(userInput);
}

for (var i = 0; i < historyArr.length; i++) {
  searchHistory(historyArr[i]);
}

function historySearch() {
	var cityAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${this.innerHTML}&limit=1&appid=${APIkey}`;
  console.log(cityAPI);
  fetch(cityAPI).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        var latCoord = data[0].lat;
        var lonCoord = data[0].lon;

        let center = [lonCoord, latCoord];
        const map = tt.map({
          key: "jYV23H6TtSrbMJGiwDcq5hEw8TVbcnQn",
          container: "map",
          center: center,
          zoom: 12,
        });
        map.on("load", () => {
          new tt.Marker().setLngLat(center).addTo(map);
        });
      });
    }
  });
}

// How to get button to search
// How to get previous items to search
