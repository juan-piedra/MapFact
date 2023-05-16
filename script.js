var APIkey = "5e1fbf26e7999bc26ec11e0fd6c6c7b1";
var coords = document.getElementById("coords");
var historyArr = JSON.parse(localStorage.getItem("historyArr")) || [];


function citySearch() {
	var userInput = document.getElementById("userInput").value;
	if (userInput == ""){
		return;
	}
	if (historyArr.includes(userInput)){
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
	var cityButton = document.createElement('button');
	cityButton.textContent = userInput;
	document.querySelector('.search-history').append(cityButton);
  }



for (var i = 0; i < historyArr.length; i++) {
	searchHistory(historyArr[i]);
}





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
console.log(params);

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
        var pages = response.query.geosearch;
        for (var place in pages) {
            console.log(pages[place].title);
			wikiGeoPlacesArray.push(pages[place].title);
			wikiName(pages[place].title);
        }
    })
    .catch(function(error){console.log(error);});

console.log(wikiGeoPlacesArray);

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
    .then(function(response) {console.log(response);})
    .catch(function(error){console.log(error);});
}

function wikiDislplay(nameArray){
	for(var i = 0; i < nameArray.length; i++){
		var placeName = document.createElement("div");
		placeName.textContent = nameArray[i]
}
}