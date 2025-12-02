import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { GoClock } from "react-icons/go";
import { BiNavigation } from "react-icons/bi";
import Button from "@mui/material/Button";
import { IoEyeOutline } from "react-icons/io5";
import Typography from "@mui/material/Typography";
import "leaflet-routing-machine";
import { RiPinDistanceFill } from "react-icons/ri";

// Hàm tính khoảng cách Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const defaultIcon = new L.Icon({
  iconUrl: "https://vectorified.com/images/google-maps-marker-icon-38.png",
  iconSize: [40, 50],
  iconAnchor: [15, 50],
  popupAnchor: [9, -45],
});

const selectedIcon = new L.Icon({
  iconUrl:
    "https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/map-marker-icon.png",
  iconSize: [40, 50],
  iconAnchor: [15, 50],
  popupAnchor: [0, -45],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function RoutingPolyline({ userLocation, storeLocation }) {
  const map = useMap();
  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    if (!userLocation || !storeLocation) return;

    if (polyline) {
      map.removeLayer(polyline);
    }

    const fetchRoute = async () => {
      try {
        const apiKey = import.meta.env.VITE_ORS_API_KEY;
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${userLocation[1]},${userLocation[0]}&end=${storeLocation[1]},${storeLocation[0]}`;
        const res = await fetch(url);
        const data = await res.json();
        const coords = data.features[0].geometry.coordinates.map((c) => [
          c[1],
          c[0],
        ]);
        const newPolyline = L.polyline(coords, {
          color: "#03790a",
          weight: 5,
        }).addTo(map);
        map.fitBounds(newPolyline.getBounds());
        setPolyline(newPolyline);
      } catch (err) {
        console.error("Route error:", err);
      }
    };

    fetchRoute();
  }, [userLocation, storeLocation, map]);

  return null;
}

// Component để điều khiển map khi selectedStore thay đổi
function MapController({ selectedStore, stores, userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedStore || !stores.length) return;

    // Tìm store được chọn
    const store = stores.find((s) => s.id === selectedStore);
    if (!store || !store.coords) return;

    // Di chuyển map đến vị trí store
    map.setView(store.coords, 15, {
      animate: true,
      duration: 0.5,
    });

    // Tìm marker tương ứng và mở popup sau khi map đã di chuyển
    setTimeout(() => {
      // Duyệt qua tất cả các layers trong map để tìm marker
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          const markerLat = layer.getLatLng().lat;
          const markerLng = layer.getLatLng().lng;
          
          // Bỏ qua marker của user location
          if (userLocation && 
              Math.abs(markerLat - userLocation[0]) < 0.0001 && 
              Math.abs(markerLng - userLocation[1]) < 0.0001) {
            return;
          }
          
          // Kiểm tra xem marker này có khớp với store được chọn không
          if (
            Math.abs(markerLat - store.coords[0]) < 0.0001 &&
            Math.abs(markerLng - store.coords[1]) < 0.0001
          ) {
            layer.openPopup();
            return;
          }
        }
      });
    }, 600);
  }, [selectedStore, stores, map, userLocation]);

  return null;
}

export default function MapView({
  userLocation,
  stores,
  selectedStore,
  setSelectedStore,
  directionTo,
  setDirectionTo,
  onSelectStore,
}) {

  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Map Controller để điều khiển map khi selectedStore thay đổi */}
      <MapController 
        selectedStore={selectedStore} 
        stores={stores}
        userLocation={userLocation}
      />

      {/* Marker user */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>My Location</Popup>
        </Marker>
      )}

      {/* Marker stores */}
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={store.coords}
          icon={selectedStore === store.id ? selectedIcon : defaultIcon}
          eventHandlers={{ 
            click: () => setSelectedStore(store.id)
          }}
        >
          <Popup className="leaflet-popup-content">
            <div className="leaflet-popup-content-title">
              <Typography className="leaflet-popup-content-name">
                {store.name}
              </Typography>
              {/* Business type */}
              {store.businessType && (
                <Typography
                  style={{
                    fontSize: "12px",
                    color: "#1b4d1b",
                    marginTop: "2px",
                    marginBottom: "4px",
                  }}
                >
                  {store.businessType}
                </Typography>
              )}
              <Typography className="leaflet-popup-content-address">
                {store.address}
              </Typography>
              {userLocation && (
                <Typography className="leaflet-popup-content-distance" style={{ 
                  fontSize: "14px", 
                  color: "#666", 
                  marginBottom: "20px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                
                }}>
                  <RiPinDistanceFill style={{ marginRight: "10px", fontSize: "20px" }}/> Distance: {calculateDistance(
                    userLocation[0], 
                    userLocation[1], 
                    store.coords[0], 
                    store.coords[1]
                  ).toFixed(1)} km
                </Typography>
              )}
              <Typography className="leaflet-popup-content-daily">
                <GoClock style={{ marginRight: "10px" }} />
                Daily: {store.daily}
              </Typography>
              <div className="leaflet-popup-content-btn">
                <Button
                  className="leaflet-popup-btn-derection"
                  onClick={() => setDirectionTo(store.coords)}
                >
                  <BiNavigation
                    style={{ marginRight: "10px", fontSize: "20px" }}
                  />{" "}
                  Directions
                </Button>
                <Button
                  className="leaflet-popup-btn-details"
                  onClick={() => onSelectStore(store)}
                >
                  <IoEyeOutline
                    style={{ marginRight: "10px", fontSize: "20px" }}
                  />{" "}
                  Details
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Vẽ tuyến đường */}
      {userLocation && directionTo && (
        <RoutingPolyline
          userLocation={userLocation}
          storeLocation={directionTo}
        />
      )}
    </MapContainer>
  );
}
