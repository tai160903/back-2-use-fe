import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  MdCheckCircle,
  MdOutlinePauseCircle,
  MdAdd,
  MdModeEdit,
  MdStars,
} from "react-icons/md";
import { FaMedal } from "react-icons/fa";
import { addEcoRewardApi, editEcoRewardApi, getEcoRewardApi } from "../../../store/slices/ecoRewardSlice";
import {
  Button,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import "./EcoReward.css";
import toast from "react-hot-toast";

const REQUEST_PARAMS = { page: 1, limit: 50 };

const ITEMS_PER_PAGE = 3;

const DEFAULT_POLICY_VALUES = {
  _id: "",
  label: "",
  description: "",
  threshold: "",
  isActive: true,
};

const policySchema = yup.object({
  label: yup.string().trim().required("Tier label is required"),
  description: yup.string().trim(),
  threshold: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : Number(originalValue)
    )
    .typeError("Threshold must be a number")
    .min(0, "Threshold must be ≥ 0")
    .required("Threshold is required"),
  isActive: yup.boolean(),
});

const EcoReward = () => {
  const dispatch = useDispatch();
  const { items, error, status } = useSelector((state) => state.ecoreward);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(policySchema),
    defaultValues: DEFAULT_POLICY_VALUES,
  });

  useEffect(() => {
    dispatch(getEcoRewardApi(REQUEST_PARAMS));
  }, [dispatch]);

  const policies = Array.isArray(items) ? items : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [items?.length]);

  const totalPages = Math.ceil(policies.length / ITEMS_PER_PAGE);
  const paginatedPolicies = policies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const activeCount = policies.filter((policy) => policy.isActive).length;
  const topTier = [...policies].sort((a, b) => b.threshold - a.threshold)[0];
  const inactiveCount = policies.length - activeCount;

  const openCreateModal = () => {
    setModalMode("create");
    reset(DEFAULT_POLICY_VALUES);
    setIsModalOpen(true);
  };

  const openEditModal = (policy) => {
    setModalMode("edit");
    reset({
      _id: policy._id || "",
      label: policy.label || "",
      description: policy.description || "",
      threshold: policy.threshold?.toString() || "",
      isActive: Boolean(policy.isActive),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDetailModal = (policy) => {
    setSelectedPolicy(policy);
    setIsDetailOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setSelectedPolicy(null);
  };

  // logic create and edit eco reward
  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      threshold: Number(formData.threshold),
    };

    if (modalMode === "create") {
      try {
        await dispatch(addEcoRewardApi(payload)).unwrap();
        toast.success("Create Eco Reward tier successfully");
        await dispatch(getEcoRewardApi(REQUEST_PARAMS));
        reset(DEFAULT_POLICY_VALUES);
        setIsModalOpen(false);
      } catch (error) {
        const message =
          error?.message ||
          error?.data?.message ||
          "Unable to create Eco Reward tier";
        toast.error(message);
      }
    } else if (modalMode === "edit") {
      if (!payload._id) {
        toast.error("Cannot determine the tier to update");
        return;
      }
      const { _id, ...updateData } = payload;
      try {
        await dispatch(
          editEcoRewardApi({ id: _id, data: updateData })
        ).unwrap();
        toast.success("Edit Eco Reward tier successfully");
        await dispatch(getEcoRewardApi(REQUEST_PARAMS));
        reset(DEFAULT_POLICY_VALUES);
        setIsModalOpen(false);
      } catch (error) {
        const message =
          error?.message ||
          error?.data?.message ||
          "Unable to create Eco Reward tier";
        toast.error(message);
      }
    }
  };

  return (
    <div className="eco-reward-page">
      <header className="eco-reward-header">
        <div>
     
          <Typography variant="h1" fontWeight={700} fontSize={28} color="#0f172a">Eco Reward Policies</Typography>
          <Typography variant="body1" color="#c8c8ca" sx={{marginTop: 1}}>
            Monitor thresholds and statuses of eco-friendly reward tiers.
          </Typography>
        </div>
        <div className="eco-reward-header-actions">
          <Button
            variant="contained"
            color="success"
            startIcon={<MdAdd />}
            onClick={openCreateModal}
            className="eco-reward-action-btn"
          >
            Add policy
          </Button>
        </div>
      </header>

      <section className="eco-reward-stats">
        <article className="eco-reward-stat-card">
          <span className="stat-label">Total tiers</span>
          <strong className="stat-value">{policies.length}</strong>
          <span className="stat-hint">Number of displayed tiers</span>
        </article>
        <article className="eco-reward-stat-card">
          <span className="stat-label">Active tiers</span>
          <strong className="stat-value">{activeCount}</strong>
          <span className="stat-hint">
            {inactiveCount > 0
              ? `${inactiveCount} tier(s) paused`
              : "All tiers are active"}
          </span>
        </article>
        <article className="eco-reward-stat-card stat-highlight">
          <div className="stat-icon">
            <FaMedal size={28} color="white"/>
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            <span className="stat-label">Top tier</span>
            <strong className="stat-value">
              {topTier?.label || "Updating"}
            </strong>
            <span className="stat-hint">
              Threshold {topTier ? topTier.threshold?.toLocaleString("en-US") : 0}{" "}
              points
            </span>
          </div>
        </article>
      </section>
      {error && (
        <div className="eco-reward-alert error">
          Unable to load data from server.&nbsp;
          {error || "Please try again later."}
        </div>
      )}

      {!policies.length && status !== "loading" && (
        <div className="eco-reward-alert info">
          Currently no data for eco reward policies.
        </div>
      )}

      <section className="eco-reward-grid">
        {paginatedPolicies.map((policy) => (
          <article
            key={policy._id}
            className={`eco-reward-card ${
              policy.isActive ? "active" : "inactive"
            }`}
            onClick={() => openDetailModal(policy)}
          >
            <div className="eco-reward-card-header">
              <div className="eco-reward-card-primary">
                <p className="eco-reward-tier-label">{policy.label}</p>
                <p className="eco-reward-tier-desc">{policy.description}</p>
              </div>
              <div className="eco-reward-card-meta">
                <span
                  className={`eco-reward-status-badge ${
                    policy.isActive ? "active" : "inactive"
                  }`}
                >
                  {policy.isActive ? (
                    <MdCheckCircle size={16} />
                  ) : (
                    <MdOutlinePauseCircle size={16} />
                  )}
                  {policy.isActive ? "Active" : "Paused"}
                </span>

                <div className="eco-reward-card-actions">
                  <IconButton
                    className="eco-reward-edit-btn"
                    aria-label="Edit eco reward tier"
                    onClick={(event) => {
                      event.stopPropagation();
                      openEditModal(policy);
                    }}
                  >
                    <MdModeEdit size={18} />
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="eco-reward-card-body">
              <div className="eco-reward-card-stat">
                <p className="eco-reward-metric-label">Threshold</p>
                <p className="eco-reward-metric-value">
                  {policy.threshold?.toLocaleString("en-US")} points
                </p>
              </div>
        
            </div>
          
          </article>
        ))}
      </section>

      {policies.length > ITEMS_PER_PAGE && (
        <Stack
          spacing={2}
          className="eco-reward-pagination"
          sx={{ alignItems: "center" }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )}

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 12px 40px rgba(15, 23, 42, 0.25)",
          },
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background:
                "linear-gradient(135deg, #0f3b24 0%, #082414 100%)",
              color: "#fff",
              px: 4,
              py: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box className="eco-reward-modal-icon">
                <MdStars size={24} />
              </Box>
              <Box>
                <Typography variant="h5" component="div" fontWeight={700}>
                  {modalMode === "create"
                    ? "Create Eco Reward Tier"
                    : "Edit Eco Reward Tier"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {modalMode === "create"
                    ? "Add a new environmental reward milestone to the system"
                    : "Update the details of this reward milestone"}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={closeModal}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              ✕
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className="eco-reward-modal-content">
          <div className="eco-reward-form-grid">
            <Controller
              name="label"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tier label"
                  fullWidth
                  required
                  error={Boolean(errors.label)}
                  helperText={errors.label?.message}
                />
              )}
            />
            <Controller
              name="threshold"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Threshold points"
                  type="number"
                  fullWidth
                  required
                  error={Boolean(errors.threshold)}
                  helperText={errors.threshold?.message}
                />
              )}
            />
          </div>
          <div className="eco-reward-form-grid">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  minRows={3}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
          </div>
          <div className="eco-reward-form-toggle">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  }
                  labelPlacement="start"
                  label="Active status"
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            px: 4,
            py: 3,
            gap: 1.5,
            borderTop: "1px solid #eceff3",
          }}
        >
          <Button
            onClick={closeModal}
            variant="outlined"
            sx={{
              borderColor: "#d1d5db",
              color: "#475569",
              px: 3,
              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "rgba(148,163,184,0.08)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleFormSubmit(onSubmit)}
            disabled={status === "loading"}
            sx={{
              background:
                "linear-gradient(135deg, #0f3b24 0%, #082414 100%)",
              px: 3,
              boxShadow: "0 8px 20px rgba(8,36,20,0.35)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #082414 0%, #0f3b24 100%)",
              },
            }}
          >
            {modalMode === "create" ? "Create Tier" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail dialog */}
      <Dialog
        open={isDetailOpen}
        onClose={closeDetailModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.3)",
          },
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2.5,
              background:
                "linear-gradient(135deg, #0f3b24 0%, #082414 100%)",
              color: "#fff",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ textTransform: "uppercase", letterSpacing: ".12em" }}
              >
                Eco Reward Tier
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="h6" fontWeight={700}>
                  {selectedPolicy?.label}
                </Typography>
                {selectedPolicy && (
                  <span
                    className={`eco-reward-status-badge ${
                      selectedPolicy.isActive ? "active" : "inactive"
                    }`}
                  >
                    {selectedPolicy.isActive ? (
                      <MdCheckCircle size={16} />
                    ) : (
                      <MdOutlinePauseCircle size={16} />
                    )}
                    {selectedPolicy.isActive ? "Active" : "Paused"}
                  </span>
                )}
              </Box>
            </Box>
            <IconButton
              onClick={closeDetailModal}
              sx={{
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
              }}
            >
              ✕
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            px: 3,
            py: 3,
            backgroundColor: "#f9fafb",
          }}
        >
          {selectedPolicy && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.5,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedPolicy.description || "No description"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Threshold
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {selectedPolicy.threshold?.toLocaleString("en-US")} points
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created at
                </Typography>
                <Typography variant="body2">
                  {selectedPolicy.createdAt
                    ? new Date(selectedPolicy.createdAt).toLocaleString("en-US")
                    : "—"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Updated at
                </Typography>
                <Typography variant="body2">
                  {selectedPolicy.updatedAt
                    ? new Date(selectedPolicy.updatedAt).toLocaleString(
                        "en-US"
                      )
                    : "—"}
                </Typography>
              </Box>

           
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={closeDetailModal} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EcoReward;

