import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const Map = ({ lat, long }: { lat: number; long: number }) => {
  if (typeof window !== "undefined") {
    return (
      <MapContainer
        // center={[lat, long]}
        bounds={[
          [lat, long],
          [lat, long],
        ]}
        className="overflow-hidden"
        style={{ height: "50vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    );
  } else {
    return null;
  }
};

export default Map;
