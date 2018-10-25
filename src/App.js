import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  //state for empty array of venues
  state = {
    venues: []
  };

  //after component mounts, calls getVenues
  componentDidMount() {
    this.getVenues();
  }
  //renders the map after component is mounted
  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB6BYF1KfAVrkPBNZ8dXqE-UwehSTtq0iU&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  //square API call for venues
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "L101NHSYMNHUQMEZHA32NRVREUSC1TKKEPUZ2UVG1RIJSO5R",
      client_secret: "4XETDSH2ROP5UBUV2EYRDBZOKUI5FOQBLJE2YM43PY0ONBCF",
      query: "restaurant",
      near: "Hershey",
      v: "20182310"
    };

    axios
      .get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState(
          {
            venues: response.data.response.groups[0].items
          },
          this.renderMap()
        );
      })
      .catch(error => {
        console.log("Error: " + error);
      });
  };

  initMap = () => {
    //create a map with default center & zoom
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 40.286539, lng: -76.651508 },
      zoom: 12
    });

    //create an InfoWindow on the map
    var infowindow = new window.google.maps.InfoWindow();

    //loop over state to place markers on map
    this.state.venues.map(myVenue => {
      //information to be used in the InfoWindow
      var contentString = `${myVenue.venue.name}`;

      //create a marker
      var marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map: map,
        title: myVenue.venue.name
      });

      //event listener to display the InfoWindow on the map
      marker.addListener("click", function() {
        //change infowindow content
        infowindow.setContent(contentString);
        //open the infowindow
        infowindow.open(map, marker);
      });
    });
  };

  render() {
    return (
      <main>
        <div id="map" />
      </main>
    );
  }
}

//function to add async script for google map api
function loadScript(url) {
  const index = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
