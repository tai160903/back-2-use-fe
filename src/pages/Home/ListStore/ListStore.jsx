// pages/Home/ListStore/ListStore.jsx
import Typography from "@mui/material/Typography";
import "./ListStore.css";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { IoIosSearch } from "react-icons/io";
import MenuItem from "@mui/material/MenuItem";
import storeImg1 from "../../../assets/image/item1.jpg";
import storeImg2 from "../../../assets/image/item2.jpg";
import storeImg3 from "../../../assets/image/item3.png";
import { useEffect, useState } from "react";
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
    image: storeImg1,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Eco Coffee Shop",
    address: "456 River Rd, Uptown, City 67890",
    coords: [10.768, 106.673],
    products: ["cup"],
    daily: "9AM - 8PM",
    image: storeImg2,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Urban Reuse Hub",
    address: "33 Nguyen Hue Blvd, District 1, HCMC",
    coords: [10.775, 106.702],
    products: ["container", "bottle"],
    daily: "8AM - 9PM",
    image: storeImg3,
    rating: 4.9,
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

export default function ListStore() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState([10.762621, 106.660172]);
  const [searchQuery, setSearchQuery] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(Infinity);
  const [filteredStores, setFilteredStores] = useState(mockStores);
  const [selectedStore, setSelectedStore] = useState(null);
  const [directionTo, setDirectionTo] = useState(null);
  const [maxDistanceOpt, setMaxDistanceOpt] = useState("Any");
  const [ratingFilter, setRatingFilter] = useState("Any");
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const greeting = getGreeting();

 const handleStoreSelect = (store) => {
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
      )
      .filter((store) => (ratingFilter === "Any" ? true : store.rating >= parseFloat(ratingFilter)));
    setFilteredStores(stores);
  }, [searchQuery, distanceFilter, ratingFilter, userLocation]);

  return (
    <>
      <div className="list-store">
        <div className="list-store-banner">
          <div className="list-store-banner-text">
            <Typography
              component="div"
              gutterBottom
              className="list-store-banner-btn"
            >
              {greeting}
            </Typography>
            <Typography className="list-store-banner-title" variant="h3">
              Find stores near you
            </Typography>
            <Typography className="list-store-banner-desc" variant="body2">
              Search for stores participating in the Back2Use reusable packaging
              program
            </Typography>
          </div>
        </div>

        <div className="list-store-content">
          <div
            className="store-content"
            style={{ padding: "0 100px", marginTop: "50px" }}
          >
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

            <div className="store-rightInfo">
              <div className="store-nearby">
                <div className="store-nearby-title">
                  <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                    Nearby Stores
                  </Typography>
                  <span>Click on map markers to view details</span>
                </div>
                {/* Filters and search inside Nearby box */}
                <div className="nearby-controls">
                  <div className="filter-bar inside">
                    <div className="filters-left">
                      <TextField
                        className="filter-select"
                        select
                        label="Rating"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        size="small"
                      >
                        {['Any','3','4','4.5','5'].map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt === 'Any' ? 'Any rating' : `${opt}+ stars`}</MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        className="filter-select"
                        select
                        label="Max Distance"
                        value={maxDistanceOpt}
                        onChange={(e) => {
                          const v = e.target.value;
                          setMaxDistanceOpt(v);
                          if (v === 'Any') setDistanceFilter(Infinity);
                          else if (v === '1 km') setDistanceFilter(1);
                          else if (v === '2 km') setDistanceFilter(2);
                          else if (v === '5 km') setDistanceFilter(5);
                        }}
                        size="small"
                      >
                        {['Any','1 km','2 km','5 km'].map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>

                  <div className="nearby-search">
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
                        size: 'small'
                      }}
                    />
                  </div>
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
                          display: "flex",
                          gap: "12px"
                        }}
                        onClick={() => handleStoreSelect(store)} 
                      >
                        <img
                          src={store.image}
                          alt={store.name}
                          className="store-card-thumb"
                          style={{ width: "120px", height: "84px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <div className="store-nearby-content-left" style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
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

              {/* Legend */}
              <div className="store-legend">
                <Typography className="store-legend-title">
                  Map Legend
                </Typography>
                <div className="store-legend-btn">
                  <Typography className="store-legend-btn-info">
                    <div className="store-legend-btn-above"></div> Partner Store
                  </Typography>
                  <Typography className="store-legend-btn-info">
                    <div className="store-legend-btn-below"></div> Selected
                    Store
                  </Typography>
                  <Typography className="store-legend-btn-info">
                    <div className="store-legend-btn-location"></div> My
                    location
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}