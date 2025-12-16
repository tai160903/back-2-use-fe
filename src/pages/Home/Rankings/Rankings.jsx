import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import banner from '../../../assets/image/banner3.jpg'
import './Rankings.css'
import { getLeaderBoardApiCustomer } from '../../../store/slices/leaderBoardSlice'
// no hidden toggle anymore

export default function Rankings() {
  const dispatch = useDispatch()
  const { leaderBoard, isLoading } = useSelector((state) => state.leaderBoard)
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const monthOptions = Array.from({ length: 12 }, (unused, index) => index + 1)
  const yearOptions = Array.from({ length: 5 }, (unused, index) => currentYear - index)

  useEffect(() => {
    const requestParams = {
      month: selectedMonth,
      year: selectedYear,
      page: 1,
      limit: 50,
    }

    dispatch(getLeaderBoardApiCustomer(requestParams))
  }, [dispatch, selectedMonth, selectedYear])

  const leaderBoardData = Array.isArray(leaderBoard) ? leaderBoard : []
  const topThreeCustomers = leaderBoardData.slice(0, 3)
  const hasLeaderBoardData = topThreeCustomers.length > 0 || leaderBoardData.length > 0

  return (
    <Box className={`rankings-page`}>
      {/* Banner */}
      <Box className="rankings-banner" sx={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${banner})` }}>
        <Container maxWidth="xl">
          <Box className="rankings-banner-content">
            <Typography variant="h2" component="h1" className="rankings-title">
              Champions Rankings
            </Typography>
            <Typography variant="h6" className="rankings-subtitle">
              Top 50 customers rankings for the month of {selectedMonth} / {selectedYear}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Filters always visible above the leaderboard */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 2 }}>
        <Box className="rankings-filters">
          <FormControl size="small" className="filter-control">
            <InputLabel id="month-select-label">Tháng</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              label="Month"
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {monthOptions.map((monthValue) => (
                <MenuItem key={monthValue} value={monthValue}>
                  Month {monthValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" className="filter-control">
            <InputLabel id="year-select-label">Năm</InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              label="year"
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              {yearOptions.map((yearValue) => (
                <MenuItem key={yearValue} value={yearValue}>
                  Year {yearValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Container>

      {isLoading ? (
        <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
          <Box className="rankings-empty">
            <Typography variant="h6" className="rankings-empty-title">
              Loading leaderboard...
            </Typography>
            <Typography variant="body2" className="rankings-empty-subtitle">
              Please wait while we fetch the latest rankings for this period.
            </Typography>
          </Box>
        </Container>
      ) : !hasLeaderBoardData ? (
        <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
          <Box className="rankings-empty">
            <Typography variant="h5" className="rankings-empty-title">
              No rankings available yet
            </Typography>
            <Typography variant="body1" className="rankings-empty-subtitle">
              There is no leaderboard data for month {selectedMonth} / {selectedYear} yet.
              Once customers start earning ranking points this month, their names will appear here.
            </Typography>
          </Box>
        </Container>
      ) : (
        <>
          {/* Top 3 */}
          <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
              {topThreeCustomers.map((leaderBoardEntry, index) => {
                const displayName =
                  (leaderBoardEntry.customerId && leaderBoardEntry.customerId.fullName) ||
                  `Khách hàng #${leaderBoardEntry.rank ?? index + 1}`
                const avatarUrl = leaderBoardEntry.customerId?.userId?.avatar
                const initials = displayName
                  .split(' ')
                  .filter(Boolean)
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)

                return (
                  <Grid
                    key={leaderBoardEntry._id || `${index}`}
                    item
                    size={3}
                    sm={6}
                    md={4}
                    lg={4}
                  >
                    <Card
                      className={`podium-card podium-${index + 1} podium-large top-card`}
                      elevation={3}
                      sx={{
                        background:
                          index === 0
                            ? 'linear-gradient(145deg, #fff6d1 0%, #ffe89a 50%, #ffffff 100%)'
                            : index === 1
                            ? 'linear-gradient(145deg, #f5f8ff 0%, #dfe9ff 50%, #ffffff 100%)'
                            : 'linear-gradient(145deg, #fff1e8 0%, #ffd9bf 50%, #ffffff 100%)',
                      }}
                    >
                      <CardContent sx={{ pt: 5 }}>
                        <Box textAlign="center">
                          <Avatar
                            sx={{ width: 96, height: 96, mx: 'auto', mb: 1.5 }}
                            src={avatarUrl}
                          >
                            {!avatarUrl && initials}
                          </Avatar>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 900, marginBottom: '20px' }}
                          >
                            {displayName}
                          </Typography>
                          <Chip
                            className="pill pill-large"
                            label={`Ranking Points ${leaderBoardEntry.rankingPoints ?? 0}`}
                          />
                        </Box>

                        <Box className="podium-ribbon">
                          <span>{index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}</span>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Container>

          {/* Top 50 List (div-based, không dùng Table) */}
          <Container style={{ pb: 6, maxWidth: '1600px' }}>
            <Box className="rankings-table">
              <Box className="rankings-list">
                <Box className="list-header">
                  <div className="cell cell-name">Name</div>
                  <div className="cell cell-right">Legit Point</div>
                </Box>
                {leaderBoardData.map((leaderBoardEntry, index) => {
                  const displayName =
                    (leaderBoardEntry.customerId && leaderBoardEntry.customerId.fullName) ||
                    `Khách hàng #${leaderBoardEntry.rank ?? index + 1}`
                  const firstCharacter = displayName.charAt(0).toUpperCase()
                  const avatarUrl = leaderBoardEntry.customerId?.userId?.avatar
                  return (
                    <Box
                      key={leaderBoardEntry._id || `${index}`}
                      className={`list-row rank-${leaderBoardEntry.rank} ${
                        leaderBoardEntry.rank <= 3 ? 'rank-top' : ''
                      }`}
                    >
                      <div className="cell cell-name">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <div className={`rank-badge rank-badge-${leaderBoardEntry.rank}`}>
                            {leaderBoardEntry.rank}
                          </div>
                          <Avatar sx={{ width: 32, height: 32 }} src={avatarUrl}>
                            {!avatarUrl && firstCharacter}
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {displayName}
                          </Typography>
                        </Stack>
                      </div>
                      <div className="cell cell-right">
                        <Chip
                          className="pill"
                          size="small"
                          label={`Ranking Points ${leaderBoardEntry.rankingPoints ?? 0}`}
                        />
                      </div>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Container>
        </>
      )}
    </Box>
  )
}
