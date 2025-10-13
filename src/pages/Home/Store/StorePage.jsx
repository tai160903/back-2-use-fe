// pages/Home/Store/StorePage.jsx
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import "./StorePage.css";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import MapView from "../../../components/MapView/MapView";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";

// Mock data chung
const mockStores = [
  {
    id: 1,
    name: "Green Café Downtown",
    address: "1262 Kha Vạn Cân, Thủ Đức, TP.HCM",
    coords: [10.8565, 106.7709],
    products: ["cup", "container", "bottle"],
    daily: "9AM - 8PM",
  },
  {
    id: 2,
    name: "Eco Coffee Shop",
    address: "456 River Rd, Uptown, City 67890",
    coords: [10.768, 106.673],
    products: ["cup"],
    daily: "9AM - 8PM",
  },
];

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

export default function StorePage() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState([10.762621, 106.660172]);
  const [searchQuery, setSearchQuery] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(Infinity);
  const [filteredStores, setFilteredStores] = useState(mockStores);
  const [selectedStore, setSelectedStore] = useState(null);
  const [directionTo, setDirectionTo] = useState(null);

const handleStoreSelect = (store) => {
  console.log("Navigating to:", `${PATH.STOREDETAIL}/${store.id}`); // Debug
 navigate(PATH.STOREDETAIL.replace(":id", store.id));
};

  // Lấy vị trí user
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err)
    );
  }, []);

  // Cập nhật filteredStores
  useEffect(() => {
    let stores = mockStores
      .map((store) => ({
        ...store,
        distance: calculateDistance(
          userLocation[0],
          userLocation[1],
          store.coords[0],
          store.coords[1]
        ),
      }))
      .filter((store) => store.distance < distanceFilter)
      .filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredStores(stores);
  }, [searchQuery, distanceFilter, userLocation]);

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
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoIosSearch size={20} color="#666" />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Filter buttons */}
        <div
          className="filter-buttons"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "20px 0",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setDistanceFilter(Infinity)}
          >
            Tất cả
          </Button>
          <Button variant="contained" onClick={() => setDistanceFilter(1)}>
            Dưới 1km
          </Button>
          <Button variant="contained" onClick={() => setDistanceFilter(2)}>
            Dưới 2km
          </Button>
          <Button variant="contained" onClick={() => setDistanceFilter(5)}>
            Dưới 5km
          </Button>
        </div>

        {/* Content */}
        <div className="store-content">
          {/* Map */}
          <div className="store-map">
            <MapView
              userLocation={userLocation}
              stores={filteredStores}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              directionTo={directionTo}
              setDirectionTo={setDirectionTo}
              onSelectStore={handleStoreSelect} 
            />
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
              <div className="store-nearby-list">
                {filteredStores.map((store) => {
                  const visibleProducts = store.products.slice(0, 2);
                  const extraCount =
                    store.products.length > 2 ? store.products.length - 2 : 0;
                  return (
                    <div
                      key={store.id}
                      className="store-nearby-content"
                      style={{
                        border: "1px solid #d3e6d3",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "12px",
                        marginTop: "12px",
                        background: "#f6faf6",
                        cursor: "pointer", 
                        transition: "background 0.2s", 
                      }}
                      onClick={() => handleStoreSelect(store)}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#e8f5e8")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "#f6faf6")
                      }
                    >
                      <div className="store-nearby-content-left">
                        <div
                          style={{ display: "flex", justifyContent: "space-between" }}
                        >
                          <Typography
                            className="store-nearby-content-name"
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
                            {store.distance?.toFixed(1)} km
                          </div>
                        </div>
                        <span
                          className="store-nearby-content-des"
                          style={{ fontSize: "14px", color: "#777" }}
                        >
                          {store.address}
                        </span>
                        <div
                          className="store-nearby-product"
                          style={{ marginTop: "8px", display: "flex", gap: "6px" }}
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

            {/* Legend */}
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