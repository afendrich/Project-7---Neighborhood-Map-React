//import React, { Component } from "react";
import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import axios from "axios";

class App extends React.Component {
  //state for empty array of venues
  constructor(props) {
    super(props);
    this.state = {
      venues: [],
      markers: []
      //query: ''
    };
  }

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

    //create an empty array for all the markers
    var allMarkers = [];
    this.setState({
      map: map,
      infowindow: infowindow
    });

    //loop over state to place markers on map
    this.state.venues.map(myVenue => {
      //information to be used in the InfoWindow
      var contentString = `<h1>${myVenue.venue.name}</h1>
        ${myVenue.venue.location.address}, ${myVenue.venue.location.city} 
      ${myVenue.venue.location.state}
      <h5>Information provided by Foursquare.</h5>`;

      //create a marker
      var marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map: map,
        title: myVenue.venue.name,
        animation: window.google.maps.Animation.DROP
      });

      //event listener to display the InfoWindow on the map
      marker.addListener("click", function() {
        //change infowindow content
        infowindow.setContent(contentString);
        //open the infowindow
        infowindow.open(map, marker);
      });
      allMarkers.push(marker);
    });
    this.setState({
      markers: allMarkers
    });
    this.setState({
      filtermyVenue: this.state.venues
    });
  };

  //filtering venues
  filtermyVenue(query) {
    let f = this.state.venues.filter(myvenue =>
      myvenue.venue.name.toLowerCase().includes(query.toLowerCase())
    );

    this.state.markers.forEach(marker => {
      marker.title.toLowerCase().includes(query.toLowerCase()) === true
        ? marker.setVisible(true)
        : marker.setVisible(false);
    });
    this.setState({ filtermyVenue: f, query });
  }

  render() {
    return (
      <main>
        <div id="map" />
        <div id="sidebar">
          <input
            placeholder="Filter by Name"
            value={this.state.query}
            onChange={e => {
              this.filtermyVenue(e.target.value);
            }}
          />
          <br />
          {this.state.filtermyVenue &&
            this.state.filtermyVenue.length > 0 &&
            this.state.filtermyVenue.map((myVenue, index) => (
              <div
                onClick={() => {
                  console.log(this + " was clicked");
                }}
                key={index}
                className="venue-item"
              >
                {myVenue.venue.name}
              </div>
            ))}
        </div>
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
