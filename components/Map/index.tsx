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
      <>
        <div
          className={`bg-[url("../assets/imgs/weather.webp")] h-screen w-screen z-0 left-0 top-0 absolute`}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
        <MapContainer
          center={correctCoordinates}
          zoom={13}
          scrollWheelZoom={false}
          className="overflow-hidden z-50 rounded-md mx-auto"
          style={{ height: "75vh", width: "75vw" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          />
        </MapContainer>
      </>
    );
  } else {
    return null;
  }
};

export default Map;
