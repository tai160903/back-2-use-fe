import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  QrCode,
  BarChart,
  PhoneAndroid,
  People,
  Security,
  CardGiftcard,
  Inventory,
  LocationOn,
  Notifications,
  Refresh,
  Analytics,
  Email,
  ArrowForward,
  Park,
  Recycling
} from '@mui/icons-material';
import './Features.css';

const Features = () => {
  const coreFeatures = [
    {
      icon: <QrCode />,
      title: "Smart QR Tracking",
      description: "Every container gets a unique QR code for seamless tracking throughout its lifecycle.",
      features: ["Real-time location tracking", "Usage history", "Automated returns"]
    },
    {
      icon: <BarChart />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into your packaging usage, environmental impact, and cost savings.",
      features: ["Environmental impact metrics", "Cost analysis", "Usage patterns"]
    },
    {
      icon: <PhoneAndroid />,
      title: "Mobile App Integration",
      description: "Easy-to-use mobile apps for both businesses and customers to manage containers.",
      features: ["Quick container scanning", "Return notifications", "Reward tracking"]
    },
    {
      icon: <People />,
      title: "Multi-Stakeholder Platform",
      description: "Connects businesses, customers, and return points in one unified ecosystem.",
      features: ["Business management tools", "Customer rewards", "Partner network"]
    },
    {
      icon: <Security />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with full compliance to food safety and data protection standards.",
      features: ["Food-grade materials", "GDPR compliant", "Secure data handling"]
    },
    {
      icon: <CardGiftcard />,
      title: "Rewards System",
      description: "Incentivize sustainable behavior with points, discounts, and exclusive offers.",
      features: ["Customer loyalty points", "Business incentives", "Partner rewards"]
    }
  ];

  const businessFeatures = [
    {
      icon: <Inventory />,
      title: "Inventory Management",
      description: "Track container stock levels, predict demand, and optimize distribution."
    },
    {
      icon: <LocationOn />,
      title: "Location Analytics",
      description: "Monitor container locations and optimize pickup routes for efficiency."
    },
    {
      icon: <Notifications />,
      title: "Smart Notifications",
      description: "Automated alerts for low stock, returns due, and maintenance needs."
    },
    {
      icon: <Refresh />,
      title: "Return Processing",
      description: "Streamlined workflows for container cleaning, inspection, and redistribution."
    }
  ];

  const integrationFeatures = [
    {
      icon: <BarChart />,
      title: "POS Systems",
      description: "Integrate with major point-of-sale systems for seamless container tracking at checkout."
    },
    {
      icon: <Analytics />,
      title: "Analytics Tools",
      description: "Export data to your favorite analytics platforms for deeper business insights."
    },
    {
      icon: <Email />,
      title: "Notification Systems",
      description: "Connect with email, SMS, and push notification services for customer engagement."
    }
  ];

  return (
    <Box className="features-page">
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Box textAlign="center" py={8}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Everything You Need for <span style={{ color: '#2e7d32' }}>Sustainable</span> Packaging
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
              Our comprehensive platform provides all the tools businesses and customers need to participate in the circular economy.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Core Platform Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Core Platform Features
        </Typography>
        <div className="features-grid-container">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="feature-card" elevation={2}>
              <CardContent>
                <Box className="feature-icon">
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <List dense>
                  {feature.features.map((item, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Box className="bullet-point" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Built for Business Success */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Built for Business Success
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Advanced tools designed specifically for businesses to manage their reusable packaging operations efficiently.
        </Typography>
        <div className="business-success-grid-container">
          {businessFeatures.map((feature, index) => (
            <Card key={index} className="feature-card" elevation={2}>
              <CardContent>
                <Box className="feature-icon">
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Environmental Impact Tracking */}
      <Box className="environmental-section">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box textAlign="center" mb={6}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
              <Recycling sx={{ color: 'white', mr: 2, fontSize: 48 }} />
              <Typography variant="h3" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                Environmental Impact Tracking
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'white', maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}>
              See the real difference you're making with detailed environmental impact metrics.
            </Typography>
          </Box>
          <div className="environmental-grid-container">
            <Box textAlign="center" className="environmental-item">
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: '1.8rem' }}>
                CO₂ Reduction
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', fontSize: '1rem', lineHeight: 1.5 }}>
                Track carbon footprint savings from reusable packaging.
              </Typography>
            </Box>
            <Box textAlign="center" className="environmental-item">
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: '1.8rem' }}>
                Waste Prevented
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', fontSize: '1rem', lineHeight: 1.5 }}>
                Monitor single-use items diverted from landfills.
              </Typography>
            </Box>
            <Box textAlign="center" className="environmental-item">
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: '1.8rem' }}>
                Resource Savings
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', fontSize: '1rem', lineHeight: 1.5 }}>
                Calculate water and energy conservation impact.
              </Typography>
            </Box>
          </div>
        </Container>
      </Box>

      {/* Seamless Integrations */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Seamless Integrations
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Connect with your existing systems and workflows for a smooth transition to sustainable packaging.
        </Typography>
        <div className="integrations-grid-container">
          {integrationFeatures.map((feature, index) => (
            <Card key={index} className="feature-card" elevation={2}>
              <CardContent>
                <Box className="feature-icon">
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Ready to Get Started */}
      <Box className="cta-section">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
              Experience all these features and more with our comprehensive platform. Start your sustainable packaging journey today.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large" 
                sx={{ backgroundColor: '#2e7d32', px: 4 }}
                endIcon={<ArrowForward />}
              >
                Start Free Trial
              </Button>
              <Button variant="text" size="large" sx={{ px: 4 }}>
                View Pricing
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Features;
