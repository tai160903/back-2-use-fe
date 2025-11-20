import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderboardRewardApi } from "../../../store/slices/adminSlice";
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
  Pagination,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import { FaMedal, FaTrophy, FaLeaf } from "react-icons/fa";
import { MdEmojiEvents, MdPerson } from "react-icons/md";
import { format } from "date-fns";
import "./LeaderBoard.css";

const LeaderBoard = () => {
  const dispatch = useDispatch();
  const { leaderboardRewards, leaderboardRewardPagination, isLoading } = useSelector(
    (state) => state.admin
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Load all leaderboard rewards on component mount
    dispatch(getLeaderboardRewardApi({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy color="#FFD700" size={28} />;
    if (rank === 2) return <FaMedal color="#6B7280" size={24} />;
    if (rank === 3) return <FaMedal color="#CD7F32" size={24} />;
    return null;
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#6B7280";
    if (rank === 3) return "#CD7F32";
    return "#12422a";
  };

  const getRankBackground = (rank) => {
    if (rank === 1) return "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)";
    if (rank === 2) return "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)";
    if (rank === 3) return "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)";
    return "transparent";
  };

  const getVoucherStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "redeemed":
        return "success";
      case "expired":
        return "error";
      case "active":
        return "primary";
      default:
        return "default";
    }
  };

  // Sort leaderboard rewards by rank (ascending: 1, 2, 3...)
  const sortedRewards = leaderboardRewards
    ? [...leaderboardRewards].sort((a, b) => {
        const rankA = a.leaderboard?.rank || 999;
        const rankB = b.leaderboard?.rank || 999;
        return rankA - rankB;
      })
    : [];

  // Calculate stats from all sorted data
  const totalRewards = sortedRewards?.length || 0;
  const topRank = sortedRewards?.[0]?.leaderboard?.rank || 0;
  const topPoints = sortedRewards?.[0]?.leaderboard?.rankingPoints || 0;
  const redeemedCount = sortedRewards?.filter(
    (item) => item.voucher?.status === "redeemed"
  ).length || 0;

  // Pagination logic - similar to Material page
  const totalPages = Math.ceil(sortedRewards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRewards = sortedRewards.slice(startIndex, endIndex);

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <div>
          <Typography variant="h1" fontWeight={700} fontSize={32} color="#1a1a1a" sx={{ mb: 1 }}>
            Leader Board Reward
          </Typography>
          <Typography variant="body1" color="#6b7280" fontSize={16}>
            View and manage leaderboard rewards for top users
          </Typography>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="leaderboard-stats">
        <div className="leaderboard-stat-card">
          <div className="stat-icon-wrapper eco-icon">
            <FaLeaf size={24} />
          </div>
          <div className="stat-content">
            <Typography className="stat-label">Total Rewards</Typography>
            <Typography className="stat-value">{totalRewards}</Typography>
            <Typography className="stat-hint">Total rewards awarded</Typography>
          </div>
        </div>

        <div className="leaderboard-stat-card">
          <div className="stat-icon-wrapper trophy-icon">
            <MdEmojiEvents size={24} />
          </div>
          <div className="stat-content">
            <Typography className="stat-label">Top Rank</Typography>
            <Typography className="stat-value">{topRank || "—"}</Typography>
            <Typography className="stat-hint">
              {topPoints > 0 ? `${topPoints.toLocaleString("en-US")} points` : "No data available"}
            </Typography>
          </div>
        </div>

        <div className="leaderboard-stat-card highlight">
          <div className="stat-icon-wrapper person-icon">
            <MdPerson size={24} />
          </div>
          <div className="stat-content">
            <Typography className="stat-label">Redeemed</Typography>
            <Typography className="stat-value">{redeemedCount}</Typography>
            <Typography className="stat-hint">
              {totalRewards > 0
                ? `${((redeemedCount / totalRewards) * 100).toFixed(0)}% redeemed`
                : "No data available"}
            </Typography>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} className="leaderboard-table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="leaderboard-table-header">Rank</TableCell>
                  <TableCell className="leaderboard-table-header">User</TableCell>
                  <TableCell className="leaderboard-table-header" align="right">
                    Points
                  </TableCell>
                  <TableCell className="leaderboard-table-header">Voucher</TableCell>
                  <TableCell className="leaderboard-table-header">Status</TableCell>
                  <TableCell className="leaderboard-table-header">Reward Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageRewards && currentPageRewards.length > 0 ? (
                  currentPageRewards.map((item, index) => {
                    const rank = item.leaderboard?.rank || startIndex + index + 1;
                    const customer = item.leaderboard?.customer || {};
                    const voucher = item.voucher || {};
                    const isTopThree = rank <= 3;

                    return (
                      <TableRow
                        key={item.rewardId || index}
                        className={`leaderboard-table-row ${isTopThree ? "top-rank" : ""}`}
                        sx={{
                          background: isTopThree ? getRankBackground(rank) : "transparent",
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            {getRankIcon(rank)}
                            <Typography
                              variant="body1"
                              fontWeight={isTopThree ? 700 : 600}
                              sx={{
                                color: getRankBadgeColor(rank),
                                fontSize: isTopThree ? "18px" : "16px",
                              }}
                            >
                              #{rank}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                              {customer.fullName || "N/A"}
                            </Typography>
                            {customer.phone && (
                              <Typography variant="caption" color="text.secondary">
                                {customer.phone}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body1"
                            fontWeight={700}
                            sx={{ color: "#12422a", fontSize: "16px" }}
                          >
                            {item.leaderboard?.rankingPoints?.toLocaleString("en-US") || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            points
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                              {voucher.code || "—"}
                            </Typography>
                            {item.policy?.note && (
                              <Typography variant="caption" color="text.secondary">
                                {item.policy.note}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={voucher.status || "N/A"}
                            color={getVoucherStatusColor(voucher.status)}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.rewardedAt
                              ? format(new Date(item.rewardedAt), "dd/MM/yyyy HH:mm")
                              : "—"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <FaLeaf size={48} color="#d1d5db" />
                        <Typography variant="body1" color="text.secondary" fontWeight={600}>
                          No leaderboard data available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data will be displayed when rewards are awarded
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!isLoading && sortedRewards.length > 0 && (
            <Stack
              spacing={2}
              className="leaderboard-pagination"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 4,
                mb: 4,
              }}
            >
              <Pagination
                count={totalPages > 0 ? totalPages : 1}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      backgroundColor: "#12422a",
                      color: "#ffffff",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#0d2e1c",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(18, 66, 42, 0.1)",
                    },
                  },
                }}
              />
            </Stack>
          )}
        </>
      )}
    </div>
  );
};

export default LeaderBoard;
