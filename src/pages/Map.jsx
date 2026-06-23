import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import { getPoints, postPoint } from "../services/mapService";
import { useAuth } from "../contexts/AuthContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapStyles = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#f0f4f8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0e7ef" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9dff0" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dce8f0" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e8edf2" }] },
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#192853" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#555e78" }] },
];

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#192853"/>
  </svg>
);

export const Map = () => {
  const { token, logout } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -28.2624, lng: -52.4088 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMarkers();
  }, [token]);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    try {
      const savedPoint = await postPoint(token, {
        latitude: lat,
        longitude: lng,
        descricao: "Novo Evento",
      });
      setMarkers((prev) => [
        ...prev,
        {
          id: savedPoint.id,
          title: savedPoint.descricao || "Novo Evento",
          position: { lat: savedPoint.latitude, lng: savedPoint.longitude },
        },
      ]);
    } catch (error) {
      alert(error.message);
    }
  };

  const customMarkerIcon = isLoaded ? {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: "#192853",
    fillOpacity: 1,
    strokeColor: "#ffe14e",
    strokeWeight: 2,
    scale: 1.8,
    anchor: new window.google.maps.Point(12, 22),
  } : null;

  return (
    <div className="flex flex-col h-full bg-[#eff8ff] relative">
      {/* Botão logout */}
      <button
        onClick={() => { logout(); }}
        className="absolute top-4 right-4 z-20 w-[40px] h-[40px] rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <LogoutIcon />
      </button>

      {/* Mapa */}
      <div className="flex-1 w-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={14}
            onClick={handleMapClick}
            options={{
              styles: mapStyles,
              disableDefaultUI: true,
              zoomControl: false,
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                icon={customMarkerIcon}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-1 max-w-[160px]">
                  <p className="font-bold text-[#192853] text-sm">{selectedMarker.title}</p>
                  <p className="text-gray-500 text-xs mt-1">Toque para mais detalhes</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="flex-1 w-full flex items-center justify-center bg-[#eff8ff]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#192853] border-t-[#ffe14e] rounded-full animate-spin" />
              <p className="text-[#192853] font-semibold">Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>

      <Navbar />
      <div className="h-[61px]" />
    </div>
  );
};
