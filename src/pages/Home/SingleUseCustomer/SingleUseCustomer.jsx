import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Tooltip,
  Pagination,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FaLeaf, FaUserTie, FaBoxOpen, FaLink } from "react-icons/fa";
import { MdSchedule } from "react-icons/md";
import { getAllSingleUseProductApi } from "../../../store/slices/singleUseSlice";
import { switchAccountTypeAPI, syncWithLocalStorage } from "../../../store/slices/authSlice";
import { getUserRole } from "../../../utils/authUtils";



const formatDateTime = (value) => {
  if (!value) return "No data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No data";
  return date.toLocaleString("vi-VN");
};

const formatCO2 = (value) => {
  if (value === null || value === undefined) return "Unknown";
  const num = Number(value);
  if (Number.isNaN(num)) return "Unknown";
  return `${num.toFixed(3)} kg CO₂`;
};

const truncateMiddle = (value = "", left = 10, right = 6) => {
  if (!value) return "Not available";
  if (value.length <= left + right) return value;
  return `${value.slice(0, left)}...${value.slice(-right)}`;
};

export default function SingleUseCustomer() {
  const dispatch = useDispatch();
  const {
    singleUseUsage = [],
    singleUseUsageTotalPages = 1,
    isLoading,
    error,
  } = useSelector((state) => state.singleUse);

  const [page, setPage] = useState(1);
  const [roleReady, setRoleReady] = useState(false);
  const [roleError, setRoleError] = useState(null);
  const limit = 6;
  const showLoading = isLoading || (!roleReady && !roleError);

  const logState = (label, extra = {}) => {
    try {
      const currentUserRaw = localStorage.getItem("currentUser");
      const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
      console.log("[SingleUseCustomer]", label, {
        role: getUserRole(),
        tokenPrefix: currentUser?.accessToken?.slice(0, 12),
        hasRefresh: !!currentUser?.refreshToken,
        extra,
      });
    } catch (err) {
      console.warn("[SingleUseCustomer] logState error", err);
    }
  };


  useEffect(() => {

    dispatch(syncWithLocalStorage());
    logState("init");

    const ensureCustomerRole = async () => {
      try {
        setRoleError(null);
        const res = await dispatch(switchAccountTypeAPI({ role: "customer" })).unwrap();
        logState("switched to customer", { res });
        dispatch(syncWithLocalStorage());
        setRoleReady(true);
      } catch (err) {
        const msg =  "";
        logState("switch role error", { msg });

        if (msg.toLowerCase().includes("already in the selected role")) {
          setRoleReady(true);
          setRoleError(null);
          return;
        }      
        setRoleReady(true);
      }
    };

    ensureCustomerRole();
  }, [dispatch]);

  useEffect(() => {
    if (!roleReady) return;
    logState("fetch usage start", { page, limit });
    dispatch(getAllSingleUseProductApi({ page, limit }))
      .unwrap()
      .then((data) => {
        logState("fetch usage success", { total: data?.total, count: data?.data?.length });
      })
      .catch((err) => {
        console.error("[SingleUseCustomer] fetch usage error", err);
      });
  }, [dispatch, page, roleReady]);

  useEffect(() => {
    logState("slice update", {
      isLoading,
      error,
      dataCount: Array.isArray(singleUseUsage) ? singleUseUsage.length : null,
    });
  }, [isLoading, error, singleUseUsage]);

  const hasData = useMemo(() => Array.isArray(singleUseUsage) && singleUseUsage.length > 0, [singleUseUsage]);

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h4" fontWeight={800}>
          Single-use product history
        </Typography>
  
      </Box>

      {(error || roleError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {roleError ||
            (typeof error === "string"
              ? error
              : "Cannot load data. Please try again.")}
        </Alert>
      )}

      {showLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      ) : hasData ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: "0 16px 48px rgba(15, 23, 42, 0.08)",
              overflow: "hidden",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Type / Size / Material</TableCell>
                  <TableCell>CO₂ per unit</TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell>Tx hash</TableCell>
                  <TableCell>Created at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {singleUseUsage.map((item) => {
                  const product = item?.product || {};
                  const staff = item?.staff || {};
                  return (
                    <TableRow
                      key={item?._id || item?.borrowTransactionId}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={product.imageUrl || ""}
                            alt={product.name || "Product"}
                            sx={{ width: 56, height: 56 }}
                          />
                          <Stack spacing={0.5}>
                            <Typography fontWeight={700}>{product.name || "Unknown name"}</Typography>
                            <Chip
                              size="small"
                              icon={<FaLeaf size={14} />}
                              label="Single-use"
                              color="success"
                              variant="outlined"
                              sx={{ width: "fit-content" }}
                            />
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {product.type && (
                            <Chip size="small" icon={<FaBoxOpen size={14} />} label={product.type} />
                          )}
                          {product.size && <Chip size="small" label={product.size} />}
                          {product.material && (
                            <Chip size="small" color="primary" variant="outlined" label={product.material} />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{formatCO2(item?.co2PerUnit)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <FaUserTie size={14} color="#6b7280" />
                            <Typography fontWeight={600}>{staff.fullName || "N/A"}</Typography>
                          </Stack>
                    
                        
                        </Stack>
                      </TableCell>
                   
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <FaLink size={14} color="#6b7280" />
                          <Tooltip title={item?.blockchainTxHash || "Not available"}>
                            <Typography variant="body2" color="text.secondary">
                              {truncateMiddle(item?.blockchainTxHash)}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <MdSchedule size={16} color="#6b7280" />
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(item?.createdAt)}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack alignItems="center" mt={3}>
            <Pagination
              color="primary"
              count={singleUseUsageTotalPages || 1}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
            />
          </Stack>
        </>
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <Typography color="text.secondary">No usage history yet.</Typography>
        </Stack>
      )}
    </Box>
  );
}
