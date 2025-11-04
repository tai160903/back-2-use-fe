import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import './AddressSelector.css';

// Fallback data cho provinces (sử dụng khi API không hoạt động)
const FALLBACK_PROVINCES = [
  { code: 1, name: 'Hà Nội' },
  { code: 79, name: 'TP. Hồ Chí Minh' },
  { code: 31, name: 'Hải Phòng' },
  { code: 48, name: 'Đà Nẵng' },
  { code: 92, name: 'Cần Thơ' },
  { code: 24, name: 'Hà Giang' },
  { code: 28, name: 'Tuyên Quang' },
  { code: 26, name: 'Lào Cai' },
  { code: 27, name: 'Điện Biên' },
  { code: 25, name: 'Lai Châu' },
  { code: 29, name: 'Sơn La' },
  { code: 30, name: 'Yên Bái' },
  { code: 32, name: 'Hoà Bình' },
  { code: 33, name: 'Thái Nguyên' },
  { code: 34, name: 'Lạng Sơn' },
  { code: 35, name: 'Quảng Ninh' },
  { code: 36, name: 'Bắc Giang' },
  { code: 37, name: 'Phú Thọ' },
  { code: 38, name: 'Vĩnh Phúc' },
  { code: 39, name: 'Bắc Ninh' },
  { code: 40, name: 'Hải Dương' },
  { code: 41, name: 'Hưng Yên' },
  { code: 42, name: 'Thái Bình' },
  { code: 43, name: 'Hà Nam' },
  { code: 44, name: 'Nam Định' },
  { code: 45, name: 'Ninh Bình' },
  { code: 46, name: 'Thanh Hóa' },
  { code: 47, name: 'Nghệ An' },
  { code: 49, name: 'Quảng Bình' },
  { code: 50, name: 'Quảng Trị' },
  { code: 51, name: 'Thừa Thiên Huế' },
  { code: 52, name: 'Quảng Nam' },
  { code: 53, name: 'Quảng Ngãi' },
  { code: 54, name: 'Bình Định' },
  { code: 55, name: 'Phú Yên' },
  { code: 56, name: 'Khánh Hòa' },
  { code: 57, name: 'Ninh Thuận' },
  { code: 58, name: 'Bình Thuận' },
  { code: 59, name: 'Kon Tum' },
  { code: 60, name: 'Gia Lai' },
  { code: 61, name: 'Đắk Lắk' },
  { code: 62, name: 'Đắk Nông' },
  { code: 63, name: 'Lâm Đồng' },
  { code: 64, name: 'Bình Phước' },
  { code: 65, name: 'Tây Ninh' },
  { code: 66, name: 'Bình Dương' },
  { code: 67, name: 'Đồng Nai' },
  { code: 68, name: 'Bà Rịa - Vũng Tàu' },
  { code: 69, name: 'Long An' },
  { code: 70, name: 'Tiền Giang' },
  { code: 71, name: 'Bến Tre' },
  { code: 72, name: 'Trà Vinh' },
  { code: 73, name: 'Vĩnh Long' },
  { code: 74, name: 'Đồng Tháp' },
  { code: 75, name: 'An Giang' },
  { code: 76, name: 'Kiên Giang' },
  { code: 77, name: 'Cà Mau' },
  { code: 78, name: 'Bạc Liêu' },
  { code: 80, name: 'Hậu Giang' }
];

