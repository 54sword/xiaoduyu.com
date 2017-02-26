import React, { PropTypes } from 'react'

// import CSSModules from 'react-css-modules'
import styles from './style.scss'

class Navbar extends React.Component {

  constructor(props) {
    super(props)
    this.load = this.load.bind(this)
  }

  componentWillMount() {

    // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
    if (typeof window == 'undefined' || typeof document == 'undefined') {
      return
    }

    if (typeof(L) == "undefined") {

      var oHead = document.getElementsByTagName('head').item(0);
      var oScript= document.createElement("script");
      oScript.type = "text/javascript";
      oScript.src="https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js";
      oHead.appendChild( oScript);

      var link = document.createElement( "link" );
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css";
      document.getElementsByTagName("head")[0].appendChild( link );

    }

  }

  load() {

    const self = this

    if (typeof(L) == "undefined") {
      setTimeout(()=>{
        self.load()
      }, 1000)
      return
    }

    const { title, address } = this.props

    L.mapbox.accessToken = 'pk.eyJ1IjoiaHVhcmVuaG91c2UiLCJhIjoiY2l0bWJuaGthMDEyMzJ4bjBwOXhremRtNSJ9.yL1NodfpON8bj3JgPdHESg'; //'pk.eyJ1IjoiNTRzd29yZCIsImEiOiJjaXRtN2k1ZzAwMG9kMm5uMGRrOGU2c2FxIn0.yYfOVJCbCgz2KZM9xfM9Pg';
    var geocoder = L.mapbox.geocoder('mapbox.places'),
        map = L.mapbox.map('map', 'mapbox.streets');

    geocoder.query(address, showMap);

    function showMap(err, data) {
        // The geocoder can return an area, like a city, or a
        // point, like an address. Here we handle both cases,
        // by fitting the map bounds to an area or zooming to a point.

        // console.log(address)
        // console.log(data)

        if (data.lbounds) {
            map.fitBounds(data.lbounds);
        } else if (data.latlng) {
            map.setView([data.latlng[0], data.latlng[1]], 13);
        }

        L.mapbox.featureLayer({
            // this feature is in the GeoJSON format: see geojson.org
            // for the full specification
            type: 'Feature',
            geometry: {
                type: 'Point',
                // coordinates here are in longitude, latitude order because
                // x, y is the standard for GeoJSON and many formats
                coordinates: [
                  data.latlng[1],
                  data.latlng[0]
                ]
            },
            properties: {
                title: title,
                description: address,
                // one can customize markers by adding simplestyle properties
                // https://www.mapbox.com/guides/an-open-platform/#simplestyle
                'marker-size': 'large',
                'marker-color': '#14a0f0',
                // 'marker-symbol': 'cafe'
            }
        }).addTo(map);

    }

  }

  componentDidMount() {

    // 如果是服务器，那么就不存在 window 和 document 全局变量，因此不继续执行
    if (typeof window == 'undefined' || typeof document == 'undefined') {
      return
    }

    this.load()
  }

  render() {
    return (<div id='map' className={styles.map}></div>)
  }

}

// Navbar = CSSModules(Navbar, styles)

export default Navbar
