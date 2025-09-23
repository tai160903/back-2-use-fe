import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import "./StorePage.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { GoClock } from "react-icons/go";
import { BiNavigation } from "react-icons/bi";
import Button from "@mui/material/Button";
import { IoEyeOutline } from "react-icons/io5";
import "leaflet-routing-machine";

// Mock dữ liệu store
const mockStores = [
  {
    id: 1,
    name: "Green Café Downtown",
    address: "123 Main St, Downtown, City 12345",
    distance: "1.2 km",
    products: ["cup", "container", "bottle"],
    daily: "9AM -8PM",
  },
  {
    id: 2,
    name: "Eco Coffee Shop",
    address: "456 River Rd, Uptown, City 67890",
    distance: "2.5 km",
    products: ["cup"],
    daily: "9AM - 8PM",
  },
];

// Icon mặc định
const defaultIcon = new L.Icon({
  iconUrl: "https://vectorified.com/images/google-maps-marker-icon-38.png",
  iconSize: [40, 50],
  iconAnchor: [15, 50],
  popupAnchor: [9, -45],
});

// Icon khi được chọn
const selectedIcon = new L.Icon({
  iconUrl:
    "https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/map-marker-icon.png",
  iconSize: [40, 50],
  iconAnchor: [15, 50],
  popupAnchor: [0, -45],
});

// Icon user
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Component vẽ chỉ đường
function Routing({ userLocation, storeLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !storeLocation) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(storeLocation[0], storeLocation[1]),
      ],
      lineOptions: {
        styles: [{ color: "#03790a", weight: 5 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [userLocation, storeLocation, map]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />; 
}

export default function StorePage() {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [directionTo, setDirectionTo] = useState(null);

  // Lấy vị trí user
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Không thể lấy vị trí: ", err);
        }
      );
    }
  }, []);

  return (
    <div className="store">
      <div className="store-container">
        <div className="store-header">
          <Typography className="store-title text-black">
            <MdOutlineLocationOn className="mr-2 size-10 text-green-300" />{" "}
            Partner Stores
          </Typography>
          <span style={{ color: "#838383" }}>
            Find stores near you that participate in the Back2Use program
          </span>
        </div>

        {/* Search */}
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

        <div className="store-content">
          {/* Bản đồ */}
          <div className="store-map">
            <MapContainer
              center={userLocation || [10.762622, 106.660172]}
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
              {mockStores.map((store) => {
                const storeCoords = [
                  10.762622 + store.id * 0.01,
                  106.660172,
                ];

                return (
                  <Marker
                    key={store.id}
                    position={storeCoords}
                    icon={
                      selectedStore === store.id ? selectedIcon : defaultIcon
                    }
                    eventHandlers={{
                      click: () => setSelectedStore(store.id),
                    }}
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
                          {/* 🟢 Chỉ đường */}
                          <Button
                            className="leaflet-popup-btn-derection"
                            onClick={() => setDirectionTo(storeCoords)}
                          >
                            <BiNavigation
                              style={{ marginRight: "10px", fontSize: "20px" }}
                            />{" "}
                            Derections
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
                );
              })}

              {/* 🟢 Vẽ tuyến đường */}
              {userLocation && directionTo && (
                <Routing
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
                    store.products.length > 2
                      ? store.products.length - 2
                      : 0;

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
              <Typography className="store-legend-title">
                Map Legend
              </Typography>
              <div className="store-legend-btn">
                <Typography className="store-legend-btn-info">
                  <div className="store-legend-btn-above"></div>
                  Partner Store
                </Typography>
                <Typography className="store-legend-btn-info">
                  <div className="store-legend-btn-below"></div>
                  Selected Store
                </Typography>
                <Typography className="store-legend-btn-info">
                  <div className="store-legend-btn-location"></div>
                  My location
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
