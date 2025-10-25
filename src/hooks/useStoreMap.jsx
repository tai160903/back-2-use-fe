import { useState } from "react";

export const useStoreMap = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [directionTo, setDirectionTo] = useState(null);

  // Hàm xử lý khi người dùng chọn store từ map
  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };

  // Hàm xử lý khi người dùng muốn điều hướng đến store
  const handleDirectionTo = (store) => {
    setDirectionTo(store);
  };

  // Reset map state
  const resetMapState = () => {
    setSelectedStore(null);
    setDirectionTo(null);
  };

  return {
    selectedStore,
    directionTo,
    handleStoreSelect,
    handleDirectionTo,
    resetMapState,
    setSelectedStore,
    setDirectionTo
  };
};
