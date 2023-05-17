var APIkey = "5e1fbf26e7999bc26ec11e0fd6c6c7b1";
var coords = document.getElementById("coords");
var historyArr = JSON.parse(localStorage.getItem("historyArr")) || [];
var set = new Set();
var searchHistoryList = document.getElementsByClassName("search-history");

// Takes user to a top 10 city (according to some website)
function onStart() {
  var ranCitiesArr = ["New York City", "Los Angeles", "San Francisco", "Chicago", "Washington", "San Diego", "Las Vegas", "San Jose", "Boston", "Miami"];
  var randomNum = Math.floor(Math.random() * 10);
  var ranCity = ranCitiesArr[randomNum];

	var cityAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${ranCity}&limit=1&appid=${APIkey}`;
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
          zoom: 10,
        });
        map.on("load", () => {
          new tt.Marker().setLngLat(center).addTo(map);
        });
      });
    }
  });
}

onStart();

// The main function that searches for cities
function citySearch() {
  var userInput = document.getElementById("userInput").value;
  if (userInput == "") {
    return;
  }

  var cityAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=${APIkey}`;

  historyArr.push(userInput);
  localStorage.setItem("historyArr", JSON.stringify(historyArr));

  searchHistory(userInput);
  document.getElementById("userInput").value = "";

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

function enterKeyPressed(event) {
  if (event.keyCode === 13) {
    citySearch();
  }
}

// Function for search history section, creating buttons and what not
function searchHistory(userInput) {
  // Makes userInput nice a pwetty
  userInput = userInput.toLowerCase();
  var wordsArr = userInput.split(" ");
  for (let i = 0; i < wordsArr.length; i++) {
    wordsArr[i] = wordsArr[i][0].toUpperCase() + wordsArr[i].substr(1);
  }
  userInput = wordsArr.join(" ");
  
  // Stops duplicate searchHistory buttons
  if (set.has(userInput)){
		return;
	}
  // Stops button overflow
  if (set.size > 13){
    var firstElement = set.values().next().value;
    set.delete(firstElement);
    var searchHistoryList = document.querySelector(".search-history");
    searchHistoryList.removeChild(searchHistoryList.querySelector("li"));
  }

  // Birds and bees of searchHistory buttons
  var cityButton = document.createElement("button");
  cityButton.textContent = userInput;
  var listItem = document.createElement("li");
  listItem.appendChild(cityButton);
  var parentList = document.querySelector(".search-history");
  parentList.appendChild(listItem);
  cityButton.addEventListener("click", historySearch);
  set.add(userInput);
}

// Loops through local storage creating buttons
for (var i = 0; i < historyArr.length; i++) {
  searchHistory(historyArr[i]);
}

// Function for the buttons the be useful for once in their life, GOD!
function historySearch() {
	var cityAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${this.innerHTML}&limit=1&appid=${APIkey}`;
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

// Clear search history button