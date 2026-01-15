import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Stack,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import { FaLeaf, FaBoxOpen, FaQrcode } from "react-icons/fa";
import { getDetailSingleUseMyApi, clearSingleUseDetailMy } from "../../store/slices/singleUseSlice";
import { getUserRole, isAuthenticated } from "../../utils/authUtils";

export default function SingleUseUsageHistory({ role = "business" }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { userInfo } = useSelector((state) => state.user);
  const {
    singleUseDetailMy = [],
    singleUseMyTotalPages = 0,
    isLoading,
  } = useSelector((state) => state.singleUse);

  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Track previous role
  const prevRoleRef = useRef(role);
  const hasMountedRef = useRef(false);

  // Clear state and reset page when role changes
  useEffect(() => {
    if (prevRoleRef.current !== role) {
      console.log('[SingleUseUsageHistory] Role changed from', prevRoleRef.current, 'to', role);
      dispatch(clearSingleUseDetailMy());
      prevRoleRef.current = role;
      hasMountedRef.current = false;
      setPage(1);
    }
  }, [dispatch, role]);

  // Initial fetch on mount or when role/userInfo changes - wait for userInfo to be loaded
  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('[SingleUseUsageHistory] User not authenticated, skipping initial fetch');
      return;
    }

    // For customer role, wait for userInfo to be loaded before fetching
    // This ensures backend has the user context ready
    if (role === 'customer' && !userInfo) {
      console.log('[SingleUseUsageHistory] Waiting for userInfo to load...');
      return;
    }

    if (hasMountedRef.current) {
      return; // Already mounted and fetched
    }

    console.log('[SingleUseUsageHistory] Component mounting or role/userInfo changed, fetching initial data');
    hasMountedRef.current = true;
    dispatch(clearSingleUseDetailMy());
    
    // Small delay to ensure everything is ready, especially for customer role
    const delay = role === 'customer' ? 300 : 100;
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        console.log('[SingleUseUsageHistory] Executing initial fetch with page:', 1, 'limit:', limit, 'role:', role, 'userInfo:', !!userInfo);
        dispatch(getDetailSingleUseMyApi({ page: 1, limit }))
          .unwrap()
          .then((payload) => {
            console.log('[SingleUseUsageHistory] Initial fetch successful, payload:', payload);
            // If data is empty, try fetching again after a short delay
            // This handles the case where backend needs more time to prepare data
            if (payload?.data && Array.isArray(payload.data) && payload.data.length === 0 && payload.total === 0) {
              console.log('[SingleUseUsageHistory] Data is empty, retrying fetch after delay...');
              setTimeout(() => {
                dispatch(getDetailSingleUseMyApi({ page: 1, limit }))
                  .unwrap()
                  .then((retryPayload) => {
                    console.log('[SingleUseUsageHistory] Retry fetch successful, payload:', retryPayload);
                  })
                  .catch((error) => {
                    console.error('[SingleUseUsageHistory] Retry fetch failed:', error);
                  });
              }, 500);
            }
          })
          .catch((error) => {
            console.error('[SingleUseUsageHistory] Initial fetch failed:', error);
          });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [dispatch, limit, role, userInfo]);

  // Fetch data when userInfo is loaded (for customer role) - retry if data was empty before
  useEffect(() => {
    if (!hasMountedRef.current || !isAuthenticated()) {
      return;
    }

    // For customer role, fetch again when userInfo is loaded
    // This handles the case where initial fetch happened before userInfo was ready
    if (role === 'customer' && userInfo && singleUseDetailMy.length === 0) {
      console.log('[SingleUseUsageHistory] userInfo loaded and data is empty, fetching again...');
      dispatch(getDetailSingleUseMyApi({ page: 1, limit }))
        .unwrap()
        .then((payload) => {
          console.log('[SingleUseUsageHistory] userInfo fetch successful, payload:', payload);
        })
        .catch((error) => {
          console.error('[SingleUseUsageHistory] userInfo fetch failed:', error);
        });
    }
  }, [dispatch, role, userInfo, limit, singleUseDetailMy.length]);

  // Fetch data when page changes (after initial mount)
  useEffect(() => {
    if (!hasMountedRef.current || !isAuthenticated()) {
      return;
    }

    if (page === 1) {
      // Page 1 is handled by initial fetch or userInfo fetch
      return;
    }

    console.log('[SingleUseUsageHistory] Page changed to', page, 'fetching data');
    dispatch(getDetailSingleUseMyApi({ page, limit }))
      .unwrap()
      .then((payload) => {
        console.log('[SingleUseUsageHistory] Page fetch successful, payload:', payload);
      })
      .catch((error) => {
        console.error('[SingleUseUsageHistory] Page fetch failed:', error);
      });
  }, [dispatch, page, limit]);

  const items = useMemo(
    () => {
      const result = Array.isArray(singleUseDetailMy) ? singleUseDetailMy : [];
      console.log('[SingleUseUsageHistory] Items from Redux:', result, 'isLoading:', isLoading);
      return result;
    },
    [singleUseDetailMy, isLoading]
  );

  const toVNDate = (d) =>
    d ? new Date(d).toLocaleString("vi-VN") : "N/A";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f7f9f8", minHeight: "100vh" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0b5529" }}>
          Single-use Usage History ({role === "staff" ? "Staff" : role === "customer" ? "Customer" : "Business"})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Single-use consumption log with CO₂, staff, and Tx hash.
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CO₂ (kg)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tx Hash</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Staff</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No data.</TableCell>
              </TableRow>
            ) : (
              items.map((item, idx) => {
                const product = item.product || {};
                const staff = item.staff || {};
                const co2 = item.co2PerUnit ?? product.co2Emission ?? 0;
                return (
                  <TableRow
                    key={item._id || idx}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    }}
                  >
                    <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          src={product.imageUrl}
                          alt={product.name}
                          sx={{ width: 40, height: 40, bgcolor: "#0b5529" }}
                        >
                          {product.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>{product.name || "N/A"}</Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            <Chip
                              icon={<FaBoxOpen />}
                              label={product.type || "Single-use"}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 700, height: 24 }}
                            />
                            <Chip
                              label={product.size || product.productSize || "N/A"}
                              size="small"
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {product.material || "N/A"} • {product.weight ?? "N/A"} g
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<FaLeaf />}
                        label={`${co2} kg`}
                        size="small"
                        color="success"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: "break-all",
                          fontFamily: "monospace",
                          background: "transparent",
                          color: "inherit",
                          p: 0.75,
                          borderRadius: 1,
                          border: "1px dashed #d0d7de",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          boxShadow: "none",
                        }}
                      >
                        <FaQrcode /> {item.blockchainTxHash || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{staff.fullName || "Staff"}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {staff.email || "N/A"} • {staff.phone || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{toVNDate(item.createdAt)}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {singleUseMyTotalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={singleUseMyTotalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            shape="rounded"
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}

