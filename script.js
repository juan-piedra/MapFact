var APIkey = "5e1fbf26e7999bc26ec11e0fd6c6c7b1";
var coords = document.getElementById("coords");
var historyArr = JSON.parse(localStorage.getItem("historyArr")) || [];
var set = new Set();
var placeNameArray = [];
var placeLinkArray = [];
var wikiDislplayEl = document.getElementById("wikiListUl");


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

			var geoCoordsSearch = latCoord + "|" + lonCoord;

			wikiGeo(geoCoordsSearch);


			let center = [lonCoord, latCoord];
			const map = tt.map({
				key: "jYV23H6TtSrbMJGiwDcq5hEw8TVbcnQn",
				container: "map",
				center: center,
				zoom: 10
			})
			map.on('load', () => {
				new tt.Marker().setLngLat(center).addTo(map)
			})
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

  fetch(cityAPI).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

        var latCoord = data[0].lat;
        var lonCoord = data[0].lon;


      var geoCoordsSearch = latCoord + "|" + lonCoord;

			wikiGeo(geoCoordsSearch);


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


// function that uses wiki API and the geocords from citySearch function to search for 10 places within  a 10,000 foot radius of the cords.
function wikiGeo(geoCoordsSearch){
var url = "https://en.wikipedia.org/w/api.php"; 
var wikiGeoPlacesArray = [];

var params = {
    action: "query",
    list: "geosearch",
    gscoord: geoCoordsSearch,
    gsradius: "10000",
    gslimit: "10",
    format: "json"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
        var pages = response.query.geosearch;
        for (var place in pages) {
			wikiGeoPlacesArray.push(pages[place].title);
			wikiName(pages[place].title);
        }

    })
    .catch(function(error){console.log(error);});
}


// function that uses the wiki API and the 10 places from the geoCoordsSearch function to get links for the 10 places we have looked up
function wikiName (nameSearch){
var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "opensearch",
    search: nameSearch,
    limit: "1",
    namespace: "0",
    format: "json"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(data) {

		var placeName = data.at(0);
		var placeLink = data.at(3);

		placeNameArray.push(placeName);
		placeLinkArray.push(placeLink);


      displayInfo(placeName, placeLink)
	})
    .catch(function(error){console.log(error);});


}


// populates and removes wiki info based on search/history selected 
var wikiInfoDisplay = document.querySelector(".wikiDislplay");
var counter = 0;
function displayInfo(name, link){
  counter ++;
  if (counter < 11){
  var wikiLi = document.createElement("li");
  var wikiLink = document.createElement("li");

  wikiLi = document.createElement("li");
  wikiLi.textContent = name;

  wikiLink = document.createElement('a');
  wikiLink.setAttribute("href",link[0]);
  wikiLink.setAttribute("target","blank");
  wikiLink.textContent = link[0];

  wikiDislplayEl.appendChild(wikiLi);
  wikiLi.appendChild(wikiLink);
  console.log(counter);
  } else {
    wikiDislplayEl.replaceChildren();
    counter = 1;
  }
}
