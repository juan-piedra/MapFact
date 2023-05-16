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

			var geoCoordsSearch = latCoord + "|" + lonCoord;
			// console.log("####" + geoCoordsSearch);
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

var wikiInfoDisplay = document.querySelector(".wikiDislplay");


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
//console.log(params);

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
        var pages = response.query.geosearch;
        for (var place in pages) {
            //console.log(pages[place].title);
			wikiGeoPlacesArray.push(pages[place].title);
			wikiName(pages[place].title);
        }
		wikiDislplay(placeNameArray);
    })
    .catch(function(error){console.log(error);});

//console.log(wikiGeoPlacesArray);
console.log(placeLinkArray);
//console.log(placeNameArray);
}


// function that uses the wiki API and the 10 places from the geoCoordsSearch function to get links for the 10 places we have looked up

var placeNameArray = [];
var placeLinkArray = [];

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
		//console.log(data);
		var placeName = data.at(0);
		var placeLink = data.at(3);
		//console.log(placeName);
		//console.log(placeLink);
		placeNameArray.push(placeName);
		placeLinkArray.push(placeLink);
	


		// var wikiLi = document.createElement("li");
		// wikiLi.appendChild(placeName);
		// document.getElementById("wikiListUl").appendChild(wikiLi);


		//wikiInfoDisplay.innerHTML="";
		// var title = document.createElement("h4");
		// title.textContent = placeName;
		// var wikiList = document.createElement("li");
		// wikiList.appendChild(title);
		// var parentList = document.querySelector("wikiDisplay");
		// parentList.appendChild(wikiList);
		//wikiInfoDisplay.append(title);


	})
    .catch(function(error){console.log(error);});


}
var wikiDislplayEl = document.getElementById("wikiListUl");
function wikiDislplay(placeNameArray){
	console.log(wikiDislplayEl);
	for(var i = 0; i < 10; i++){
		var wikiLi = document.createElement("li");
		wikiLi.textContent = placeNameArray[i];
		wikiDislplayEl.appendChild(wikiLi);
		
}
}

