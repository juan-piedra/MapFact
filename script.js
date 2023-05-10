var APIkey = "5e1fbf26e7999bc26ec11e0fd6c6c7b1";
var coords = document.getElementById("coords");

function citySearch() {
    var userInput = document.getElementById("userInput").value;
    var cityAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=${APIkey}`;
  
    fetch(cityAPI).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
        	var latCoord = data[0].lat;
        	var lonCoord = data[0].lon;
			console.log(typeof latCoord);
			coords.innerHTML = latCoord + ", " + lonCoord;
			
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
