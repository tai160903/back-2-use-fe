import React from 'react'
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
} from '@mui/material'
import banner from '../../../assets/image/banner3.jpg'
import './Rankings.css'
// no hidden toggle anymore

// Simple mock dataset for easier rendering and testing
const MOCK_RANKINGS = [
  { id: 1,  rank: 1,  name: 'Alex Nguyen',      xscore: 95, borrowCount: 460, returnSuccess: 438, returnFailed: 22 },
  { id: 2,  rank: 2,  name: 'Mia Tran',         xscore: 92, borrowCount: 420, returnSuccess: 401, returnFailed: 19 },
  { id: 3,  rank: 3,  name: 'Noah Le',          xscore: 90, borrowCount: 410, returnSuccess: 392, returnFailed: 18 },
  { id: 4,  rank: 4,  name: 'Luna Ho',          xscore: 88, borrowCount: 380, returnSuccess: 360, returnFailed: 20 },
  { id: 5,  rank: 5,  name: 'Charlie Parker',   xscore: 86, borrowCount: 360, returnSuccess: 338, returnFailed: 22 },
  { id: 6,  rank: 6,  name: 'Roger Foster',     xscore: 84, borrowCount: 340, returnSuccess: 319, returnFailed: 21 },
  { id: 7,  rank: 7,  name: 'Cristofer George', xscore: 82, borrowCount: 330, returnSuccess: 309, returnFailed: 21 },
  { id: 8,  rank: 8,  name: 'Dane Mango',       xscore: 81, borrowCount: 320, returnSuccess: 300, returnFailed: 20 },
  { id: 9,  rank: 9,  name: 'Ahmad Herwitz',    xscore: 79, borrowCount: 300, returnSuccess: 280, returnFailed: 20 },
  { id: 10, rank: 10, name: 'Nolan Korsgaard',  xscore: 78, borrowCount: 290, returnSuccess: 270, returnFailed: 20 },
  { id: 11, rank: 11, name: 'Liam Pham',        xscore: 76, borrowCount: 270, returnSuccess: 252, returnFailed: 18 },
  { id: 12, rank: 12, name: 'Emma Vo',          xscore: 75, borrowCount: 260, returnSuccess: 242, returnFailed: 18 },
]

//

export default function Rankings() {
  const data = MOCK_RANKINGS
  const top3 = data.slice(0, 3)

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
              Bảng xếp hạng Top 50 theo tháng dựa trên Xscore
            </Typography>
      
          </Box>
        </Container>
      </Box>

      {/* Top 3 */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {top3.map((user, idx) => (
            <Grid key={user.id} item size={3} sm={6} md={4} lg={4}>
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
                    <Typography variant="h5" sx={{ fontWeight: 900, marginBottom: "20px" }}>{user.name}</Typography>
                    <Chip className="pill pill-large" label={`Legit Point ${user.xscore}`} />
                  </Box>

                  <Box className="podium-ribbon">
                    <span>{idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd'}</span>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Metric cards removed as requested */}

      {/* Top 50 List (div-based, không dùng Table) */}
      <Container style={{ pb: 6, maxWidth: "1600px" }}>
        <Box className="rankings-table">
          <Box className="rankings-list">
            <Box className="list-header">
              <div className="cell cell-name">Name</div>
              <div className="cell cell-right">Legit Point</div>
            </Box>
            {data.map((u) => (
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
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
