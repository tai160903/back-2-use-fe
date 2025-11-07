// pages/Home/ListStore/ListStore.jsx
import Typography from "@mui/material/Typography";
import "./ListStore.css";

import MapView from "../../../components/MapView/MapView";
import { useNavigate } from "react-router-dom"; 
import { PATH } from "../../../routes/path";
import { FormControl, InputLabel, Select, MenuItem, Box, Pagination, Stack, TextField } from "@mui/material";
import { useStoreData } from "../../../hooks/useStoreData";
import { useStoreFilter } from "../../../hooks/useStoreFilter";
import { useStoreMap } from "../../../hooks/useStoreMap";



export default function ListStore() {
  const navigate = useNavigate();
  // Sử dụng các custom hooks
  const {
    userLocation,
    allStores,
    nearbyStores,
    selectedRadius,
    isLoadingNearby,
    error,
    handleRadiusChange
  } = useStoreData();

  const {
    currentPage,
    searchTerm,
    filteredStores,
    paginatedStores,
    totalPages,
    handleSearchChange,
    handlePageChange
  } = useStoreFilter(nearbyStores, 3);

  const {
    selectedStore,
    directionTo,
    setSelectedStore,
    setDirectionTo
  } = useStoreMap(); 
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const greeting = getGreeting();

  const handleStoreSelect = (store) => {
    // Set selectedStore để hiển thị trên map và mở popup
    setSelectedStore(store.id);
  };

  const handleStoreDetail = (store) => {
    // Navigate đến trang chi tiết store
    navigate(PATH.STOREDETAIL.replace(":id", store.id));
  };


  const getStoresForMap = () => {
    if (searchTerm.trim()) {
      return filteredStores;
    }
    return allStores;
  };

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
                userLocation={userLocation || [10.762621, 106.660172]} 
                stores={getStoresForMap()}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                directionTo={directionTo}
                setDirectionTo={setDirectionTo}
                onSelectStore={handleStoreDetail} 
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
                
                {/* Distance Selector và Search */}
                <Box sx={{ 
                  marginBottom: "16px", 
                  marginTop: "12px",
                  display: "flex",
                  gap: 2,
                  alignItems: "center"
                }}>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Khoảng cách</InputLabel>
                    <Select
                      value={selectedRadius}
                      label="Khoảng cách" 
                      onChange={handleRadiusChange}
                    >
                      <MenuItem value={1}>1 km</MenuItem>
                      <MenuItem value={3}>3 km</MenuItem>
                      <MenuItem value={5}>5 km</MenuItem>
                      <MenuItem value={10}>10 km</MenuItem>
                      <MenuItem value={15}>15 km</MenuItem>
                      <MenuItem value={20}>20 km</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    size="small"
                    placeholder="Tìm kiếm store..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ minWidth: 250 }}
                  />
                </Box>
                <div className="store-nearby-list">
                  {isLoadingNearby ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Typography>Loading nearby stores...</Typography>
                    </div>
                  ) : error ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                      <Typography>Error when loading data: {error}</Typography>
                    </div>
                  ) : filteredStores.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Typography>
                        {searchTerm.trim() 
                          ? `Không tìm thấy store nào với từ khóa "${searchTerm}"` 
                          : `No store found within ${selectedRadius}km`
                        }
                      </Typography>
                    </div>
                  ) : (
                    paginatedStores.map((store) => {
                    const visibleProducts = store.products.slice(0, 2);
                    const extraCount =
                      store.products.length > 2 ? store.products.length - 2 : 0;
                    return (
                      <div
                        key={store.id}
                        className="store-nearby-content"
                        style={{
                          border: selectedStore === store.id ? "2px solid #1b4d1b" : "1px solid #d3e6d3",
                          borderRadius: "8px",
                          padding: "12px",
                          marginBottom: "12px",
                          marginTop: "12px",
                          background: selectedStore === store.id ? "#e8f5e9" : "#f6faf6",
                          cursor: "pointer",
                          transition: "all 0.2s",
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
                              {store.distance ? `${store.distance.toFixed(1)} km` : "N/A"}
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
                
                {/* Pagination */}
                {filteredStores.length > 0 && totalPages > 1 && (
                  <Stack
                    spacing={2}
                    className="mt-3 mb-3"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      variant="outlined"
                      shape="rounded"
                      size="small"
                    />
                  </Stack>
                )}
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