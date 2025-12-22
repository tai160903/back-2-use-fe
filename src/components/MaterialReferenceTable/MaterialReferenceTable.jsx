import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

// General Metal Materials
const generalMetalMaterials = [
  {
    material_code: 'ALUMINUM_VIRGIN',
    material_name_vi: 'Nhôm nguyên sinh',
    material_name_en: 'Virgin Aluminum',
    category_code: 'INORGANIC',
    usage: 'Hộp, khay',
    co2_min: 8.0,
    co2_max: 12.0,
    sustainability_level: 'VERY_HIGH'
  },
  {
    material_code: 'ALUMINUM_RECYCLED',
    material_name_vi: 'Nhôm tái chế',
    material_name_en: 'Recycled Aluminum',
    category_code: 'INORGANIC',
    usage: 'Hộp, khay',
    co2_min: 3.0,
    co2_max: 5.0,
    sustainability_level: 'HIGH'
  },
  {
    material_code: 'STEEL',
    material_name_vi: 'Thép carbon',
    material_name_en: 'Carbon Steel',
    category_code: 'INORGANIC',
    usage: 'Hộp, khay',
    co2_min: 1.8,
    co2_max: 2.5,
    sustainability_level: 'MEDIUM'
  },
  {
    material_code: 'STAINLESS_STEEL',
    material_name_vi: 'Thép không gỉ (Inox)',
    material_name_en: 'Stainless Steel',
    category_code: 'INORGANIC',
    usage: 'Dụng cụ tái sử dụng',
    co2_min: 5.0,
    co2_max: 7.0,
    sustainability_level: 'HIGH'
  },
  {
    material_code: 'TINPLATE',
    material_name_vi: 'Thiếc tráng thép',
    material_name_en: 'Tinplate',
    category_code: 'INORGANIC',
    usage: 'Lon thực phẩm',
    co2_min: 2.0,
    co2_max: 3.0,
    sustainability_level: 'MEDIUM'
  }
];

// General Materials
const generalMaterials = [
  {
    material_code: 'PLASTIC_VIRGIN',
    material_name_vi: 'Nhựa nguyên sinh',
    material_name_en: 'Virgin Plastic (PP, PET, PS)',
    category_code: 'INORGANIC',
    usage: 'Ly nhựa, hộp nhựa, nắp',
    co2_min: 2.0,
    co2_max: 3.5,
    sustainability_level: 'HIGH'
  },
  {
    material_code: 'PLASTIC_RECYCLED',
    material_name_vi: 'Nhựa tái chế',
    material_name_en: 'Recycled Plastic (rPET, rPP)',
    category_code: 'INORGANIC',
    usage: 'Ly/hộp nhựa tái chế',
    co2_min: 1.2,
    co2_max: 2.0,
    sustainability_level: 'MEDIUM'
  },
  {
    material_code: 'PAPER',
    material_name_vi: 'Giấy / Bìa giấy',
    material_name_en: 'Paper / Paperboard',
    category_code: 'ORGANIC',
    usage: 'Ly giấy, hộp giấy',
    co2_min: 0.6,
    co2_max: 1.3,
    sustainability_level: 'MEDIUM'
  },
  {
    material_code: 'BIO_MATERIAL',
    material_name_vi: 'Vật liệu sinh học',
    material_name_en: 'Bio-based Material (PLA, bagasse)',
    category_code: 'ORGANIC',
    usage: 'Ly bã mía, hộp sinh học',
    co2_min: 0.3,
    co2_max: 1.0,
    sustainability_level: 'LOW'
  }
];

const getSustainabilityColor = (level) => {
  switch (level) {
    case 'VERY_HIGH':
      return 'success';
    case 'HIGH':
      return 'success';
    case 'MEDIUM':
      return 'warning';
    case 'LOW':
      return 'error';
    default:
      return 'default';
  }
};

