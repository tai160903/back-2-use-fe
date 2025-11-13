// pages/Home/ListStore/ListStore.jsx
import Typography from "@mui/material/Typography";
import "./ListStore.css";

import MapView from "../../../components/MapView/MapView";
import { useNavigate } from "react-router-dom"; 
import { PATH } from "../../../routes/path";
import { Box, Pagination, Stack, TextField, Slider, InputAdornment, Popover, Button, Paper, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useStoreData } from "../../../hooks/useStoreData";
import { useStoreFilter } from "../../../hooks/useStoreFilter";
import { useStoreMap } from "../../../hooks/useStoreMap";
import { useMemo, useState } from "react";
import { FaStore, FaMapMarkerAlt } from "react-icons/fa";

export default function ListStore() {
  const navigate = useNavigate();
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
  } = useStoreFilter(nearbyStores, 6);

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

  const [distanceAnchorEl, setDistanceAnchorEl] = useState(null);
  const distanceOpen = Boolean(distanceAnchorEl);
  
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
    return nearbyStores.length > 0 ? nearbyStores : allStores;
  };

  return (
    <div className="list-store-new">
      {/* Compact Header */}
      <div className="list-store-header">
        <div className="list-store-header-content">
          <Typography variant="h4" className="list-store-header-title">
            Find Nearby Stores
          </Typography>
          <Typography variant="body2" className="list-store-header-subtitle">
            Discover partner stores participating in the Back2Use reusable packaging program
          </Typography>
        </div>
        {nearbyStores.length > 0 && (
          <Paper elevation={0} className="list-store-stats">
            <Box className="stat-item">
              <Box className="stat-icon-wrapper">
                <FaStore className="stat-icon" />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h6" className="stat-number">
                  {nearbyStores.length}
                </Typography>
                <Typography variant="caption" className="stat-label">
                  Stores Found
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </div>

      {/* Main Content */}
      <div className="list-store-main">
        <div className="list-store-container">
          {/* Stores List - Prominent */}
          <div className="stores-list-section">
            <div className="stores-list-header">
              <Typography variant="h6" className="stores-list-title">
                <FaMapMarkerAlt style={{ marginRight: '8px', color: '#16a34a' }} />
                Nearby Stores
              </Typography>
              <Typography variant="caption" className="stores-list-subtitle">
                Click on a store or map marker to view details
              </Typography>
            </div>
            
            {/* Search and Filter */}
            <Box className="stores-filter-bar">
              <TextField
                size="small"
                placeholder="Search stores..."
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
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  },
                }}
              />
              
              <Button
                onClick={handleDistanceClick}
                variant="outlined"
                size="small"
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  minWidth: "140px",
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                {distanceRange[0]} - {distanceRange[1] === maxDistance ? `${distanceRange[1]}+` : distanceRange[1]} km
              </Button>

              <Popover
                open={distanceOpen}
                anchorEl={distanceAnchorEl}
                onClose={handleDistanceClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <Box sx={{ p: 3, minWidth: 300 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Distance Range
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                    {distanceRange[0]} km – {distanceRange[1] === maxDistance ? `${distanceRange[1]}+` : `${distanceRange[1]}`} km
                  </Typography>
                  <Slider
                    value={distanceRange}
                    onChange={(e, newValue) => handleDistanceRangeChange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxDistance}
                    step={1}
                    sx={{
                      color: '#16a34a',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#16a34a',
                      },
                    }}
                  />
                </Box>
              </Popover>
            </Box>
            
            {/* Stores List */}
            <div className="stores-list">
              {isLoadingNearby ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">Loading nearby stores...</Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="error">Error loading stores: {error}</Typography>
                </Box>
              ) : filteredStores.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm.trim() 
                      ? `No stores found matching "${searchTerm}"` 
                      : `No stores found within ${distanceRange[0]} - ${distanceRange[1]} km`
                    }
                  </Typography>
                </Box>
              ) : (
                paginatedStores.map((store) => {
                  const visibleProducts = store.products?.slice(0, 3) || [];
                  const extraCount = store.products?.length > 3 ? store.products.length - 3 : 0;
                  return (
                    <Paper
                      key={store.id}
                      elevation={selectedStore === store.id ? 4 : 1}
                      className={`store-card ${selectedStore === store.id ? 'selected' : ''}`}
                      onClick={() => handleStoreSelect(store)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                        border: '2px solid',
                        borderColor: selectedStore === store.id ? '#16a34a' : '#e5e7eb',
                        position: 'relative',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)',
                          borderColor: '#16a34a',
                        }
                      }}
                    >
                      <Box className="store-card-content">
                        {store.image && (
                          <img
                            src={store.image}
                            alt={store.name}
                            className="store-card-image"
                          />
                        )}
                        <Box className="store-card-info" sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" className="store-card-name">
                              {store.name}
                            </Typography>
                            {store.distance && (
                              <Chip 
                                label={`${store.distance.toFixed(1)} km`}
                                size="small"
                                sx={{
                                  backgroundColor: '#dcfce7',
                                  color: '#15803d',
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '13px' }}>
                            <LocationOnIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {store.address}
                          </Typography>
                          {visibleProducts.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {visibleProducts.map((prod, i) => (
                                <Chip
                                  key={i}
                                  label={prod}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#16a34a',
                                    color: '#fff',
                                    fontSize: '11px',
                                    height: '22px',
                                  }}
                                />
                              ))}
                              {extraCount > 0 && (
                                <Chip
                                  label={`+${extraCount}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#16a34a',
                                    color: '#fff',
                                    fontSize: '11px',
                                    height: '22px',
                                  }}
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  );
                })
              )}
            </div>
            
             {/* Pagination */}
             {filteredStores.length > 0 && totalPages > 1 && (
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                 <Pagination
                   count={totalPages}
                   page={currentPage}
                   onChange={handlePageChange}
                   color="primary"
                   sx={{
                     '& .MuiPaginationItem-root.Mui-selected': {
                       backgroundColor: '#16a34a',
                     },
                   }}
                 />
               </Stack>
             )}

             {/* Map Legend - Moved below stores list */}
             <Paper elevation={0} className="map-legend" sx={{ mt: 3 }}>
               <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                 Map Legend
               </Typography>
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Box className="legend-dot partner" />
                   <Typography variant="caption">Partner Store</Typography>
                 </Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Box className="legend-dot selected" />
                   <Typography variant="caption">Selected Store</Typography>
                 </Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Box className="legend-dot location" />
                   <Typography variant="caption">Your Location</Typography>
                 </Box>
               </Box>
             </Paper>
           </div>

           {/* Map Section */}
           <div className="map-section">
             <div className="map-container">
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
           </div>
        </div>
      </div>
    </div>
  );
}
