

let socket;
const currentUserName = "test"
// const currentUserName = prompt("Je naam ?", "Username") || "Username";
let currentUserLocation = [];

const currentUserCoordinatesElement = document.getElementById("coordinates");
const currentUserConnectedElement = document.getElementById("online");

let markers = [];
const mymap = L.map("mapid").setView([0, 0], 13);
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 13,
    detectRetine:true,
    id: "mapbox/streets-v11",
    // id: "mapbox/dark-v10",
    accessToken:
      //"pk.eyJ1IjoicmVocmUiLCJhIjoiY2s1dzc5bnh0MDN3MzNvbmVibmhxb2dlNiJ9.iBYJTrGdyWvzU84CzQik_g"
      "pk.eyJ1IjoiaGFpZGlzYmFjayIsImEiOiJjazdkbzJzazkwbjlvM2ZwZDZ4eTZvcHpyIn0.rUAkhqFdJsBZlvdh_8lrNQ"
  }
).addTo(mymap);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    setInitialSocketAndCoordinates,
    () => alert("Je locatie kon niet gevonden worden"),
    {
      enableHighAccuracy: true
    }
  );
} else {
  alert("not available");
}

const CustomIcon = L.Icon({
    iconUrl: 'red.png',  
    iconSize:     [38, 95],
    iconAnchor:   [22, 94],
    popupAnchor:  [-3, -76]
});

    
function setInitialSocketAndCoordinates(position) {
  currentUserLocation = [position.coords.latitude, position.coords.longitude];
  mymap.setView(currentUserLocation, 13);

  setSocketIO();
}

function setSocketIO() {
  socket = io();

  socket.emit("update-marker", {
    username: currentUserName,
    coordinates: currentUserLocation
  });

  socket.on("update-markers-on-frontend", data => {
    updateMarkersAndCoordinatesAndConnectedUsers(data);
  });

  navigator.geolocation.watchPosition(position => {
    currentUserLocation = [position.coords.latitude, position.coords.longitude];

    socket.emit("update-marker", {
      username: currentUserName,
      coordinates: currentUserLocation
    });
  });
}

function updateMarkersAndCoordinatesAndConnectedUsers(markersFromBackend) {
  if (markers.length) {
    markers.forEach(item => {
      mymap.removeLayer(item);
    });

    markers = [];
  }
  markersFromBackend.forEach(item => {
    markers.push(
      L.marker(item.coordinates)
        .addTo(mymap)
        .bindPopup(item.username)
        .openPopup()
    );
    console.log(L.marker)
  });

  if (currentUserConnectedElement.firstChild) {
    currentUserConnectedElement.removeChild(
      currentUserConnectedElement.firstChild
    );
  }
  let currentUserConnected = document.createTextNode(markersFromBackend.length);
  currentUserConnectedElement.appendChild(currentUserConnected);

  if (currentUserCoordinatesElement.firstChild) {
    currentUserCoordinatesElement.removeChild(
      currentUserCoordinatesElement.firstChild
    );
  }
  const currentUserCoordinates = document.createTextNode(
    `Lat:${currentUserLocation[0]}, lng:${currentUserLocation[1]}`
  );
  currentUserCoordinatesElement.appendChild(currentUserCoordinates);
}
