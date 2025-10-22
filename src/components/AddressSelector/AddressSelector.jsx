import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import './AddressSelector.css';

const AddressSelector = ({ onAddressSelect }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load danh sách tỉnh/thành phố
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error loading provinces:', error);
        // Fallback data nếu API không hoạt động
        setProvinces([
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
        ]);
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load danh sách quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (selectedProvince) {
      const loadDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
          const data = await response.json();
          setDistricts(data.districts || []);
        } catch (error) {
          console.error('Error loading districts:', error);
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
    }
  }, [selectedProvince]);

  // Load danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      const loadWards = async () => {
        try {
          setLoadingWards(true);
          const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
          const data = await response.json();
          setWards(data.wards || []);
        } catch (error) {
          console.error('Error loading wards:', error);
          setWards([]);
        } finally {
          setLoadingWards(false);
        }
      };

      loadWards();
      // Reset ward khi chọn district mới
      setSelectedWard('');
    }
  }, [selectedDistrict]);

  // Cập nhật địa chỉ đầy đủ khi có thay đổi
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const provinceName = provinces.find(p => p.code === selectedProvince)?.name || '';
      const districtName = districts.find(d => d.code === selectedDistrict)?.name || '';
      const wardName = wards.find(w => w.code === selectedWard)?.name || '';
      
      const fullAddress = `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}`.replace(/^,\s*/, '');
      onAddressSelect(fullAddress, {
        province: provinceName,
        district: districtName,
        ward: wardName,
        street: streetAddress
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard, streetAddress, provinces, districts, wards, onAddressSelect]);

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

        {/* District */}
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

        {/* Ward */}
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
      {selectedProvince && selectedDistrict && selectedWard && streetAddress && (
        <div className="address-selected-display">
          <strong>Selected Address:</strong>
          <p>{streetAddress}, {wards.find(w => w.code === selectedWard)?.name}, {districts.find(d => d.code === selectedDistrict)?.name}, {provinces.find(p => p.code === selectedProvince)?.name}</p>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
