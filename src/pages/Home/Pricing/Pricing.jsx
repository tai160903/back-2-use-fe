import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Link as MuiLink
} from '@mui/material';
import {
  CheckCircleOutline,
  FlashOn,
  EventNote,
  CardGiftcard,
  Archive,
  WorkspacePremium,
  Star,
  ArrowForward,
  Park
} from '@mui/icons-material';
import './Pricing.css';

const pricingPlans = [
  {
    headerColor: '#4CAF50', // Green
    icon: <CardGiftcard sx={{ color: 'white' }} />,
    title: 'Free Trial',
    price: 'FREE',
    duration: '7 days',
    description: 'Try our sustainable packaging solution risk-free',
    features: [
      'Complete QR tracking system',
      'Customer mobile app',
      'Business dashboard',
      'Real-time analytics',
      'Return point network access',
      'POS system integration',
    ],
    buttonText: 'Start Free Trial',
    buttonColor: '#4CAF50',
  },
  {
    headerColor: '#2196F3', // Blue
    icon: <Archive sx={{ color: 'white' }} />,
    title: '3 Month Package',
    price: '$15',
    duration: '3 months',
    description: 'Perfect for trying out our sustainable packaging solution',
    features: [
      'Complete QR tracking system',
      'Customer mobile app',
      'Business dashboard',
      'Real-time analytics',
      'Return point network access',
      'POS system integration',
    ],
    buttonText: 'Get Started',
    buttonColor: '#4CAF50',
  },
  {
    headerColor: '#9C27B0', // Purple
    icon: <WorkspacePremium sx={{ color: 'white' }} />,
    title: '6 Month Package',
    price: '$27',
    duration: '6 months',
    description: 'Great value for established businesses',
    features: [
      'Complete QR tracking system',
      'Customer mobile app',
      'Business dashboard',
      'Real-time analytics',
      'Return point network access',
      'POS system integration',
    ],
    buttonText: 'Get Started',
    buttonColor: '#9C27B0',
  },
  {
    headerColor: '#FF9800', // Orange
    icon: <Star sx={{ color: 'white' }} />,
    title: '12 Month Package',
    price: '$51',
    duration: '12 months',
    description: 'Best value for long-term commitment',
    features: [
      'Complete QR tracking system',
      'Customer mobile app',
      'Business dashboard',
      'Real-time analytics',
      'Return point network access',
      'POS system integration',
    ],
    buttonText: 'Get Started',
    buttonColor: '#4CAF50',
  },
];

const includedFeatures = [
  {
    icon: <FlashOn sx={{ color: '#4CAF50', fontSize: 40 }} />,
    title: 'Instant Activation',
    description: 'Payment success immediately activates your business account with full platform access.',
  },
  {
    icon: <CheckCircleOutline sx={{ color: '#2196F3', fontSize: 40 }} />,
    title: 'No Approval Needed',
    description: 'Skip the waiting - start managing your sustainable packaging immediately after payment.',
  },
  {
    icon: <EventNote sx={{ color: '#9C27B0', fontSize: 40 }} />,
    title: 'Flexible Terms',
    description: 'Choose the package duration that fits your business planning and budget cycles.',
  },
];

const faqs = [
  {
    question: 'Are all features included in every package?',
    answer: 'Yes! All packages include the complete platform with unlimited containers, full analytics, and all integrations.',
  },
  {
    question: 'How quickly can I start using the platform?',
    answer: 'Immediately! Payment success automatically activates your business account with full access.',
  },
  {
    question: 'Can I upgrade or extend my package?',
    answer: 'Yes, you can extend your package or upgrade to a longer duration at any time through your dashboard.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for business accounts.',
  },
];

const Pricing = () => {
  return (
    <Box className="pricing-page">
      {/* Header Section */}
      <Container maxWidth="md" sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Choose Your <Box component="span" sx={{ color: '#4CAF50' }}>Package Duration</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
          All packages include the same comprehensive features. Choose the duration that
          works best for your business. Payment success automatically activates your
          business account - no admin approval needed.
        </Typography>
      </Container>

      {/* Pricing Cards */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <div className="pricing-cards-grid-container">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className="pricing-card" elevation={3}>
              <Box sx={{ bgcolor: plan.headerColor, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                {plan.icon}
              </Box>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                  {plan.title}
                </Typography>
                <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  {plan.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {plan.duration}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {plan.description}
                </Typography>
                <List dense sx={{ flexGrow: 1 }}>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleOutline sx={{ color: '#4CAF50', fontSize: 18 }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <MuiLink href="#" underline="hover" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      +5 more features
                    </MuiLink>
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    bgcolor: plan.buttonColor,
                    '&:hover': {
                      bgcolor: plan.buttonColor,
                      opacity: 0.9,
                    },
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 8,
                    py: 1.5,
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Everything Included Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Everything Included
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 6 }}>
          All packages include our complete sustainable packaging management
          platform with no feature restrictions.
        </Typography>
        <div className="included-features-grid-container">
          {includedFeatures.map((feature, index) => (
            <Card key={index} className="included-feature-card" elevation={2}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
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

      {/* Frequently Asked Questions Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Frequently Asked Questions
        </Typography>
        <div className="faq-grid-container">
          {faqs.map((faq, index) => (
            <Paper key={index} className="faq-item" elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {faq.question}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </Paper>
          ))}
        </div>
      </Container>

      {/* CTA Section */}
      <Paper className="cta-section" elevation={0}>
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Park sx={{ color: 'white', fontSize: 60 }} />
          </Box>
          <Typography variant="h3" component="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Ready to Start Your Sustainable Journey?
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', maxWidth: '700px', mx: 'auto', mb: 4 }}>
            Choose your package duration and get instant access to our complete
            sustainable packaging platform.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'white',
                color: '#4CAF50',
                fontWeight: 'bold',
                borderRadius: 8,
                py: 1.5,
                px: 3,
                '&:hover': {
                  bgcolor: '#f0f0f0',
                },
              }}
            >
              Choose Your Package
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 8,
                py: 1.5,
                px: 3,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Pricing;
