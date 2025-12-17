import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Divider,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AdminPanelSettings,
  Save,
  Refresh,
  EmojiEvents,
  Add,
  Edit,
  Close,
  Delete,
} from "@mui/icons-material";
import {
  getLeaderboardPoliciesApi,
  createLeaderboardPolicyApi,
  updateLeaderboardPolicyApi,
  getSystemSettingsApi,
  upsertSystemSettingApi,
  updateSystemSettingApi,
} from "../../store/slices/adminSlice";
import { getLeaderboardVouchersApi } from "../../store/slices/voucherSlice";
import "./AdminDashboard.css";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: "24px" }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  const { leaderboardPolicies, rewardSettings, isLoading, systemSettings: systemSettingsFromApi } = useSelector(state => state.admin);
  const { vouchers } = useSelector(state => state.vouchers);
  
  const [activeTab, setActiveTab] = useState(0);
  // Leaderboard Policy States
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [policyFormData, setPolicyFormData] = useState({
    voucherId: '',
    month: '',
    year: new Date().getFullYear(),
    rankFrom: 1,
    rankTo: 3,
    note: '',
  });
  const [policyFilters, setPolicyFilters] = useState({
    month: '',
    year: '',
    isDistributed: '',
    rankFrom: '',
    rankTo: '',
  });
  
  // Reward Setting States

  // Normalize system settings list from API
  const systemSettingsList = Array.isArray(systemSettingsFromApi)
    ? systemSettingsFromApi
    : [];

  // System Setting Upsert State (React Hook Form + Yup)
  const [systemSettingModalOpen, setSystemSettingModalOpen] = useState(false);
  const [editingSystemSetting, setEditingSystemSetting] = useState(null);
  const [originalValueCount, setOriginalValueCount] = useState(0);

  const systemSettingSchema = yup.object().shape({
    category: yup.string().required("Category is required"),
    key: yup.string().required("Key is required"),
    description: yup.string().nullable(),
    valuePairs: yup
      .array()
      .of(
        yup.object().shape({
          key: yup.string().required("Value key is required"),
          value: yup
            .mixed()
            .test(
              "not-empty",
              "Value is required",
              (val) => val !== undefined && val !== null && `${val}`.trim() !== ""
            ),
        })
      )
      .min(1, "At least one value pair is required"),
  });

  const {
    control: systemSettingControl,
    handleSubmit: handleSystemSettingSubmit,
    reset: resetSystemSettingForm,
    register: systemSettingRegister,
    formState: { errors: systemSettingErrors },
  } = useForm({
    resolver: yupResolver(systemSettingSchema),
    defaultValues: {
      category: "reward",
      key: "",
      description: "",
      valuePairs: [{ key: "", value: "" }],
    },
  });

  const {
    fields: systemSettingValueFields,
    append: appendSystemSettingValueRow,
    remove: removeSystemSettingValueRow,
  } = useFieldArray({
    control: systemSettingControl,
    name: "valuePairs",
  });

  const handleDeleteSystemSetting = (setting) => {
    console.log("Delete system setting:", setting);
  };

  // System Setting upsert handlers
  const handleOpenSystemSettingModal = (setting = null) => {
    if (setting) {
      setEditingSystemSetting(setting);
      const entries = Object.entries(setting.value || {});
      setOriginalValueCount(entries.length);
      resetSystemSettingForm({
        category: setting.category || "reward",
        key: setting.key || "",
        description: setting.description || "",
        valuePairs:
          entries.length > 0
            ? entries.map(([k, v]) => ({
                key: k,
                value: v ?? "",
              }))
            : [{ key: "", value: "" }],
      });
    } else {
      setEditingSystemSetting(null);
      setOriginalValueCount(0);
      resetSystemSettingForm({
        category: "reward",
        key: "",
        description: "",
        valuePairs: [{ key: "", value: "" }],
      });
    }
    setSystemSettingModalOpen(true);
  };

  const handleCloseSystemSettingModal = () => {
    setSystemSettingModalOpen(false);
    setEditingSystemSetting(null);
  };

  const handleAddSystemSettingValueRow = () => {
    appendSystemSettingValueRow({ key: "", value: "" });
  };

  const handleRemoveSystemSettingValueRow = (indexToRemove) => {
    if (systemSettingValueFields.length <= 1) return;
    removeSystemSettingValueRow(indexToRemove);
  };

  const handleSubmitSystemSetting = async (formData) => {
    try {
      const formCategory = formData.category;
      const formKey = formData.key;
      const description = formData.description;
      const valuePairs = formData.valuePairs || [];

      // Khi edit, luôn dùng category/key gốc để tránh 404 do đổi key/category
      const category = editingSystemSetting?.category || formCategory;
      const key = editingSystemSetting?.key || formKey;

      if (editingSystemSetting) {
        // Edit mode: chỉ call API cho những value thực sự thay đổi
        const originalValue = editingSystemSetting?.value || {};

        const promises = valuePairs
          .map((row) => {
            const path = row.key.trim();
            if (!path) return null;

            const raw = row.value;
            const numeric = raw === "" ? 0 : Number(raw);
            const finalValue = Number.isNaN(numeric) ? raw : numeric;

            const oldRaw = originalValue[path];

            const isSame =
              oldRaw !== undefined && `${oldRaw}` === `${finalValue}`;

            if (isSame) return null; // không thay đổi → không call API

            return dispatch(
              updateSystemSettingApi({ category, key, path, value: finalValue })
            ).unwrap();
          })
          .filter(Boolean);

        await Promise.all(promises);
      } else {
        // Create mode: use upsertSystemSettingApi with full value object
        const valueObject = {};
        valuePairs.forEach((row) => {
          const k = row.key.trim();
          if (!k) return;
          const raw = row.value;
          const numeric = raw === "" ? 0 : Number(raw);
          valueObject[k] = Number.isNaN(numeric) ? raw : numeric;
        });

        const payload = {
          category,
          key,
          description,
          value: valueObject,
        };

        await dispatch(upsertSystemSettingApi(payload)).unwrap();
      }

      setSystemSettingModalOpen(false);
      setEditingSystemSetting(null);
      dispatch(getSystemSettingsApi());
    } catch (error) {
      console.error("Failed to save system setting:", error);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (activeTab === 0) {
      dispatch(getLeaderboardPoliciesApi({ page: 1, limit: 100 }));
      dispatch(getLeaderboardVouchersApi({ page: 1, limit: 100 }));
    } else if (activeTab === 1) {
      // dispatch(getRewardSettingsApi());
      // Gọi thêm API hệ thống khi ở tab Reward Setting
   
    } else if (activeTab === 5) {
      // Gọi API hệ thống khi vào tab "Hệ thống"
      dispatch(getSystemSettingsApi());
    }
  }, [dispatch, activeTab]);

  // Debug: Log reward settings when they change
  useEffect(() => {
    if (activeTab === 1) {
      console.log('Reward Settings:', rewardSettings);
      console.log('Is Loading:', isLoading);
    }
  }, [rewardSettings, isLoading, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      dispatch(getLeaderboardPoliciesApi({ page: 1, limit: 100 }));
      dispatch(getLeaderboardVouchersApi({ page: 1, limit: 100 }));
    } else if (newValue === 1) {
      // dispatch(getRewardSettingsApi());
      // Gọi thêm API hệ thống khi chuyển sang tab Reward Setting
      dispatch(getSystemSettingsApi());
    } else if (newValue === 5) {
      // Gọi API hệ thống khi chuyển sang tab "Hệ thống"
      dispatch(getSystemSettingsApi());
    }
  };

  // Leaderboard Policy Handlers
  const handleOpenPolicyModal = (policy = null) => {
    if (policy) {
      setEditingPolicy(policy);
      setPolicyFormData({
        voucherId: policy.voucherId?._id || policy.voucherId || '',
        month: policy.month || '',
        year: policy.year || new Date().getFullYear(),
        rankFrom: policy.rankFrom || 1,
        rankTo: policy.rankTo || 3,
        note: policy.note || '',
      });
    } else {
      setEditingPolicy(null);
      setPolicyFormData({
        voucherId: '',
        month: '',
        year: new Date().getFullYear(),
        rankFrom: 1,
        rankTo: 3,
        note: '',
      });
    }
    setPolicyModalOpen(true);
  };

  const handleClosePolicyModal = () => {
    setPolicyModalOpen(false);
    setEditingPolicy(null);
    setPolicyFormData({
      voucherId: '',
      month: '',
      year: new Date().getFullYear(),
      rankFrom: 1,
      rankTo: 3,
      note: '',
    });
  };

  const handlePolicyFormChange = (e) => {
    const { name, value } = e.target;
    setPolicyFormData(prev => ({
      ...prev,
      [name]: name === 'month' || name === 'year' || name === 'rankFrom' || name === 'rankTo' 
        ? (value === '' ? '' : Number(value)) 
        : value
    }));
  };

  const handleSubmitPolicy = async () => {
    try {
      if (editingPolicy) {
        await dispatch(updateLeaderboardPolicyApi({
          id: editingPolicy._id || editingPolicy.id,
          policyData: policyFormData
        })).unwrap();
      } else {
        await dispatch(createLeaderboardPolicyApi(policyFormData)).unwrap();
      }
      handleClosePolicyModal();
      dispatch(getLeaderboardPoliciesApi({ page: 1, limit: 100 }));
    } catch (error) {
      console.error("Failed to save policy:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPolicyFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    dispatch(getLeaderboardPoliciesApi({
      ...policyFilters,
      month: policyFilters.month ? Number(policyFilters.month) : undefined,
      year: policyFilters.year ? Number(policyFilters.year) : undefined,
      isDistributed: policyFilters.isDistributed === '' ? undefined : policyFilters.isDistributed === 'true',
      rankFrom: policyFilters.rankFrom ? Number(policyFilters.rankFrom) : undefined,
      rankTo: policyFilters.rankTo ? Number(policyFilters.rankTo) : undefined,
      page: 1,
      limit: 100,
    }));
  };

  const handleResetFilters = () => {
    setPolicyFilters({
      month: '',
      year: '',
      isDistributed: '',
      rankFrom: '',
      rankTo: '',
    });
    dispatch(getLeaderboardPoliciesApi({ page: 1, limit: 100 }));
  };

  // Reward Setting Handlers (hiện tại chưa dùng - giữ placeholder nếu cần sau này)

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <AdminPanelSettings className="header-icon" />
            <div>
              <h1 className="dashboard-title">System Settings</h1>
              <p className="dashboard-subtitle">
                Manage reward policies and platform options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <Container
        maxWidth={false}
        sx={{
          mt: 2,
          mb: 8,
          position: "relative",
          zIndex: 1,
          maxWidth: "18000px",
        }}
      >
        <Paper 
          elevation={4} 
          sx={{ 
            borderRadius: 3, 
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Tabs */}
          <Box 
            sx={{ 
              borderBottom: 2, 
              borderColor: "divider", 
              bgcolor: "background.paper",
              background: "linear-gradient(to right, #f5f7f6 0%, #ffffff 100%)",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 2,
                "& .MuiTab-root": {
                  minHeight: 72,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  mx: 1,
                  borderRadius: "8px 8px 0 0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(18, 66, 42, 0.06)",
                  },
                  "&.Mui-selected": {
                    color: "#12422a",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  background: "linear-gradient(90deg, #12422a 0%, #0d2e1c 100%)",
                },
              }}
            >
              <Tab icon={<EmojiEvents />} iconPosition="start" label="Leaderboard" />
              <Tab icon={<AdminPanelSettings />} iconPosition="start" label="Reward Setting" />
            </Tabs>
          </Box>

          <Box sx={{ p: 5, bgcolor: "#fafafa", minHeight: 500 }}>
            {/* LeaderBoard Reward Policy Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: "#2c3e50" }}>
                  LeaderBoard Reward Policy
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.05rem" }}>
                  Quản lý chính sách phần thưởng cho bảng xếp hạng
                </Typography>
              </Box>

              {/* Filters */}
              <Card sx={{ mb: 3, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Filters
                </Typography>
                <Grid container spacing={2}>
                  <Grid item size={2}>
                    <TextField
                      fullWidth
                      label="Month"
                      type="number"
                      name="month"
                      value={policyFilters.month}
                      onChange={handleFilterChange}
                      inputProps={{ min: 1, max: 12 }}
                    />
                  </Grid>
                  <Grid item size={2}>
                    <TextField
                      fullWidth
                      label="Year"
                      type="number"
                      name="year"
                      value={policyFilters.year}
                      onChange={handleFilterChange}
                    />
                  </Grid>
                  <Grid item size={2}>
                    <FormControl fullWidth>
                      <InputLabel>The reward has been released</InputLabel>
                      <Select
                        name="isDistributed"
                        value={policyFilters.isDistributed}
                        onChange={handleFilterChange}
                        label="Is Distributed"
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="true">True</MenuItem>
                        <MenuItem value="false">False</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item size={2}>
                    <TextField
                      fullWidth
                      label="Rank From"
                      type="number"
                      name="rankFrom"
                      value={policyFilters.rankFrom}
                      onChange={handleFilterChange}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item size={2}>
                    <TextField
                      fullWidth
                      label="Rank To"
                      type="number"
                      name="rankTo"
                      value={policyFilters.rankTo}
                      onChange={handleFilterChange}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item size={2}>
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" onClick={handleApplyFilters} size="small">
                        Apply
                      </Button>
                      <Button variant="outlined" onClick={handleResetFilters} size="small">
                        Reset
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>

              {/* Actions */}
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  Policies ({leaderboardPolicies?.length || 0})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenPolicyModal()}
                  sx={{
                    background: "linear-gradient(45deg, #12422a 30%, #0d2e1c 90%)",
                    boxShadow: "0 4px 12px 2px rgba(18, 66, 42, .35)",
                  }}
                >
                  Create Policy
                </Button>
              </Box>

              {/* Policies Table */}
              <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell><strong>Voucher</strong></TableCell>
                      <TableCell><strong>Month</strong></TableCell>
                      <TableCell><strong>Year</strong></TableCell>
                      <TableCell><strong>Rank From</strong></TableCell>
                      <TableCell><strong>Rank To</strong></TableCell>
                      <TableCell><strong>Is Distributed</strong></TableCell>
                      <TableCell><strong>Note</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : leaderboardPolicies && leaderboardPolicies.length > 0 ? (
                      leaderboardPolicies.map((policy) => (
                        <TableRow key={policy._id || policy.id} hover>
                          <TableCell>
                            {policy.voucherId?.name || policy.voucherId || 'N/A'}
                          </TableCell>
                          <TableCell>{policy.month || 'N/A'}</TableCell>
                          <TableCell>{policy.year || 'N/A'}</TableCell>
                          <TableCell>{policy.rankFrom || 'N/A'}</TableCell>
                          <TableCell>{policy.rankTo || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={policy.isDistributed ? 'Yes' : 'No'}
                              color={policy.isDistributed ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {policy.note || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenPolicyModal(policy)}
                              sx={{ color: "#12422a" }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No policies found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

              {/* Reward Setting Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: "#2c3e50" }}>
                  Reward Setting
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.05rem" }}>
                  Manage reward settings for the system
                </Typography>
              </Box>

              {/* System Settings from API */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2.5, gap: 2 }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#12422a" }}>
                      Reward configuration from system
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Data is synchronized from backend and used to calculate points and rewards.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenSystemSettingModal()}
                    sx={{
                      background: "linear-gradient(45deg, #12422a 30%, #0d2e1c 90%)",
                      boxShadow: "0 4px 12px 2px rgba(18, 66, 42, .35)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Add configuration
                  </Button>
                </Stack>

                <Grid container spacing={2} alignItems="stretch">
                  {systemSettingsList.length > 0 ? (
                    systemSettingsList.map((setting, index) => (
                      <Grid
                        item
                        size={{ xs: 12, md: 12 }} 
                        key={setting._id || setting.id || setting.key || index}
                        sx={{ display: "flex" }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            minHeight: 140,
                            p: 2.5,
                            borderRadius: 2,
                            border: "1px solid #e0e0e0",
                            bgcolor: "#ffffff",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Box sx={{ minWidth: 220 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                          
                            >
                              {setting.category || "System Policy"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ mt: 0.5 }}
                            >
                              {setting.description || setting.key}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "stretch",
                              gap: 1.5,
                              mt: 0.5,
                              width: "100%",
                              maxWidth: 360,
                            }}
                          >
                            <Grid container spacing={1}>
                              {Object.entries(setting.value || {}).map(([key, val]) => (
                                <Grid item xs={12} sm={6} key={key}>
                                  <Chip
                                    label={`${key}: ${val}`}
                                    size="small"
                                    sx={{
                                      width: "100%",
                                      justifyContent: "flex-start",
                                    }}
                                    color={key.toLowerCase().includes("failed") ? "error" : "success"}
                                    variant="outlined"
                                  />
                                </Grid>
                              ))}
                            </Grid>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                sx={{ color: "#12422a" }}
                                onClick={() => handleOpenSystemSettingModal(setting)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: "#f44336" }}
                                onClick={() => handleDeleteSystemSetting(setting)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Box>
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Chưa có cấu hình hệ thống nào được trả về từ API.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Card>
            </TabPanel>

          </Box>
        </Paper>
      </Container>

      {/* Policy Modal */}
      <Dialog
        open={policyModalOpen}
        onClose={handleClosePolicyModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(18, 66, 42, 0.25)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #12422a 0%, #0d2e1c 100%)',
            color: 'white',
            py: 2.5,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <EmojiEvents sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              {editingPolicy ? 'Edit Leaderboard Policy' : 'Create Leaderboard Policy'}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClosePolicyModal}
            size="small"
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 3, px: 4, mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item size={12}>
              <FormControl fullWidth required sx={{ mt: 1 }}>
                <InputLabel id="policy-voucher-label">Voucher</InputLabel>
                <Select
                  name="voucherId"
                  value={policyFormData.voucherId}
                  onChange={handlePolicyFormChange}
                  labelId="policy-voucher-label"
                  label="Voucher"
                >
                  {vouchers && vouchers.length > 0 ? (
                    vouchers.map((voucher) => (
                      <MenuItem key={voucher._id || voucher.id} value={voucher._id || voucher.id}>
                        {voucher.name} ({voucher.baseCode})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No vouchers available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Month"
                type="number"
                name="month"
                value={policyFormData.month}
                onChange={handlePolicyFormChange}
                required
                inputProps={{ min: 1, max: 12 }}
                helperText="Month (1-12)"
                variant="outlined"
              />
            </Grid>

            <Grid item size={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                name="year"
                value={policyFormData.year}
                onChange={handlePolicyFormChange}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item size={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Rank From"
                type="number"
                name="rankFrom"
                value={policyFormData.rankFrom}
                onChange={handlePolicyFormChange}
                required
                inputProps={{ min: 1 }}
                variant="outlined"
              />
            </Grid>

            <Grid item size={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Rank To"
                type="number"
                name="rankTo"
                value={policyFormData.rankTo}
                onChange={handlePolicyFormChange}
                required
                inputProps={{ min: 1 }}
                variant="outlined"
              />
            </Grid>

            <Grid item size={12}>
              <TextField
                fullWidth
                label="Note"
                name="note"
                value={policyFormData.note}
                onChange={handlePolicyFormChange}
                multiline
                rows={3}
                placeholder="Reward for top 3 leaderboard users"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
          <Button
            onClick={handleClosePolicyModal}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#ccc',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPolicy}
            variant="contained"
            disabled={isLoading}
            sx={{
              background: "linear-gradient(45deg, #12422a 30%, #0d2e1c 90%)",
              boxShadow: "0 4px 12px 2px rgba(18, 66, 42, .35)",
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : (editingPolicy ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* System Setting Upsert Modal */}
      <Dialog
        open={systemSettingModalOpen}
        onClose={handleCloseSystemSettingModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 12px 40px rgba(18, 66, 42, 0.25)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #12422a 0%, #0d2e1c 100%)",
            color: "white",
            py: 2.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AdminPanelSettings sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700}>
              {editingSystemSetting ? "Edit System Reward Policy" : "Create System Reward Policy"}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseSystemSettingModal}
            sx={{ color: "white", "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSystemSettingSubmit(handleSubmitSystemSetting)}>
          <DialogContent sx={{ pt: 4, pb: 3, px: 4, mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  {...systemSettingRegister("category")}
                  disabled={!!editingSystemSetting}
                  helperText={
                    systemSettingErrors.category?.message || 'For example: "reward"'
                  }
                  error={!!systemSettingErrors.category}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Key"
                  {...systemSettingRegister("key")}
                  disabled={!!editingSystemSetting}
                  helperText={
                    systemSettingErrors.key?.message || 'For example: "reward_policy"'
                  }
                  error={!!systemSettingErrors.key}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
             
              </Grid>

              {systemSettingValueFields.map((field, index) => (
                <Grid item xs={12} key={field.id}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        label="Parameter key"
                        placeholder="rewardSuccess, rankingLate..."
                        {...systemSettingRegister(`valuePairs.${index}.key`)}
                        disabled={!!editingSystemSetting && index < originalValueCount}
                        error={
                          !!systemSettingErrors.valuePairs?.[index]?.key
                        }
                        helperText={
                          systemSettingErrors.valuePairs?.[index]?.key?.message
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        label="Value"
                        type="number"
                      {...systemSettingRegister(`valuePairs.${index}.value`)}
                        error={
                          !!systemSettingErrors.valuePairs?.[index]?.value
                        }
                        helperText={
                          systemSettingErrors.valuePairs?.[index]?.value
                            ?.message
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Stack direction="row" spacing={1}>
                        {systemSettingValueFields.length > 1 && !editingSystemSetting && (
                          <IconButton
                            size="small"
                            sx={{ color: "#f44336" }}
                            onClick={() =>
                              handleRemoveSystemSettingValueRow(index)
                            }
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddSystemSettingValueRow}
                  sx={{ mt: 1 }}
                >
                  Add value row
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  {...systemSettingRegister("description")}
                  error={!!systemSettingErrors.description}
                  helperText={systemSettingErrors.description?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 4, pb: 3, gap: 2 }}>
            <Button
              onClick={handleCloseSystemSettingModal}
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                borderColor: "#12422a",
                color: "#12422a",
                "&:hover": {
                  borderColor: "#0d2e1c",
                  color: "#0d2e1c",
                  bgcolor: "rgba(18, 66, 42, 0.06)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 4,
                py: 1,
                background: "linear-gradient(45deg, #12422a 30%, #0d2e1c 90%)",
                boxShadow: "0 4px 12px 2px rgba(18, 66, 42, .35)",
                "&:hover": {
                  background: "linear-gradient(45deg, #0d2e1c 30%, #12422a 90%)",
                },
              }}
            >
              {editingSystemSetting ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </div>
  );
}
