import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Alert,
  Snackbar,
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
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Security,
  Notifications,
  Language,
  Palette,
  Storage,
  Email,
  AdminPanelSettings,
  Save,
  Refresh,
  EmojiEvents,
  Add,
  Edit,
  Delete,
  Close,
} from "@mui/icons-material";
import {
  getLeaderboardPoliciesApi,
  createLeaderboardPolicyApi,
  updateLeaderboardPolicyApi,
  getRewardSettingsApi,
  createRewardSettingApi,
  updateRewardSettingApi,
  toggleRewardSettingApi,
} from "../../store/slices/adminSlice";
import { getAllVouchersApi } from "../../store/slices/voucherSlice";
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
  const { leaderboardPolicies, rewardSettings, isLoading } = useSelector(state => state.admin);
  const { vouchers } = useSelector(state => state.vouchers);
  
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
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
  const [rewardSettingModalOpen, setRewardSettingModalOpen] = useState(false);
  const [editingRewardSetting, setEditingRewardSetting] = useState(null);
  const [rewardSettingFormData, setRewardSettingFormData] = useState({
    rewardSuccess: 0,
    rewardLate: 0,
    rewardFailed: 0,
    rankingSuccess: 0,
    rankingLate: 0,
    rankingFailedPenalty: 0,
  });
  
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Back2Use Platform",
    siteDescription: "Circular Economy Marketplace",
    contactEmail: "admin@back2use.com",
    timezone: "Asia/Ho_Chi_Minh",
    language: "vi",
    maintenanceMode: false,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    ipWhitelist: "",
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newBusinessAlert: true,
    approvalReminder: true,
    systemAlerts: true,
    weeklyReport: false,
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    cacheEnabled: true,
    debugMode: false,
    logLevel: "info",
    backupFrequency: "daily",
    autoApproval: false,
  });

  // Load data on mount
  useEffect(() => {
    if (activeTab === 0) {
      dispatch(getLeaderboardPoliciesApi({ page: 1, limit: 100 }));
      dispatch(getAllVouchersApi({ page: 1, limit: 100 }));
    } else if (activeTab === 1) {
      dispatch(getRewardSettingsApi());
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
      dispatch(getAllVouchersApi({ page: 1, limit: 100 }));
    } else if (newValue === 1) {
      dispatch(getRewardSettingsApi());
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
      setSnackbar({
        open: true,
        message: editingPolicy ? "Policy updated successfully!" : "Policy created successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to save policy",
        severity: "error",
      });
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

  // Reward Setting Handlers
  const handleOpenRewardSettingModal = (setting = null) => {
    if (setting) {
      setEditingRewardSetting(setting);
      setRewardSettingFormData({
        rewardSuccess: setting.rewardSuccess || 0,
        rewardLate: setting.rewardLate || 0,
        rewardFailed: setting.rewardFailed || 0,
        rankingSuccess: setting.rankingSuccess || 0,
        rankingLate: setting.rankingLate || 0,
        rankingFailedPenalty: setting.rankingFailedPenalty || 0,
      });
    } else {
      setEditingRewardSetting(null);
      setRewardSettingFormData({
        rewardSuccess: 0,
        rewardLate: 0,
        rewardFailed: 0,
        rankingSuccess: 0,
        rankingLate: 0,
        rankingFailedPenalty: 0,
      });
    }
    setRewardSettingModalOpen(true);
  };

  const handleCloseRewardSettingModal = () => {
    setRewardSettingModalOpen(false);
    setEditingRewardSetting(null);
    setRewardSettingFormData({
      rewardSuccess: 0,
      rewardLate: 0,
      rewardFailed: 0,
      rankingSuccess: 0,
      rankingLate: 0,
      rankingFailedPenalty: 0,
    });
  };

  const handleRewardSettingFormChange = (e) => {
    const { name, value } = e.target;
    setRewardSettingFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const handleSubmitRewardSetting = async () => {
    try {
      if (editingRewardSetting) {
        await dispatch(updateRewardSettingApi({
          id: editingRewardSetting._id || editingRewardSetting.id,
          settingData: rewardSettingFormData
        })).unwrap();
      } else {
        await dispatch(createRewardSettingApi(rewardSettingFormData)).unwrap();
      }
      handleCloseRewardSettingModal();
      dispatch(getRewardSettingsApi());
    } catch (error) {
      console.error('Error saving reward setting:', error);
    }
  };

  const handleToggleRewardSetting = async (settingId) => {
    try {
      await dispatch(toggleRewardSettingApi(settingId)).unwrap();
      dispatch(getRewardSettingsApi());
    } catch (error) {
      console.error('Error toggling reward setting:', error);
    }
  };

  const handleSaveSettings = () => {
    // Here you would typically make an API call to save settings
    setSnackbar({
      open: true,
      message: "Cài đặt đã được lưu thành công!",
      severity: "success",
    });
  };

  const handleResetSettings = () => {
    setSnackbar({
      open: true,
      message: "Cài đặt đã được đặt lại về giá trị mặc định",
      severity: "info",
    });
  };

  return (
    <div className="adminDashboard">
      {/* Settings Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8, position: "relative", zIndex: 1 }}>
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
              background: "linear-gradient(to right, #fafafa 0%, #ffffff 100%)",
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
                    bgcolor: "rgba(106, 27, 154, 0.05)",
                  },
                  "&.Mui-selected": {
                    color: "#6a1b9a",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  background: "linear-gradient(90deg, #6a1b9a 0%, #9c27b0 100%)",
                },
              }}
            >
              <Tab icon={<EmojiEvents />} iconPosition="start" label="LeaderBoard Reward Policy" />
              <Tab icon={<AdminPanelSettings />} iconPosition="start" label="Reward Setting" />
              <Tab icon={<SettingsIcon />} iconPosition="start" label="Cài đặt chung" />
              <Tab icon={<Security />} iconPosition="start" label="Bảo mật" />
              <Tab icon={<Notifications />} iconPosition="start" label="Thông báo" />
              <Tab icon={<Storage />} iconPosition="start" label="Hệ thống" />
              <Tab icon={<Palette />} iconPosition="start" label="Giao diện" />
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
                  <Grid item xs={12} md={2}>
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
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="Year"
                      type="number"
                      name="year"
                      value={policyFilters.year}
                      onChange={handleFilterChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Is Distributed</InputLabel>
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
                  <Grid item xs={12} md={2}>
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
                  <Grid item xs={12} md={2}>
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
                  <Grid item xs={12} md={2}>
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
                    background: "linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)",
                    boxShadow: "0 4px 12px 2px rgba(156, 39, 176, .3)",
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
                              sx={{ color: "#6a1b9a" }}
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
                  Quản lý cài đặt phần thưởng cho hệ thống
                </Typography>
              </Box>

              {/* Actions */}
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  Settings ({rewardSettings?.length || 0})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenRewardSettingModal()}
                  sx={{
                    background: "linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)",
                    boxShadow: "0 4px 12px 2px rgba(156, 39, 176, .3)",
                  }}
                >
                  Create Setting
                </Button>
              </Box>

              {/* Settings Table */}
              <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell><strong>Reward Success</strong></TableCell>
                      <TableCell><strong>Reward Late</strong></TableCell>
                      <TableCell><strong>Reward Failed</strong></TableCell>
                      <TableCell><strong>Ranking Success</strong></TableCell>
                      <TableCell><strong>Ranking Late</strong></TableCell>
                      <TableCell><strong>Ranking Failed Penalty</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
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
                    ) : rewardSettings && rewardSettings.length > 0 ? (
                      rewardSettings.map((setting) => (
                        <TableRow key={setting._id || setting.id} hover>
                          <TableCell>{setting.rewardSuccess || 0}</TableCell>
                          <TableCell>{setting.rewardLate || 0}</TableCell>
                          <TableCell>{setting.rewardFailed || 0}</TableCell>
                          <TableCell>{setting.rankingSuccess || 0}</TableCell>
                          <TableCell>{setting.rankingLate || 0}</TableCell>
                          <TableCell>{setting.rankingFailedPenalty || 0}</TableCell>
                          <TableCell>
                            <Chip
                              label={setting.isActive !== false ? 'Active' : 'Inactive'}
                              color={setting.isActive !== false ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenRewardSettingModal(setting)}
                                sx={{ color: "#6a1b9a" }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleRewardSetting(setting._id || setting.id)}
                                sx={{ color: setting.isActive !== false ? "#f44336" : "#4caf50" }}
                              >
                                {setting.isActive !== false ? (
                                  <Close fontSize="small" />
                                ) : (
                                  <Refresh fontSize="small" />
                                )}
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No reward settings found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* General Settings Tab */}
            <TabPanel value={activeTab} index={2}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: "#2c3e50" }}>
                  Cài đặt chung
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.05rem" }}>
                  Cấu hình thông tin cơ bản và tùy chọn nền tảng
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <TextField
                      fullWidth
                      label="Tên Website"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, siteName: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f8f9fa",
                          "&:hover fieldset": {
                            borderColor: "#6a1b9a",
                          },
                        },
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <TextField
                      fullWidth
                      label="Email liên hệ"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f8f9fa",
                          "&:hover fieldset": {
                            borderColor: "#6a1b9a",
                          },
                        },
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <TextField
                      fullWidth
                      label="Mô tả Website"
                      multiline
                      rows={4}
                      value={generalSettings.siteDescription}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })
                      }
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f8f9fa",
                          "&:hover fieldset": {
                            borderColor: "#6a1b9a",
                          },
                        },
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <FormControl fullWidth>
                      <InputLabel>Múi giờ</InputLabel>
                      <Select
                        value={generalSettings.timezone}
                        label="Múi giờ"
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                        }
                        sx={{
                          bgcolor: "#f8f9fa",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6a1b9a",
                          },
                        }}
                      >
                        <MenuItem value="Asia/Ho_Chi_Minh">Châu Á/Hồ Chí Minh (GMT+7)</MenuItem>
                        <MenuItem value="UTC">UTC (GMT+0)</MenuItem>
                        <MenuItem value="America/New_York">America/New York (EST)</MenuItem>
                        <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                      </Select>
                    </FormControl>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <FormControl fullWidth>
                      <InputLabel>Ngôn ngữ mặc định</InputLabel>
                      <Select
                        value={generalSettings.language}
                        label="Ngôn ngữ mặc định"
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, language: e.target.value })
                        }
                        sx={{
                          bgcolor: "#f8f9fa",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6a1b9a",
                          },
                        }}
                      >
                        <MenuItem value="vi">Tiếng Việt</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                      </Select>
                    </FormControl>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card 
                    sx={{ 
                      bgcolor: "white", 
                      p: 4, 
                      borderRadius: 2, 
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: "2px solid #fff3e0",
                      background: "linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={generalSettings.maintenanceMode}
                          onChange={(e) =>
                            setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#ff9800",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#ff9800",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ color: "#e65100" }}>
                            Chế độ bảo trì
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Tạm thời vô hiệu hóa quyền truy cập công khai vào nền tảng
                          </Typography>
                        </Box>
                      }
                    />
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Security Settings Tab */}
            <TabPanel value={activeTab} index={3}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: "#2c3e50" }}>
                  Cài đặt bảo mật
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.05rem" }}>
                  Quản lý xác thực và kiểm soát truy cập hệ thống
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Card 
                    sx={{ 
                      bgcolor: "white", 
                      p: 4, 
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: "2px solid #e8eaf6",
                      background: "linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)",
                    }}
                  >
                    <Stack spacing={3}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.twoFactorAuth}
                            onChange={(e) =>
                              setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })
                            }
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#6a1b9a",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#6a1b9a",
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ color: "#4a148c" }}>
                              Xác thực hai yếu tố (2FA)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Yêu cầu 2FA cho tất cả tài khoản quản trị viên
                            </Typography>
                          </Box>
                        }
                      />
                    </Stack>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <TextField
                      fullWidth
                      label="Thời gian chờ phiên (phút)"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })
                      }
                      helperText="Tự động đăng xuất sau thời gian không hoạt động"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f8f9fa",
                          "&:hover fieldset": {
                            borderColor: "#6a1b9a",
                          },
                        },
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <TextField
                      fullWidth
                      label="Thời hạn mật khẩu (ngày)"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) =>
                        setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })
                      }
                      helperText="Buộc thay đổi mật khẩu sau"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f8f9fa",
                          "&:hover fieldset": {
                            borderColor: "#6a1b9a",
                          },
                        },
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <TextField
                      fullWidth
                      label="Số lần đăng nhập tối đa"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })
                      }
                      helperText="Khóa tài khoản sau số lần thất bại"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f8f9fa",
                          "&:hover fieldset": {
                            borderColor: "#6a1b9a",
                          },
                        },
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <TextField
                      fullWidth
                      label="Danh sách IP cho phép"
                      multiline
                      rows={4}
                      value={securitySettings.ipWhitelist}
                      onChange={(e) =>
                        setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })
                      }
                      placeholder="Nhập địa chỉ IP được phép (mỗi dòng một IP)"
                      helperText="Để trống để cho phép tất cả các IP"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f8f9fa",
                          "&:hover fieldset": {
                            borderColor: "#6a1b9a",
                          },
                        },
                      }}
                    />
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Notifications Settings Tab */}
            <TabPanel value={activeTab} index={3}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: "#2c3e50" }}>
                  Cài đặt thông báo
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.05rem" }}>
                  Cấu hình tùy chọn thông báo email và hệ thống
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Card 
                    sx={{ 
                      bgcolor: "white", 
                      p: 4, 
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: "2px solid #e3f2fd",
                      background: "linear-gradient(135deg, #e1f5fe 0%, #ffffff 100%)",
                    }}
                  >
                    <Stack spacing={3}>
                      <Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationSettings.emailNotifications}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  emailNotifications: e.target.checked,
                                })
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#0288d1",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "#0288d1",
                                },
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="h6" fontWeight={600} sx={{ color: "#01579b" }}>
                                Thông báo Email
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Bật tất cả thông báo qua email
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>
                      <Divider sx={{ borderColor: "#b3e5fc" }} />
                      <Box sx={{ pl: 3, bgcolor: "rgba(255,255,255,0.6)", borderRadius: 2, p: 2 }}>
                        <Stack spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.newBusinessAlert}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    newBusinessAlert: e.target.checked,
                                  })
                                }
                                disabled={!notificationSettings.emailNotifications}
                                size="small"
                              />
                            }
                            label={
                              <Typography variant="body2" fontWeight={500}>
                                Cảnh báo đăng ký doanh nghiệp mới
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.approvalReminder}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    approvalReminder: e.target.checked,
                                  })
                                }
                                disabled={!notificationSettings.emailNotifications}
                                size="small"
                              />
                            }
                            label={
                              <Typography variant="body2" fontWeight={500}>
                                Nhắc nhở phê duyệt đang chờ
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.systemAlerts}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    systemAlerts: e.target.checked,
                                  })
                                }
                                disabled={!notificationSettings.emailNotifications}
                                size="small"
                              />
                            }
                            label={
                              <Typography variant="body2" fontWeight={500}>
                                Cảnh báo và lỗi hệ thống
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.weeklyReport}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    weeklyReport: e.target.checked,
                                  })
                                }
                                disabled={!notificationSettings.emailNotifications}
                                size="small"
                              />
                            }
                            label={
                              <Typography variant="body2" fontWeight={500}>
                                Báo cáo hoạt động hàng tuần
                              </Typography>
                            }
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* System Settings Tab */}
            <TabPanel value={activeTab} index={5}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: "#2c3e50" }}>
                  Cài đặt hệ thống
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.05rem" }}>
                  Cấu hình hành vi hệ thống và cài đặt hiệu suất
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      bgcolor: "white", 
                      p: 3, 
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: "2px solid #e8f5e9",
                      background: "linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%)",
                      minHeight: 140,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.cacheEnabled}
                          onChange={(e) =>
                            setSystemSettings({ ...systemSettings, cacheEnabled: e.target.checked })
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#4caf50",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#4caf50",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ color: "#2e7d32" }}>
                            Bật Cache
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Cải thiện hiệu suất với bộ nhớ đệm
                          </Typography>
                        </Box>
                      }
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card 
                    sx={{ 
                      bgcolor: "white", 
                      p: 3, 
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: "2px solid #ffebee",
                      background: "linear-gradient(135deg, #ffebee 0%, #ffffff 100%)",
                      minHeight: 140,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.debugMode}
                          onChange={(e) =>
                            setSystemSettings({ ...systemSettings, debugMode: e.target.checked })
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#f44336",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#f44336",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ color: "#c62828" }}>
                            Chế độ Debug
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Hiển thị thông báo lỗi chi tiết
                          </Typography>
                        </Box>
                      }
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <FormControl fullWidth>
                      <InputLabel>Mức độ Log</InputLabel>
                      <Select
                        value={systemSettings.logLevel}
                        label="Mức độ Log"
                        onChange={(e) =>
                          setSystemSettings({ ...systemSettings, logLevel: e.target.value })
                        }
                        sx={{
                          bgcolor: "#f8f9fa",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6a1b9a",
                          },
                        }}
                      >
                        <MenuItem value="error">Lỗi</MenuItem>
                        <MenuItem value="warning">Cảnh báo</MenuItem>
                        <MenuItem value="info">Thông tin</MenuItem>
                        <MenuItem value="debug">Debug</MenuItem>
                      </Select>
                    </FormControl>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <FormControl fullWidth>
                      <InputLabel>Tần suất sao lưu</InputLabel>
                      <Select
                        value={systemSettings.backupFrequency}
                        label="Tần suất sao lưu"
                        onChange={(e) =>
                          setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })
                        }
                        sx={{
                          bgcolor: "#f8f9fa",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6a1b9a",
                          },
                        }}
                      >
                        <MenuItem value="hourly">Mỗi giờ</MenuItem>
                        <MenuItem value="daily">Hàng ngày</MenuItem>
                        <MenuItem value="weekly">Hàng tuần</MenuItem>
                        <MenuItem value="monthly">Hàng tháng</MenuItem>
                      </Select>
                    </FormControl>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      border: "2px solid #fff3e0",
                      "& .MuiAlert-icon": {
                        fontSize: 28,
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Cài đặt tự động phê duyệt
                    </Typography>
                    <Typography variant="body2">
                      Cẩn thận khi bật tính năng này. Nó sẽ tự động chấp thuận mà không cần xem xét thủ công.
                    </Typography>
                  </Alert>
                  <Card 
                    sx={{ 
                      bgcolor: "white", 
                      p: 4, 
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: "2px solid #fff3e0",
                      background: "linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings.autoApproval}
                          onChange={(e) =>
                            setSystemSettings({ ...systemSettings, autoApproval: e.target.checked })
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#ff9800",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#ff9800",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ color: "#e65100" }}>
                            Tự động phê duyệt đăng ký doanh nghiệp
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Tự động phê duyệt đăng ký doanh nghiệp mới mà không cần xem xét thủ công
                          </Typography>
                        </Box>
                      }
                    />
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Appearance Settings Tab */}
            <TabPanel value={activeTab} index={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700} sx={{ color: "#2c3e50" }}>
                  Cài đặt giao diện
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.05rem" }}>
                  Tùy chỉnh giao diện và cảm nhận của bảng điều khiển quản trị
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Alert 
                    severity="info"
                    sx={{
                      borderRadius: 2,
                      border: "2px solid #e3f2fd",
                      "& .MuiAlert-icon": {
                        fontSize: 28,
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Tính năng sắp ra mắt
                    </Typography>
                    <Typography variant="body2">
                      Các tùy chọn tùy chỉnh giao diện sẽ sớm ra mắt. Điều này sẽ cho phép bạn tùy chỉnh
                      chủ đề, màu sắc và các yếu tố thương hiệu.
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Card 
                    sx={{ 
                      bgcolor: "white", 
                      p: 4, 
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: "2px solid #f5f5f5",
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                      Chủ đề hiện tại
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Chip 
                        label="Chế độ sáng" 
                        color="primary" 
                        variant="outlined"
                        sx={{ 
                          fontSize: "1rem", 
                          py: 2.5, 
                          px: 2,
                          fontWeight: 600,
                        }}
                      />
                      <Chip 
                        label="Màu mặc định" 
                        color="default" 
                        variant="outlined"
                        sx={{ 
                          fontSize: "1rem", 
                          py: 2.5, 
                          px: 2,
                          fontWeight: 600,
                        }}
                      />
                      <Chip 
                        label="Responsive Design" 
                        sx={{ 
                          fontSize: "1rem", 
                          py: 2.5, 
                          px: 2,
                          fontWeight: 600,
                          bgcolor: "#f3e5f5",
                          color: "#6a1b9a",
                        }}
                      />
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Action Buttons */}
            <Box 
              sx={{ 
                mt: 5, 
                pt: 4,
                borderTop: "2px solid #e0e0e0",
                display: "flex", 
                gap: 3, 
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleResetSettings}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderWidth: 2,
                  borderColor: "#9e9e9e",
                  color: "#616161",
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: "#6a1b9a",
                    color: "#6a1b9a",
                    bgcolor: "#f3e5f5",
                  },
                }}
              >
                Đặt lại mặc định
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveSettings}
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)",
                  boxShadow: "0 4px 12px 2px rgba(156, 39, 176, .3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(45deg, #7b1fa2 30%, #ab47bc 90%)",
                    boxShadow: "0 6px 16px 3px rgba(156, 39, 176, .4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Lưu thay đổi
              </Button>
            </Box>
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
            boxShadow: '0 12px 40px rgba(106, 27, 154, 0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
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
            <Grid item xs={12}>
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

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
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

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
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

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
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

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
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

            <Grid item xs={12}>
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
              background: "linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)",
              boxShadow: "0 4px 12px 2px rgba(156, 39, 176, .3)",
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : (editingPolicy ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Reward Setting Modal */}
      <Dialog
        open={rewardSettingModalOpen}
        onClose={handleCloseRewardSettingModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(106, 27, 154, 0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
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
            <AdminPanelSettings sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700}>
              {editingRewardSetting ? 'Edit Reward Setting' : 'Create Reward Setting'}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseRewardSettingModal}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 3, px: 4, mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Reward Success"
                type="number"
                name="rewardSuccess"
                value={rewardSettingFormData.rewardSuccess}
                onChange={handleRewardSettingFormChange}
                required
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Reward Late"
                type="number"
                name="rewardLate"
                value={rewardSettingFormData.rewardLate}
                onChange={handleRewardSettingFormChange}
                required
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Reward Failed"
                type="number"
                name="rewardFailed"
                value={rewardSettingFormData.rewardFailed}
                onChange={handleRewardSettingFormChange}
                required
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Ranking Success"
                type="number"
                name="rankingSuccess"
                value={rewardSettingFormData.rankingSuccess}
                onChange={handleRewardSettingFormChange}
                required
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Ranking Late"
                type="number"
                name="rankingLate"
                value={rewardSettingFormData.rankingLate}
                onChange={handleRewardSettingFormChange}
                required
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Ranking Failed Penalty"
                type="number"
                name="rankingFailedPenalty"
                value={rewardSettingFormData.rankingFailedPenalty}
                onChange={handleRewardSettingFormChange}
                required
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 3, gap: 2 }}>
          <Button
            onClick={handleCloseRewardSettingModal}
            variant="outlined"
            sx={{
              px: 3,
              py: 1,
              borderColor: '#9e9e9e',
              color: '#616161',
              '&:hover': {
                borderColor: '#6a1b9a',
                color: '#6a1b9a',
                bgcolor: '#f3e5f5',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRewardSetting}
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)',
              boxShadow: '0 4px 12px 2px rgba(156, 39, 176, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7b1fa2 30%, #ab47bc 90%)',
              },
            }}
          >
            {editingRewardSetting ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
