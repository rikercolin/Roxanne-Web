import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import { Map as LeafletMap, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'

var testGeoJson = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}]

class RoxMap extends Component {
    constructor() {
        super()
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 13,
            data: testGeoJson
        };

        this.geoJsonLayer = React.createRef();
    };

    geoJSONStyle() {
        return {
            color: '#1f2021',
            weight: 1,
            fillOpacity: 0.5,
            fillColor: '#fff2af',
        }
    }

    componentDidMount() {
        fetch("http://127.0.0.1:8000/api/geology/", {
            mode: "cors"
        })
        .then(response => {
            if (response.status > 400) {
                return console.error("Bad Response")
            }
            return response.json();
        })
        .then(newdata => {
            this.geoJsonLayer.current.leafletElement.clearLayers().addData(newdata)
            this.setState({data: newdata});
            console.log(newdata)
        });
    }



    render() {
        const position = [this.state.lat, this.state.lng];

        console.log("Render", this.state.data)

        return (
            <LeafletMap center = {position}
                zoom = {
                    this.state.zoom
                }>
                <TileLayer
                    attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                <GeoJSON
                    data={this.state.data}
                    ref={this.geoJsonLayer}
                    style={this.geoJSONStyle}
                />
            </LeafletMap>
        );
    };
};

ReactDOM.render(<RoxMap />, document.getElementById('container'))
