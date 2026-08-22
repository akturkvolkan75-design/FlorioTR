"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

type Flower = {
  slug: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  phone: string;
};

// KULLANICI İKONU

const userIcon = L.divIcon({
  className: "",

  html: `
    <div
      style="
        width:32px;
        height:32px;
        background:#2563eb;
        border:4px solid white;
        border-radius:50%;
        box-shadow:0 0 15px #2563eb;
      "
    ></div>
  `,

  iconSize: [32, 32],

  iconAnchor: [16, 16],
});

// FLORIOTR HARİTA İKONU

const flowerIcon = L.divIcon({
  className: "",

  html: `
    <div
      style="
        width:42px;
        height:48px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:white;
        border-radius:16px 16px 16px 4px;
        border:2px solid #123f34;
        box-shadow:0 5px 14px rgba(18,63,52,.25);
        transform:rotate(-45deg);
      "
    >
      <svg
        viewBox="0 0 42 54"
        width="25"
        height="31"
        style="
          display:block;
          transform:rotate(45deg);
          overflow:visible;
        "
        aria-hidden="true"
      >
        <path
          d="M20 48C19 39 20 31 22 23C24 16 27 11 31 7"
          fill="none"
          stroke="#123f34"
          stroke-width="2.1"
          stroke-linecap="round"
        />

        <path
          d="M25 15C28 8 33 5 38 5C37 11 33 15 25 15Z"
          fill="#efc979"
        />

        <path
          d="M20 25C14 20 9 20 5 22C8 28 13 30 20 28Z"
          fill="#123f34"
        />

        <path
          d="M21 32C27 27 32 27 36 29C33 35 28 37 21 35Z"
          fill="#efc979"
        />

        <path
          d="M20 39C14 35 9 36 6 39C9 44 14 45 20 43Z"
          fill="#123f34"
        />

        <circle
          cx="31"
          cy="7"
          r="2.2"
          fill="#efc979"
        />
      </svg>
    </div>
  `,

  iconSize: [42, 48],

  iconAnchor: [21, 48],

  popupAnchor: [0, -48],
});

export default function Map({
  flowers,
  userLocation,
}: {
  flowers: Flower[];

  userLocation?: {
    lat: number;
    lng: number;
  } | null;
}) {
  return (
    <MapContainer
      center={
        userLocation
          ? [
              userLocation.lat,
              userLocation.lng,
            ]
          : [41.0132, 28.9494]
      }
      zoom={13}
      scrollWheelZoom={true}
      className="h-[500px] w-full rounded-3xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* KULLANICI KONUMU */}

      {userLocation && (
        <Marker
          position={[
            userLocation.lat,
            userLocation.lng,
          ]}
          icon={userIcon}
        >
          <Popup>
            📍 Buradasınız
          </Popup>
        </Marker>
      )}

      {/* FLORIOTR NOKTALARI */}

      {flowers.map((flower) => (
        <Marker
          key={flower.slug}
          position={[
            flower.latitude,
            flower.longitude,
          ]}
          icon={flowerIcon}
        >
          <Popup>
            <div className="w-60 text-center">
              <h3 className="text-lg font-bold text-[#123f34]">
                {flower.name}
              </h3>

              <p className="mt-2">
                📍 {flower.location}
              </p>

              <p className="mt-2 font-bold">
                ⭐ {flower.rating}
              </p>

              <div className="mt-4 grid gap-2">
                <a
                  href={`/cicekci/${flower.slug}`}
                  className="
                    rounded-lg
                    bg-[#123f34]
                    p-2
                    font-bold
                    text-white
                  "
                >
                  Detayları Gör
                </a>

                <a
                  href={`https://wa.me/9${flower.phone
                    .replace(/\s/g, "")
                    .substring(1)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    rounded-lg
                    bg-green-500
                    p-2
                    font-bold
                    text-white
                  "
                >
                  💬 WhatsApp
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    flower.location
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    rounded-lg
                    border-2
                    border-[#123f34]
                    p-2
                    font-bold
                    text-[#123f34]
                  "
                >
                  🗺️ Yol Tarifi
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}