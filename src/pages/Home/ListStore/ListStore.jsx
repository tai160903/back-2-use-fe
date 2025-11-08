// pages/Home/ListStore/ListStore.jsx
import Typography from "@mui/material/Typography";
import "./ListStore.css";

import MapView from "../../../components/MapView/MapView";
import { useNavigate } from "react-router-dom"; 
import { PATH } from "../../../routes/path";
import { Box, Pagination, Stack, TextField, Slider, InputAdornment, Divider, Popover, Button, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StraightenIcon from "@mui/icons-material/Straighten";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { useStoreData } from "../../../hooks/useStoreData";
import { useStoreFilter } from "../../../hooks/useStoreFilter";
import { useStoreMap } from "../../../hooks/useStoreMap";
import { useMemo, useState } from "react";



export default function ListStore() {
  const navigate = useNavigate();
  // Sử dụng các custom hooks
  const {
    userLocation,
    allStores,
    nearbyStores,
    isLoadingNearby,
    error
  } = useStoreData();

  const {
    currentPage,
    searchTerm,
    filteredStores,
    paginatedStores,
    totalPages,
    distanceRange,
    handleSearchChange,
    handlePageChange,
    handleDistanceRangeChange
  } = useStoreFilter(nearbyStores, 3);

  // Tính toán max distance từ nearbyStores để đặt max cho slider
  const maxDistance = useMemo(() => {
    if (!nearbyStores || nearbyStores.length === 0) return 100;
    const distances = nearbyStores.map(store => store.distance || 0).filter(d => d > 0);
    if (distances.length === 0) return 100;
    const max = Math.max(...distances);
    return Math.max(Math.ceil(max), 100);
  }, [nearbyStores]);

  const {
    selectedStore,
    directionTo,
    setSelectedStore,
    setDirectionTo
  } = useStoreMap(); 

  // Popover state cho distance filter
  const [distanceAnchorEl, setDistanceAnchorEl] = useState(null);
  const distanceOpen = Boolean(distanceAnchorEl);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const greeting = getGreeting();

  const handleDistanceClick = (event) => {
    setDistanceAnchorEl(event.currentTarget);
  };

  const handleDistanceClose = () => {
    setDistanceAnchorEl(null);
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store.id);
  };

  const handleStoreDetail = (store) => {
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
                  
                  {/* Filter Bar - Distance và Search */}
                  <Box sx={{ 
                    marginBottom: "16px", 
                    marginTop: "12px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}>
                    {/* Distance Filter Button với Popover */}
                    <Box>
                      <Button
                        onClick={handleDistanceClick}
                        variant="outlined"
                        sx={{
                          minWidth: "200px",
                          height: "48px",
                          padding: "8px 16px",
                          borderColor: distanceOpen ? "#2196f3" : "rgba(0, 0, 0, 0.23)",
                          borderWidth: distanceOpen ? "2px" : "1px",
                          borderRadius: "8px",
                          textTransform: "none",
                          color: "#333",
                          backgroundColor: "#fff",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "8px",
                          '&:hover': {
                            borderColor: distanceOpen ? "#2196f3" : "rgba(0, 0, 0, 0.4)",
                            borderWidth: "2px",
                            backgroundColor: "#fff",
                          },
                          boxShadow: distanceOpen ? "0 0 0 2px rgba(33, 150, 243, 0.1)" : "none",
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: "11px",
                              color: "#666",
                              lineHeight: 1.2,
                              marginBottom: "2px"
                            }}
                          >
                            Khoảng cách
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#000",
                              lineHeight: 1.2
                            }}
                          >
                            {distanceRange[0]} km – {distanceRange[1] === maxDistance ? `${distanceRange[1]}+` : `${distanceRange[1]}`} km
                          </Typography>
                        </Box>
                        <KeyboardArrowDownIcon 
                          sx={{ 
                            fontSize: "20px",
                            color: "#666",
                            transform: distanceOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease"
                          }} 
                        />
                      </Button>

                      <Popover
                        open={distanceOpen}
                        anchorEl={distanceAnchorEl}
                        onClose={handleDistanceClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        disableAutoFocus
                        disableEnforceFocus
                        PaperProps={{
                          sx: {
                            marginTop: "4px",
                            borderRadius: "0px",
                            boxShadow: "none",
                            border: "none",
                            minWidth: "400px",
                            maxWidth: "500px",
                            padding: "0px",
                            backgroundColor: "transparent",
                          }
                        }}
                      >
                        <Box sx={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                          border: "1px solid rgba(0, 0, 0, 0.1)",
                          padding: "24px",
                          marginTop: "4px"
                        }}>
                          {/* Header trong Popover */}
                          <Box sx={{ marginBottom: "24px" }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontSize: "12px",
                                color: "#666",
                                display: "block",
                                marginBottom: "4px"
                              }}
                            >
                              Khoảng cách
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#000",
                                lineHeight: 1.2,
                                letterSpacing: "-0.5px"
                              }}
                            >
                              {distanceRange[0]} km – {distanceRange[1] === maxDistance ? `${distanceRange[1]}+` : `${distanceRange[1]}`} km
                            </Typography>
                          </Box>

                          {/* Slider trong Popover */}
                          <Box sx={{ padding: "0 4px" }}>
                            <Slider
                              value={distanceRange}
                              onChange={(e, newValue) => handleDistanceRangeChange(newValue)}
                              valueLabelDisplay="off"
                              min={0}
                              max={maxDistance}
                              step={1}
                              sx={{
                                color: '#000',
                                padding: '20px 0',
                                '& .MuiSlider-thumb': {
                                  width: 20,
                                  height: 20,
                                  backgroundColor: '#fff',
                                  border: '2px solid #000',
                                  borderRadius: '2px',
                                  boxShadow: 'none',
                                  '&:hover': {
                                    boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.08)',
                                  },
                                  '&.Mui-focusVisible': {
                                    boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.08)',
                                  },
                                },
                                '& .MuiSlider-track': {
                                  height: 3,
                                  backgroundColor: '#000',
                                  border: 'none',
                                },
                                '& .MuiSlider-rail': {
                                  height: 3,
                                  backgroundColor: '#e0e0e0',
                                  opacity: 1,
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </Popover>
                    </Box>

                    {/* Search Input */}
                    <TextField
                      size="medium"
                      placeholder="Tìm kiếm store..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#666", fontSize: "20px" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        flex: "1 1 200px",
                        minWidth: "200px",
                        '& .MuiOutlinedInput-root': {
                          height: "48px",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          '& fieldset': {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          '&:hover fieldset': {
                            borderColor: "rgba(0, 0, 0, 0.4)",
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: "#2196f3",
                            borderWidth: "2px",
                          },
                        },
                        '& .MuiInputBase-input': {
                          fontSize: "15px",
                          padding: "12px 14px",
                        },
                      }}
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
                          : `Không tìm thấy store nào trong khoảng ${distanceRange[0]} - ${distanceRange[1]} km`
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
      </div>
    </>
  );
}