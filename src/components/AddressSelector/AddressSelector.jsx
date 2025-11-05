import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import localData from "../../../public/data/vietnam-provinces.json"; 

const AddressSelector = ({ onAddressSelect, variant = "dark" }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [street, setStreet] = useState("");

  const isLight = variant === "light";

  // Styles based on variant
  const labelColor = isLight ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.8)";
  const labelFocusedColor = isLight ? "rgba(34, 139, 34, 0.9)" : "rgba(34, 139, 34, 0.9)";
  const labelDisabledColor = isLight ? "rgba(0, 0, 0, 0.38)" : "rgba(255, 255, 255, 0.4)";
  const textColor = isLight ? "black" : "white";
  const textDisabledColor = isLight ? "rgba(0, 0, 0, 0.38)" : "rgba(255, 255, 255, 0.4)";
  const borderColor = isLight ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.3)";
  const borderHoverColor = isLight ? "rgba(0, 0, 0, 0.87)" : "rgba(255, 255, 255, 0.6)";
  const borderFocusedColor = isLight ? "rgba(34, 139, 34, 0.8)" : "rgba(34, 139, 34, 0.8)";
  const borderDisabledColor = isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.2)";
  const iconColor = isLight ? "rgba(0, 0, 0, 0.54)" : "rgba(255, 255, 255, 0.7)";
  const placeholderColor = isLight ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.5)";

  // Fetch provinces list (API → fallback local)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=3");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setProvinces(data);
      } catch {
        console.warn("Error API, use local data");
        setProvinces(localData);
      }
    };
    fetchProvinces();
  }, []);

  // When province is selected
  useEffect(() => {
    if (selectedProvince && provinces.length > 0) {
      const province = provinces.find((p) => p.code === selectedProvince);
      if (province) {
        setDistricts(province.districts || []);
        setWards([]);
        setSelectedDistrict("");
        setSelectedWard("");
      }
    } else if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince, provinces]);

  // When district is selected
  useEffect(() => {
    if (selectedDistrict && districts.length > 0) {
      const district = districts.find((d) => d.code === selectedDistrict);
      if (district) {
        setWards(district.wards || []);
        setSelectedWard("");
      }
    } else if (!selectedDistrict) {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict, districts]);

  // Track previous values to avoid unnecessary calls
  const prevValuesRef = useRef({
    selectedProvince: "",
    selectedDistrict: "",
    selectedWard: "",
    street: "",
  });

  // Send data to parent component
  useEffect(() => {
    // Only call if values actually changed
    const hasChanged =
      prevValuesRef.current.selectedProvince !== selectedProvince ||
      prevValuesRef.current.selectedDistrict !== selectedDistrict ||
      prevValuesRef.current.selectedWard !== selectedWard ||
      prevValuesRef.current.street !== street;

    if (hasChanged && onAddressSelect) {
      const selectedData = {
        province: provinces.find((p) => p.code === selectedProvince)?.name || "",
        district: districts.find((d) => d.code === selectedDistrict)?.name || "",
        ward: wards.find((w) => w.code === selectedWard)?.name || "",
        street: street || "",
        fullAddress: [
          street,
          wards.find((w) => w.code === selectedWard)?.name,
          districts.find((d) => d.code === selectedDistrict)?.name,
          provinces.find((p) => p.code === selectedProvince)?.name,
        ]
          .filter(Boolean)
          .join(", "),
      };
      
      prevValuesRef.current = {
        selectedProvince,
        selectedDistrict,
        selectedWard,
        street,
      };
      
      onAddressSelect(selectedData);
    }
  }, [selectedProvince, selectedDistrict, selectedWard, street, provinces, districts, wards]);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        {/* Province/City */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel
              sx={{
                color: labelColor,
                "&.Mui-focused": {
                  color: labelFocusedColor,
                },
              }}
            >
              Province/City
            </InputLabel>
            <Select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              label="Province/City"
              sx={{
                color: textColor,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderHoverColor,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderFocusedColor,
                  borderWidth: "2px",
                },
                "& .MuiSvgIcon-root": {
                  color: iconColor,
                },
              }}
            >
              {provinces.map((p) => (
                <MenuItem key={p.code} value={p.code}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* District */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth disabled={!selectedProvince}>
            <InputLabel
              sx={{
                color: labelColor,
                "&.Mui-focused": {
                  color: labelFocusedColor,
                },
                "&.Mui-disabled": {
                  color: labelDisabledColor,
                },
              }}
            >
              District
            </InputLabel>
            <Select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              label="District"
              sx={{
                color: textColor,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderHoverColor,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderFocusedColor,
                  borderWidth: "2px",
                },
                "& .MuiSvgIcon-root": {
                  color: iconColor,
                },
                "&.Mui-disabled": {
                  color: labelDisabledColor,
                },
              }}
            >
              {districts.map((d) => (
                <MenuItem key={d.code} value={d.code}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Ward */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth disabled={!selectedDistrict}>
            <InputLabel
              sx={{
                color: labelColor,
                "&.Mui-focused": {
                  color: labelFocusedColor,
                },
                "&.Mui-disabled": {
                  color: labelDisabledColor,
                },
              }}
            >
              Ward
            </InputLabel>
            <Select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              label="Ward"
              sx={{
                color: textColor,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderHoverColor,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderFocusedColor,
                  borderWidth: "2px",
                },
                "& .MuiSvgIcon-root": {
                  color: iconColor,
                },
                "&.Mui-disabled": {
                  color: labelDisabledColor,
                },
              }}
            >
              {wards.map((w) => (
                <MenuItem key={w.code} value={w.code}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Street address */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Street Address"
            variant="outlined"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            disabled={!selectedWard}
            placeholder="House number, street name"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: textColor,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderHoverColor,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderFocusedColor,
                  borderWidth: "2px",
                },
                "&.Mui-disabled": {
                  color: textDisabledColor,
                },
                "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                  borderColor: borderDisabledColor,
                },
              },
              "& .MuiInputLabel-root": {
                color: labelColor,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: labelFocusedColor,
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: labelDisabledColor,
              },
              "& .MuiInputBase-input::placeholder": {
                color: placeholderColor,
                opacity: 1,
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressSelector;
