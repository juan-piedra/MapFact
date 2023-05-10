var APIkey = "5e1fbf26e7999bc26ec11e0fd6c6c7b1";
var coords = document.getElementById("coords");

function citySearch() {
    var userInput = document.getElementById("userInput").value;
    var cityAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=${APIkey}`;
  
    fetch(cityAPI).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
        	var lat = data[0].lat;
        	var lon = data[0].lon;

			coords.innerHTML = lat + ", " + lon;
			
        });
      }
    });
  }