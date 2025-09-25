import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import "./StorePage.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { GoClock } from "react-icons/go";
import { BiNavigation } from "react-icons/bi";
import Button from "@mui/material/Button";
import { IoEyeOutline } from "react-icons/io5";
import "leaflet-routing-machine";

// ================== MOCK DATA ==================
// Thêm coords (latitude, longitude) cho các store
const mockStores = [
  {
    id: 1,
    name: "Green Café Downtown",
    address: "1262 Kha Vạn Cân, Thủ Đức, TP.HCM",
    coords: [10.8565, 106.7709], // tọa độ thật
    distance: "1.2 km",
    products: ["cup", "container", "bottle"],
    daily: "9AM - 8PM",
  },
  {
    id: 2,
    name: "Eco Coffee Shop",
    address: "456 River Rd, Uptown, City 67890",
    coords: [10.768, 106.673], // giữ địa chỉ cũ hoặc đổi tùy ý
    distance: "2.5 km",
    products: ["cup"],
    daily: "9AM - 8PM",
  },
];

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

    // Xóa polyline cũ trước khi vẽ mới
    if (polyline) {
      map.removeLayer(polyline);
    }

    const fetchRoute = async () => {
      try {
        const apiKey = import.meta.env.VITE_ORS_API_KEY;
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${userLocation[1]},${userLocation[0]}&end=${storeLocation[1]},${storeLocation[0]}`;

        const res = await fetch(url);
        const data = await res.json();

        const coords = data.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);

        const newPolyline = L.polyline(coords, { color: "#03790a", weight: 5 }).addTo(map);

        map.fitBounds(newPolyline.getBounds());
        setPolyline(newPolyline); // lưu polyline mới
      } catch (err) {
        console.error("Route error:", err);
      }
    };

    fetchRoute();
  }, [userLocation, storeLocation, map]);

  return null;
}


export default function StorePage() {
  const [userLocation, setUserLocation] = useState([10.762621, 106.660172]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [directionTo, setDirectionTo] = useState(null);

  // Lấy vị trí user
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err)
    );
  }, []);

  return (
    <div className="store">
      <div className="store-container">
        {/* Header */}
        <div className="store-header">
          <Typography className="store-title text-black">
            <MdOutlineLocationOn className="mr-2 size-10 text-green-300" />{" "}
            Partner Stores
          </Typography>
          <span style={{ color: "#838383" }}>
            Find stores near you that participate in the Back2Use program
          </span>
        </div>

        {/* Search bar */}
        <div className="store-search">
          <TextField
            placeholder="Search for location or store name..."
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoIosSearch size={20} color="#666" />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Content */}
        <div className="store-content">
          {/* Map */}
          <div className="store-map">
            <MapContainer
              center={userLocation}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {/* Marker user */}
              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>My Location</Popup>
                </Marker>
              )}

              {/* Marker stores */}
              {mockStores.map((store) => (
                <Marker
                  key={store.id}
                  position={store.coords} // dùng tọa độ thật
                  icon={selectedStore === store.id ? selectedIcon : defaultIcon}
                  eventHandlers={{ click: () => setSelectedStore(store.id) }}
                >
                  <Popup className="leaflet-popup-content">
                    <div className="leaflet-popup-content-title">
                      <Typography className="leaflet-popup-content-name">
                        {store.name}
                      </Typography>
                      <Typography className="leaflet-popup-content-address">
                        {store.address}
                      </Typography>
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
                        <Button className="leaflet-popup-btn-details">
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
          </div>

          {/* Info bên phải */}
          <div className="store-rightInfo">
            <div className="store-nearby">
              <div className="store-nearby-title">
                <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                  Nearby Stores
                </Typography>
                <span>Click on map markers to view details</span>
              </div>

              <div className="stotre-nearby-list">
                {mockStores.map((store) => {
                  const visibleProducts = store.products.slice(0, 2);
                  const extraCount =
                    store.products.length > 2 ? store.products.length - 2 : 0;

                  return (
                    <div
                      key={store.id}
                      className="stotre-nearby-content"
                      style={{
                        border: "1px solid #d3e6d3",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "12px",
                        marginTop: "12px",
                        background: "#f6faf6",
                      }}
                    >
                      <div className="stotre-nearby-content-left">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            className="stotre-nearby-content-name"
                            sx={{ fontWeight: "bold" }}
                          >
                            {store.name}
                          </Typography>
                          <div
                            style={{
                              fontSize: "12px",
                              background: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "12px",
                              padding: "2px 8px",
                            }}
                          >
                            {store.distance}
                          </div>
                        </div>

                        <span
                          className="stotre-nearby-content-des"
                          style={{ fontSize: "14px", color: "#777" }}
                        >
                          {store.address}
                        </span>
                        <div
                          className="stotre-nearby-product"
                          style={{
                            marginTop: "8px",
                            display: "flex",
                            gap: "6px",
                          }}
                        >
                          {visibleProducts.map((prod, i) => (
                            <span
                              key={i}
                              style={{
                                background: "#1b4d1b",
                                color: "white",
                                fontSize: "12px",
                                padding: "2px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              {prod}
                            </span>
                          ))}
                          {extraCount > 0 && (
                            <span
                              style={{
                                background: "#1b4d1b",
                                color: "white",
                                fontSize: "12px",
                                padding: "2px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              +{extraCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chú thích */}
            <div className="store-legend">
              <Typography className="store-legend-title">Map Legend</Typography>
              <div className="store-legend-btn">
                <Typography className="store-legend-btn-info">
                  <div className="store-legend-btn-above"></div> Partner Store
                </Typography>
                <Typography className="store-legend-btn-info">
                  <div className="store-legend-btn-below"></div> Selected Store
                </Typography>
                <Typography className="store-legend-btn-info">
                  <div className="store-legend-btn-location"></div> My location
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
