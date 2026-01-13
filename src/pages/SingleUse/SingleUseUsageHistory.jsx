import { useEffect, useMemo, useState } from "react";
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
import { getDetailSingleUseMyApi } from "../../store/slices/singleUseSlice";

export default function SingleUseUsageHistory({ role = "business" }) {
  const dispatch = useDispatch();
  const {
    singleUseDetailMy = [],
    singleUseMyTotalPages = 0,
    isLoading,
  } = useSelector((state) => state.singleUse);

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(getDetailSingleUseMyApi({ page, limit }));
  }, [dispatch, page]);

  const items = useMemo(
    () => (Array.isArray(singleUseDetailMy) ? singleUseDetailMy : []),
    [singleUseDetailMy]
  );

  const toVNDate = (d) =>
    d ? new Date(d).toLocaleString("vi-VN") : "N/A";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f7f9f8", minHeight: "100vh" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0b5529" }}>
          Single-use Usage History ({role === "staff" ? "Staff" : "Business"})
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

