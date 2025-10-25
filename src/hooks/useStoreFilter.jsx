import { useState, useMemo } from "react";

export const useStoreFilter = (stores, itemsPerPage = 3) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("Any");
  const [distanceFilter, setDistanceFilter] = useState(Infinity);

  // Logic filter stores theo search term và các filter khác
  const getFilteredStores = useMemo(() => {
    let filtered = stores;

    // Filter theo search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.businessType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter theo rating
    if (ratingFilter !== "Any") {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(store => store.rating >= minRating);
    }

    // Filter theo distance
    if (distanceFilter !== Infinity) {
      filtered = filtered.filter(store => 
        store.distance && store.distance <= distanceFilter
      );
    }

    return filtered;
  }, [stores, searchTerm, ratingFilter, distanceFilter]);

  // Logic phân trang
  const getPaginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return getFilteredStores.slice(startIndex, endIndex);
  }, [getFilteredStores, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(getFilteredStores.length / itemsPerPage);

  // Hàm xử lý khi người dùng search
  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); 
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Hàm xử lý khi thay đổi filter
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1); // Reset về trang đầu khi filter thay đổi
    
    switch (filterType) {
      case 'rating':
        setRatingFilter(value);
        break;
      case 'distance':
        setDistanceFilter(value === 'Any' ? Infinity : value);
        break;
      default:
        break;
    }
  };

  // Reset tất cả filters
  const resetFilters = () => {
    setSearchTerm("");
    setRatingFilter("Any");
    setDistanceFilter(Infinity);
    setCurrentPage(1);
  };

  return {
    // State
    currentPage,
    searchTerm,
    ratingFilter,
    distanceFilter,
    
    // Computed values
    filteredStores: getFilteredStores,
    paginatedStores: getPaginatedStores,
    totalPages,
    
    // Handlers
    handleSearchChange,
    handlePageChange,
    handleFilterChange,
    resetFilters,
    
    // Setters
    setCurrentPage,
    setSearchTerm,
    setRatingFilter,
    setDistanceFilter
  };
};