const AddressSelector = ({ onAddressSelect }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  
  // Manual input khi API không hoạt động
  const [manualDistrict, setManualDistrict] = useState('');
  const [manualWard, setManualWard] = useState('');

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Hàm fetch với nhiều fallback URLs và timeout
  const fetchWithFallback = async (urls, timeout = 5000) => {
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          signal: controller.signal,
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          }
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch {
        // Tiếp tục thử URL tiếp theo
        continue;
      }
    }
    throw new Error('Tất cả các nguồn dữ liệu đều không khả dụng');
  };

  // Load danh sách tỉnh/thành phố với nhiều fallback
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true);
        
        // Danh sách các API URLs để thử (fallback chain)
        // Có thể thêm nhiều URLs backup ở đây
        const apiUrls = [
          'https://provinces.open-api.vn/api/p/',
          // Có thể thêm các URLs backup khác, ví dụ:
          // 'https://vietnam-administrative-divisions-api.vercel.app/api/provinces',
        ];
        
        const data = await fetchWithFallback(apiUrls, 5000);
        
        if (Array.isArray(data) && data.length > 0) {
          setProvinces(data);
          console.log('✓ Đã tải danh sách tỉnh/thành phố từ API');
        } else {
          throw new Error('Dữ liệu không hợp lệ');
        }
      } catch {
        // Nếu tất cả API đều fail, sử dụng fallback data
        console.warn('⚠ Không thể kết nối API, sử dụng dữ liệu mặc định');
        setProvinces(FALLBACK_PROVINCES);
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load danh sách quận/huyện khi chọn tỉnh với fallback
  useEffect(() => {
    if (selectedProvince) {
      const loadDistricts = async () => {
        try {
          setLoadingDistricts(true);
          
          const apiUrls = [
            `https://provinces.open-api.vn/api/p/`,
            // Có thể thêm các URLs backup khác ở đây
          ];
          
          const data = await fetchWithFallback(apiUrls, 5000);
          setDistricts(data.districts || []);
          
          if (data.districts && data.districts.length > 0) {
            console.log(`✓ Đã tải ${data.districts.length} quận/huyện`);
          }
        } catch {
          console.warn('⚠ Không thể tải quận/huyện, vui lòng nhập thủ công');
          setDistricts([]);
        } finally {
          setLoadingDistricts(false);
        }
      };

      loadDistricts();
      // Reset district và ward khi chọn tỉnh mới
      setSelectedDistrict('');
      setSelectedWard('');
      setWards([]);
      setManualDistrict('');
      setManualWard('');
    }
  }, [selectedProvince]);

  // Load danh sách phường/xã khi chọn quận/huyện với fallback
  useEffect(() => {
    if (selectedDistrict) {
      const loadWards = async () => {
        try {
          setLoadingWards(true);
          
          const apiUrls = [
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`,
            // Có thể thêm các URLs backup khác ở đây
          ];
          
          const data = await fetchWithFallback(apiUrls, 5000);
          setWards(data.wards || []);
          
          if (data.wards && data.wards.length > 0) {
            console.log(`✓ Đã tải ${data.wards.length} phường/xã`);
          }
        } catch {
          console.warn('⚠ Không thể tải phường/xã, vui lòng nhập thủ công');
          setWards([]);
        } finally {
          setLoadingWards(false);
        }
      };

      loadWards();
      // Reset ward khi chọn district mới
      setSelectedWard('');
      setManualWard('');
    }
  }, [selectedDistrict]);

  // Cập nhật địa chỉ đầy đủ khi có thay đổi (hỗ trợ cả manual input)
  useEffect(() => {
    const provinceName = provinces.find(p => p.code === selectedProvince)?.name || '';
    
    // Sử dụng manual input nếu không có data từ API
    const districtName = districts.length > 0 && selectedDistrict
      ? districts.find(d => d.code === selectedDistrict)?.name || ''
      : manualDistrict;
    
    const wardName = wards.length > 0 && selectedWard
      ? wards.find(w => w.code === selectedWard)?.name || ''
      : manualWard;
    
    // Chỉ cập nhật khi có đủ thông tin
    if (selectedProvince && (districtName || selectedDistrict) && (wardName || selectedWard) && streetAddress) {
      const fullAddress = `${streetAddress}, ${wardName || ''}, ${districtName || ''}, ${provinceName}`.replace(/^,\s*/, '').replace(/,\s*,/g, ',').replace(/,\s*$/, '');
      onAddressSelect(fullAddress, {
        province: provinceName,
        district: districtName,
        ward: wardName,
        street: streetAddress
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard, streetAddress, manualDistrict, manualWard, provinces, districts, wards, onAddressSelect]);

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
  };

  const handleStreetChange = (event) => {
    setStreetAddress(event.target.value);
  };

  const handleManualDistrictChange = (event) => {
    setManualDistrict(event.target.value);
    setSelectedDistrict(''); // Reset selected district khi nhập thủ công
  };

  const handleManualWardChange = (event) => {
    setManualWard(event.target.value);
    setSelectedWard(''); // Reset selected ward khi nhập thủ công
  };

  return (
    <div className="address-selector-container">

      <div className="address-selector-form">
        {/* Province/City */}
        <FormControl className="address-selector-field" variant="outlined" size="small">
          <InputLabel>Province/City *</InputLabel>
          <Select
            value={selectedProvince}
            onChange={handleProvinceChange}
            label="Province/City *"
            disabled={loadingProvinces}
          >
            {provinces.map((province) => (
              <MenuItem key={province.code} value={province.code}>
                {province.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* District - Hiển thị Select hoặc TextField tùy vào data */}
        {districts.length > 0 ? (
          <FormControl className="address-selector-field" variant="outlined" size="small">
            <InputLabel>District *</InputLabel>
            <Select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              label="District *"
              disabled={!selectedProvince || loadingDistricts}
            >
              {districts.map((district) => (
                <MenuItem key={district.code} value={district.code}>
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : selectedProvince && !loadingDistricts ? (
          <TextField
            className="address-selector-field"
            label="District *"
            variant="outlined"
            value={manualDistrict}
            onChange={handleManualDistrictChange}
            placeholder="Nhập quận/huyện"
            size="small"
            helperText="Vui lòng nhập thủ công (API không khả dụng)"
          />
        ) : null}

        {/* Ward - Hiển thị Select hoặc TextField tùy vào data */}
        {wards.length > 0 ? (
          <FormControl className="address-selector-field" variant="outlined" size="small">
            <InputLabel>Ward *</InputLabel>
            <Select
              value={selectedWard}
              onChange={handleWardChange}
              label="Ward *"
              disabled={!selectedDistrict || loadingWards}
            >
              {wards.map((ward) => (
                <MenuItem key={ward.code} value={ward.code}>
                  {ward.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (selectedDistrict || manualDistrict) && !loadingWards ? (
          <TextField
            className="address-selector-field"
            label="Ward *"
            variant="outlined"
            value={manualWard}
            onChange={handleManualWardChange}
            placeholder="Nhập phường/xã"
            size="small"
            helperText="Vui lòng nhập thủ công (API không khả dụng)"
          />
        ) : null}

        {/* Street Address */}
        <TextField
          className="address-selector-field address-street-field"
          label="Street Address *"
          variant="outlined"
          value={streetAddress}
          onChange={handleStreetChange}
          placeholder="e.g., 123 Main Street"
          size="small"
        />
      </div>

      {/* Display selected address */}
      {selectedProvince && (selectedDistrict || manualDistrict) && (selectedWard || manualWard) && streetAddress && (
        <div className="address-selected-display">
          <strong>Selected Address:</strong>
          <p>
            {streetAddress}, {
              selectedWard && wards.length > 0 
                ? wards.find(w => w.code === selectedWard)?.name || manualWard
                : manualWard
            }, {
              selectedDistrict && districts.length > 0
                ? districts.find(d => d.code === selectedDistrict)?.name || manualDistrict
                : manualDistrict
            }, {provinces.find(p => p.code === selectedProvince)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
