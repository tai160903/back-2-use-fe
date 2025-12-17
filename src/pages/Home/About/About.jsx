import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Grid
} from '@mui/material';
import {
  Flag,
  Public,
  Recycling,
  People,
  Favorite,
  ArrowForward,
  Park
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './About.css';

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    description: 'Leading the vision for sustainable packaging innovation with 10+ years in environmental technology.'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO & Co-Founder',
    description: 'Building the technology infrastructure that powers our circular economy platform.'
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Head of Sustainability',
    description: 'Ensuring our solutions meet the highest environmental standards and impact metrics.'
  }
];

const coreValues = [
  {
    icon: <Recycling sx={{ color: '#0f3713', fontSize: 40 }} />,
    title: 'Sustainability First',
    description: 'Every decision we make is guided by our commitment to environmental responsibility and creating a positive impact on our planet.'
  },
  {
    icon: <People sx={{ color: '#0f3713', fontSize: 40 }} />,
    title: 'Community Driven',
    description: 'We believe in the power of community to drive change. Our platform connects businesses, consumers, and partners in a shared mission.'
  },
  {
    icon: <Favorite sx={{ color: '#0f3713', fontSize: 40 }} />,
    title: 'Transparency',
    description: 'We maintain complete transparency in our operations, impact metrics, and business practices to build trust with our community.'
  }
];

const impactMetrics = [
  { number: '50K+', label: 'Containers in Circulation' },
  { number: '200+', label: 'Partner Businesses' },
  { number: '1M+', label: 'Single-Use Items Prevented' },
  { number: '15 Tons', label: 'Waste Diverted' }
];

const About = () => {
  return (
    <Box className="about-page">
      {/* Hero Section */}
      <Box className="about-hero-section">
        <Container maxWidth="md" sx={{ py: 20, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2 }}>
            Revolutionizing Packaging for a <Box component="span" sx={{ color: '#0f3713' }}>Sustainable Future</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mt: 3, fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.6 }}>
            Back2Use is transforming how businesses and consumers think about packaging through innovative reusable solutions that benefit both the planet and your bottom line.
          </Typography>
        </Container>
      </Box>

      {/* Mission & Vision Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Card className="mission-vision-card" elevation={0}>
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box className="mission-icon">
                    <Flag sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', ml: 2, color: '#0f3713' }}>
                    Our Mission
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
                  To eliminate single-use packaging waste by creating a seamless circular economy where reusable containers flow efficiently between businesses and consumers, making sustainability the easiest choice.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="mission-vision-card" elevation={0}>
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box className="vision-icon">
                    <Public sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', ml: 2, color: '#0f3713' }}>
                    Our Vision
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
                  A world where packaging waste is a thing of the past, where every container has multiple lives, and where businesses thrive while protecting our planet for future generations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Core Values Section */}
      <Box className="core-values-section">
        <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6, color: '#0f3713', fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Our Core Values
          </Typography>
        <div className="core-values-grid-container">
          {coreValues.map((value, index) => (
            <Card key={index} className="core-value-card" elevation={2}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 4, position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 3, p: 2, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(15, 55, 19, 0.15) 0%, rgba(26, 127, 66, 0.15) 100%)' }}>{value.icon}</Box>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2, color: '#0f3713' }}>
                  {value.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1rem' }}>
                  {value.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
        </Container>
      </Box>

      {/* Impact Section */}
      <Paper className="impact-section" elevation={0}>
        <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h2" textAlign="center" sx={{ color: '#0f3713', fontWeight: 'bold', mb: 6, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Our Impact So Far
          </Typography>
          <div className="impact-metrics-grid-container">
            {impactMetrics.map((metric, index) => (
              <Box key={index} textAlign="center" className="impact-metric">
                <Typography variant="h3" component="div" sx={{ color: '#0f3713', fontWeight: 'bold', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  {metric.number}
                </Typography>
                <Typography variant="body1" sx={{ color: '#1a7f42', fontSize: { xs: '0.9rem', md: '1rem' }, fontWeight: '500' }}>
                  {metric.label}
                </Typography>
              </Box>
            ))}
          </div>
        </Container>
      </Paper>

      {/* Team Section */}
      <Box className="team-section">
        <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6, color: '#0f3713', fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Meet Our Team
          </Typography>
        <div className="team-grid-container">
          {teamMembers.map((member, index) => (
            <Card key={index} className="team-member-card" elevation={2}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 4, position: 'relative', zIndex: 1 }}>
                <Box className="team-member-icon" sx={{ mb: 3 }}>
                  <People sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#0f3713' }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 2, color: '#1a7f42' }}>
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {member.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Paper className="about-cta-section" elevation={0}>
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', position: 'relative' }}>
          <Typography variant="h3" component="h2" sx={{ color: '#0f3713', fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Ready to Join the Movement?
          </Typography>
          <Typography variant="h6" sx={{ color: '#333', maxWidth: '700px', mx: 'auto', mb: 4, fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.6 }}>
            Be part of the solution. Start your sustainable packaging journey today and help us create a waste-free future.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              component={Link}
              to="/pricing"
              sx={{
                bgcolor: '#0f3713',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 8,
                py: 1.5,
                px: 3,
                '&:hover': {
                  bgcolor: '#1a7f42',
                },
              }}
            >
              Get Started Today
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/features"
              sx={{
                borderColor: '#0f3713',
                color: '#0f3713',
                fontWeight: 'bold',
                borderRadius: 8,
                py: 1.5,
                px: 3,
                '&:hover': {
                  bgcolor: 'rgba(15, 55, 19, 0.1)',
                  borderColor: '#1a7f42',
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default About;
