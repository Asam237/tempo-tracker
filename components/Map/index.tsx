import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import L, { Icon } from "leaflet";
import { StaticImageData } from "next/image";

const Map = ({
  lat,
  long,
  city,
  description,
}: {
  lat: number;
  long: number;
  city: any;
  description: any;
}) => {
  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const position = [lat, long];
  const myCoordinates: number[] = position;
  type LatLngTuple = [number, number];
  const correctCoordinates: LatLngTuple = myCoordinates as LatLngTuple;
  const icon = markerIconPng as StaticImageData;

  let customIcon: any = {
    iconUrl: "https://image.flaticon.com/icons/png/512/1397/1397898.png",
    iconSize: [40, 40],
  };
  let myIcon = L.icon(customIcon);

  let iconOptions = {
    title: "company name",
    draggable: true,
    icon: myIcon,
  };
  let marker = new L.Marker(correctCoordinates, iconOptions);

  if (typeof window !== "undefined") {
    return (
      <MapContainer
        center={correctCoordinates}
        zoom={7}
        scrollWheelZoom={false}
        className="overflow-hidden z-50"
        style={{ height: 500, width: "100%" }}
      >
        <TileLayer
          url={tileLayerUrl}
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* <Marker key={1} title="zone"  position={correctCoordinates}>
          <Popup>
            <b>{city}</b> <br />
            {description}
          </Popup>
        </Marker> */}
      </MapContainer>
    );
  } else {
    return null;
  }
};

export default Map;
