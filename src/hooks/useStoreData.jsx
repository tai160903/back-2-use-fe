import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStoreApi, getNearbyStores } from "../store/slices/storeSilce";

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

// Transform store data từ API
const transformStoreData = (apiStores) => {
 
  return apiStores.map(store => ({
    id: store._id,
    name: store.businessName,
    address: store.businessAddress,
    coords: store.location?.coordinates ? [store.location.coordinates[1], store.location.coordinates[0]] : [10.762621, 106.660172], 
    daily: `${store.openTime || '08:00'} - ${store.closeTime || '22:00'}`,
    image: store.businessLogoUrl,
    phone: store.businessPhone,
    isActive: store.isActive,
    businessType: store.businessType,
  }));
};

export const useStoreData = () => {
  const dispatch = useDispatch();
  const { allStores: storeAllStores, nearbyStores: storeNearbyStores, isLoadingNearby, error } = useSelector((state) => state.store);
  
  const [userLocation, setUserLocation] = useState(null);
  const [allStores, setAllStores] = useState([]); 
  const [nearbyStores, setNearbyStores] = useState([]);

  // Load tất cả stores cho map
  useEffect(() => {
    dispatch(getAllStoreApi());
  }, [dispatch]);

  // Lấy vị trí user
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLocation = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(newLocation);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  // Load tất cả nearby stores (không filter theo radius, lấy tất cả)
  useEffect(() => {
    if (!userLocation) {
      return;
    }
    
    // Gọi API với radius rất lớn (3000km) để lấy tất cả stores gần đó
    const radiusInMeters = 3000 * 1000; // 3000km = 3,000,000 mét 
    
    dispatch(getNearbyStores({
      latitude: userLocation[0],
      longitude: userLocation[1],
      radius: radiusInMeters,
      page: 1,
      limit: 1000 
    }));
  }, [dispatch, userLocation]);

  // Cập nhật allStores cho map
  useEffect(() => {
    if (!storeAllStores || !storeAllStores.length) return;
    
    const transformedStores = transformStoreData(storeAllStores);
    
    // Nếu chưa có vị trí user, chỉ set stores không có distance
    if (!userLocation) {
      setAllStores(transformedStores);
      return;
    }
    
    let storesWithDistance = transformedStores.map((store) => ({
      ...store,
      distance: calculateDistance(
        userLocation[0],
        userLocation[1],
        store.coords[0],
        store.coords[1]
      ),
    }));
    
    // Sắp xếp theo khoảng cách từ gần đến xa
    storesWithDistance.sort((a, b) => {
      const distA = a.distance || Infinity;
      const distB = b.distance || Infinity;
      return distA - distB;
    });
    
    setAllStores(storesWithDistance);
  }, [storeAllStores, userLocation]);

  // Cập nhật nearbyStores cho danh sách - sắp xếp theo khoảng cách
  useEffect(() => {
    if (!storeNearbyStores || !storeNearbyStores.length) {
      setNearbyStores([]);
      return;
    }
    
    const transformedStores = transformStoreData(storeNearbyStores);
    
    // Nếu chưa có vị trí user, chỉ set stores không có distance
    if (!userLocation) {
      setNearbyStores(transformedStores);
      return;
    }
    
    let storesWithDistance = transformedStores.map((store) => ({
      ...store,
      distance: calculateDistance(
        userLocation[0],
        userLocation[1],
        store.coords[0],
        store.coords[1]
      ),
    }));
    
    // Sắp xếp theo khoảng cách từ gần đến xa
    storesWithDistance.sort((a, b) => {
      const distA = a.distance || Infinity;
      const distB = b.distance || Infinity;
      return distA - distB;
    });
    
    setNearbyStores(storesWithDistance);
  }, [storeNearbyStores, userLocation]);

  return {
    userLocation,
    allStores,
    nearbyStores,
    isLoadingNearby,
    error,
    calculateDistance
  };
};
