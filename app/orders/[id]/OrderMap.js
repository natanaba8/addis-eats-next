"use client";

import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

const courier = [9.035, 38.746];
const delivery = [9.018, 38.762];
const route = [courier, delivery];

const courierIcon = L.divIcon({
  className: "",
  html: '<span class="order-map-marker courier-marker">Courier</span>',
  iconSize: [104, 34],
  iconAnchor: [52, 17],
});

const deliveryIcon = L.divIcon({
  className: "",
  html: '<span class="order-map-marker delivery-marker">Delivery</span>',
  iconSize: [110, 34],
  iconAnchor: [55, 17],
});

function FitRoute() {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(route, { padding: [36, 48] });
  }, [map]);

  return null;
}

export default function OrderMap() {
  return (
    <MapContainer
      className="order-map"
      center={delivery}
      zoom={14}
      scrollWheelZoom={false}
      aria-label="Illustrative courier route in Addis Ababa"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={route} pathOptions={{ color: "#a3471d", weight: 4, dashArray: "8 8" }} />
      <Marker position={courier} icon={courierIcon} />
      <Marker position={delivery} icon={deliveryIcon} />
      <FitRoute />
    </MapContainer>
  );
}