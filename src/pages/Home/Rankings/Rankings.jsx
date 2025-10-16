import React, { useMemo, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Stack,
} from '@mui/material'
import {
  EmojiEvents,
  AssignmentReturn,
  CheckCircleOutline,
  CancelOutlined,
} from '@mui/icons-material'
import banner from '../../../assets/image/banner3.jpg'
import './Rankings.css'
// no hidden toggle anymore

function getLastMonths(count = 12) {
  const months = []
  const now = new Date()
  for (let i = 0; i < count; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    months.push({ key, label })
  }
  return months
}

// Simple deterministic generator so each month is consistent
function seededRandom(seed) {
  let t = seed
  return () => {
    t = (t * 9301 + 49297) % 233280
    return t / 233280
  }
}

function toUsername(fullName) {
  return fullName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)
}

function generateMonthlyData(monthKey) {
  const seed = parseInt(monthKey.replace('-', ''), 10)
  const rand = seededRandom(seed)
  const strategies = ['Daytrader', 'Swing Trader', 'Short Bias']
  const instruments = ['Options', 'Stocks']

  const data = Array.from({ length: 50 }).map((_, index) => {
    const firstNames = ['Roger', 'Charlie', 'Ahmad', 'Cristofer', 'Dane', 'Nolan', 'Alex', 'Mia', 'Noah', 'Luna']
    const lastNames = ['Korsgaard', 'Herwitz', 'Mango', 'George', 'Parker', 'Foster', 'Nguyen', 'Tran', 'Le', 'Ho']
    const name = `${firstNames[Math.floor(rand() * firstNames.length)]} ${lastNames[Math.floor(rand() * lastNames.length)]}`
    const strategy = strategies[Math.floor(rand() * strategies.length)]
    const instrument = instruments[Math.floor(rand() * instruments.length)]
    const alerts = Math.floor(rand() * 25) + 5
    const trades = Math.floor(rand() * 520) + 50
    const gain = Math.floor(rand() * 21) + 70 // 70% - 90%
    const streaks = Math.floor(rand() * 16) // 0 - 15
    const xscore = Math.floor(rand() * 31) + 65 // 65 - 95

    // Borrow/Return statistics
    const borrowCount = Math.floor(rand() * 300) + 50
    const successRate = 0.82 + rand() * 0.15 // 82% - 97%
    const returnSuccess = Math.floor(borrowCount * successRate)
    const returnFailed = Math.max(0, borrowCount - returnSuccess)

    return {
      id: index + 1,
      name,
      strategy,
      instrument,
      alerts,
      trades,
      gain,
      streaks,
      xscore,
      borrowCount,
      returnSuccess,
      returnFailed,
    }
  })

  // Sort by xscore desc to rank
  data.sort((a, b) => b.xscore - a.xscore)
  return data.map((item, i) => ({ ...item, rank: i + 1 }))
}

export default function Rankings() {
  const months = useMemo(() => getLastMonths(12), [])
  const [selectedMonth, setSelectedMonth] = useState(months[0].key)
  const [search, setSearch] = useState('')
  

  const data = useMemo(() => generateMonthlyData(selectedMonth), [selectedMonth])
  const top3 = data.slice(0, 3)

  const filteredData = useMemo(() => {
    const s = search.trim().toLowerCase()
    if (!s) return data
    return data.filter((u) => u.name.toLowerCase().includes(s))
  }, [data, search])

  return (
    <Box className={`rankings-page`}>
      {/* Banner */}
      <Box className="rankings-banner" sx={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${banner})` }}>
        <Container maxWidth="lg">
          <Box className="rankings-banner-content">
            <Typography variant="h2" component="h1" className="rankings-title">
              Champions Rankings
            </Typography>
            <Typography variant="h6" className="rankings-subtitle">
              Bảng xếp hạng Top 50 theo tháng dựa trên Xscore
            </Typography>
            {/* Bộ lọc thời gian hiển thị ở toolbar phía trên bảng */}
          </Box>
        </Container>
      </Box>

      {/* Top 3 */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {top3.map((user, idx) => (
            <Grid key={user.id} item xs={12} sm={6} md={4} lg={4}>
              <Card
                className={`podium-card podium-${idx + 1} podium-large top-card`}
                elevation={3}
                sx={{
                  background:
                    idx === 0
                      ? 'linear-gradient(145deg, #fff6d1 0%, #ffe89a 50%, #ffffff 100%)'
                      : idx === 1
                      ? 'linear-gradient(145deg, #f5f8ff 0%, #dfe9ff 50%, #ffffff 100%)'
                      : 'linear-gradient(145deg, #fff1e8 0%, #ffd9bf 50%, #ffffff 100%)',
                }}
              >
                <CardContent sx={{ pt: 5 }}>
                  <Box textAlign="center">
                    <Avatar sx={{ width: 96, height: 96, mx: 'auto', mb: 1.5 }}>
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>@{toUsername(user.name)}</Typography>
                    <Chip className="pill pill-large" label={`LP ${user.xscore}`} />
                  </Box>

                  <Box className="podium-ribbon">
                    <EmojiEvents fontSize="small" />
                    <span>{idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd'}</span>
                  </Box>

                  {/* Borrow / Return stats */}
                  <Grid container className="stats-strip" spacing={8} sx={{ mt: 2 }}>
                    <Grid item size={4} className="stats-cell">
                      <AssignmentReturn className="stats-icon" />
                      <span className="stats-count">{user.borrowCount}</span>
                      <span className="stats-label">Borrow</span>
                    </Grid>
                    <Grid item size={4} className="stats-cell">
                      <CheckCircleOutline className="stats-icon" />
                      <span className="stats-count success">{user.returnSuccess}</span>
                      <span className="stats-label">Return success</span>
                    </Grid>
                    <Grid item size={4} className="stats-cell">
                      <CancelOutlined className="stats-icon" />
                      <span className="stats-count fail">{user.returnFailed}</span>
                      <span className="stats-label">Return failed</span>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Metric cards removed as requested */}

      {/* Top 50 List (div-based, không dùng Table) */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Box className="rankings-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
          <TextField className="search-input" size="small" placeholder="Search for user..." onChange={(e) => setSearch(e.target.value)} />
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <MenuItem key={m.key} value={m.key}>{m.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className="rankings-list">
          <Box className="list-header">
            <div className="cell cell-name">Name</div>
            <div className="cell cell-right">Legit Point</div>
            <div className="cell cell-right">Borrow</div>
            <div className="cell cell-right">Return success</div>
            <div className="cell cell-right">Return failed</div>
          </Box>
          {filteredData.map((u) => (
            <Box key={u.id} className={`list-row rank-${u.rank} ${u.rank <= 3 ? 'rank-top' : ''}`}>
              <div className="cell cell-name">
                <Stack direction="row" spacing={1} alignItems="center">
                  <div className={`rank-badge rank-badge-${u.rank}`}>{u.rank}</div>
                  <Avatar sx={{ width: 32, height: 32 }}>{u.name[0]}</Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{u.name}</Typography>
                </Stack>
              </div>
              <div className="cell cell-right">
                <Chip className="pill" size="small" label={`LP ${u.xscore}`} />
              </div>
              <div className="cell cell-right">{u.borrowCount}</div>
              <div className="cell cell-right">{u.returnSuccess}</div>
              <div className="cell cell-right">{u.returnFailed}</div>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
