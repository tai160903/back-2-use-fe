// pages/Home/ListStore/ListStore.jsx
import Typography from "@mui/material/Typography";
import "./ListStore.css";

import storeImg1 from "../../../assets/image/item1.jpg";
import { useEffect, useState } from "react";
import MapView from "../../../components/MapView/MapView";
import { useNavigate } from "react-router-dom"; 
import { PATH } from "../../../routes/path";
import { useDispatch, useSelector } from "react-redux";
import { getAllStoreApi } from "../../../store/slices/storeSilce";

// Hàm chuyển đổi dữ liệu từ API sang format phù hợp
const transformStoreData = (apiStores) => {
  return apiStores.map(store => ({
    id: store._id,
    name: store.businessName,
    address: store.businessAddress,
    coords: store.location?.coordinates ? [store.location.coordinates[1], store.location.coordinates[0]] : [10.762621, 106.660172], // [lat, lng]
    products: ["cup", "container", "bottle"], // Default products
    daily: `${store.openTime || '08:00'} - ${store.closeTime || '22:00'}`,
    image: store.businessLogoUrl || storeImg1,
    rating: 4.5, // Default rating
    businessType: store.businessType,
    phone: store.businessPhone,
    isActive: store.isActive
  }));
};

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
  const dispatch = useDispatch();
  const { stores, isLoading, error } = useSelector((state) => state.store);
  
  useEffect(() => {
    dispatch(getAllStoreApi());
  }, [dispatch]);
  
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState([10.762621, 106.660172]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [directionTo, setDirectionTo] = useState(null);
  
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

  // Cập nhật stores với khoảng cách
  useEffect(() => {
    if (!stores || !stores.length) return;
    
    const transformedStores = transformStoreData(stores);
    
    let storesWithDistance = transformedStores.map((store) => ({
      ...store,
      distance: calculateDistance(
        userLocation[0],
        userLocation[1],
        store.coords[0],
        store.coords[1]
      ),
    }));
    
    setFilteredStores(storesWithDistance);
  }, [userLocation, stores]);

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
                <div className="store-nearby-list">
                  {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Typography>Loading...</Typography>
                    </div>
                  ) : error ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                      <Typography>Error when loading data: {error}</Typography>
                    </div>
                  ) : filteredStores.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Typography>No store found</Typography>
                    </div>
                  ) : (
                    filteredStores.map((store) => {
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
                  })
                  )}
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