const MaterialReferenceTable = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const currentMaterials = tabValue === 0 ? generalMetalMaterials : generalMaterials;

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ 
        p: 2, 
        bgcolor: '#ffffff', 
        borderBottom: '2px solid #164e31',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <InfoIcon sx={{ color: '#0f5132', fontSize: 20 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f5132', fontSize: '16px' }}>
          Material Reference Data
        </Typography>
      </Box>

      <Box sx={{ flexShrink: 0, borderBottom: '2px solid #e5e7eb', bgcolor: '#f9fafb' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              minHeight: 48,
              color: '#6b7280',
            },
            '& .Mui-selected': {
              color: '#0f5132',
              fontWeight: 700,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#0f5132',
              height: '3px',
            },
          }}
        >
          <Tab label="General Metal" />
          <Tab label="General Materials" />
        </Tabs>
      </Box>

      <TableContainer 
        component={Paper}
        elevation={0}
        sx={{ 
          flex: 1,
          minHeight: 0,
          maxHeight: '100%',
          overflowY: 'auto',
          overflowX: 'auto',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f3f4f6',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#0f5132',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#164e31',
          },
        }}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
            <Table stickyHeader size="small" sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#0f5132', borderBottom: '3px solid #164e31' }}>
              <TableCell sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px', py: 0.75, px: 1, minWidth: 90, borderRight: '1px solid rgba(255,255,255,0.2)', bgcolor: '#0f5132' }}>
                Material Code
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px', py: 0.75, px: 1, minWidth: 90, borderRight: '1px solid rgba(255,255,255,0.2)', bgcolor: '#0f5132' }}>
                Name (VI)
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px', py: 0.75, px: 1, minWidth: 100, borderRight: '1px solid rgba(255,255,255,0.2)', bgcolor: '#0f5132' }}>
                Name (EN)
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px', py: 0.75, px: 1, minWidth: 70, borderRight: '1px solid rgba(255,255,255,0.2)', bgcolor: '#0f5132' }}>
                Category
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px', py: 0.75, px: 1, minWidth: 80, borderRight: '1px solid rgba(255,255,255,0.2)', bgcolor: '#0f5132' }}>
                Usage
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px', py: 0.75, px: 1, minWidth: 80, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', bgcolor: '#0f5132' }}>
                CO₂ Min (kg/kg)
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px', py: 0.75, px: 1, minWidth: 80, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)', bgcolor: '#0f5132' }}>
                CO₂ Max (kg/kg)
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px', py: 0.75, px: 1, minWidth: 90, textAlign: 'center', bgcolor: '#0f5132' }}>
                Sustainability
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentMaterials && currentMaterials.length > 0 ? (
              currentMaterials.map((material, index) => (
                <TableRow
                  key={material.material_code}
                  sx={{
                    '&:nth-of-type(even)': { bgcolor: '#f8fafc' },
                    '&:nth-of-type(odd)': { bgcolor: '#ffffff' },
                    '&:hover': { bgcolor: '#eff6ff', transform: 'scale(1.005)' },
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <TableCell sx={{ fontSize: '9px', py: 0.75, px: 1, fontFamily: 'monospace', color: '#164e31', fontWeight: 700, borderRight: '1px solid #e5e7eb', bgcolor: '#f0fdf4' }}>
                    {material.material_code}
                  </TableCell>
                  <TableCell sx={{ fontSize: '10px', py: 0.75, px: 1, color: '#111827', fontWeight: 500, borderRight: '1px solid #e5e7eb' }}>
                    {material.material_name_vi}
                  </TableCell>
                  <TableCell sx={{ fontSize: '10px', py: 0.75, px: 1, color: '#111827', fontWeight: 500, borderRight: '1px solid #e5e7eb' }}>
                    {material.material_name_en}
                  </TableCell>
                  <TableCell sx={{ fontSize: '10px', py: 0.75, px: 1, borderRight: '1px solid #e5e7eb' }}>
                    <Chip
                      label={material.category_code}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '9px',
                        bgcolor: material.category_code === 'ORGANIC' ? '#d1fae5' : '#dbeafe',
                        color: material.category_code === 'ORGANIC' ? '#065f46' : '#1e3a8a',
                        fontWeight: 700,
                        border: material.category_code === 'ORGANIC' ? '1px solid #10b981' : '1px solid #3b82f6',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '9px', py: 0.75, px: 1, color: '#374151', borderRight: '1px solid #e5e7eb' }}>
                    {material.usage || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '10px', py: 0.75, px: 1, textAlign: 'center', fontWeight: 700, color: '#059669', borderRight: '1px solid #e5e7eb' }}>
                    {material.co2_min}
                  </TableCell>
                  <TableCell sx={{ fontSize: '10px', py: 0.75, px: 1, textAlign: 'center', fontWeight: 700, color: '#dc2626', borderRight: '1px solid #e5e7eb' }}>
                    {material.co2_max}
                  </TableCell>
                  <TableCell sx={{ fontSize: '10px', py: 0.75, px: 1, textAlign: 'center' }}>
                    <Chip
                      label={material.sustainability_level}
                      size="small"
                      color={getSustainabilityColor(material.sustainability_level)}
                      sx={{
                        height: 18,
                        fontSize: '9px',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: material.sustainability_level === 'VERY_HIGH' || material.sustainability_level === 'HIGH' 
                          ? '#10b981' 
                          : material.sustainability_level === 'MEDIUM' 
                          ? '#f59e0b' 
                          : '#ef4444',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderTop: '2px solid #164e31', flexShrink: 0, boxShadow: '0 -2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="caption" sx={{ color: '#374151', fontSize: '11px', fontWeight: 500 }}>
          * Use this data as reference when creating or approving materials. CO₂ values are in kg CO₂/kg.
        </Typography>
      </Box>
    </Box>
  );
};

export default MaterialReferenceTable;
