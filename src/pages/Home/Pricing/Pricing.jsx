import React, { useState } from 'react';
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
  MdCheckCircle, 
  MdFlashOn, 
  MdEventNote, 
  MdCardGiftcard, 
  MdArchive, 
  MdWorkspacePremium, 
  MdStar, 
  MdArrowForward, 
  MdPark,
  MdAccessTime,
  MdSpeed,
  MdAllInclusive,
  MdAnalytics,
  MdExpandMore,
  MdEmail
} from 'react-icons/md';
import './Pricing.css';

const pricingPlans = [
  {
    headerColor: '#0f3713', // Primary Green
    icon: <MdCardGiftcard style={{ color: 'white', fontSize: '2rem' }} />,
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
    buttonColor: '#0f3713',
  },
  {
    headerColor: '#1a7f42', // Secondary Green
    icon: <MdArchive style={{ color: 'white', fontSize: '2rem' }} />,
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
    buttonColor: '#1a7f42',
  },
  {
    headerColor: '#0f3713', // Primary Green
    icon: <MdWorkspacePremium style={{ color: 'white', fontSize: '2rem' }} />,
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
    buttonColor: '#0f3713',
  },
  {
    headerColor: '#1a7f42', // Secondary Green
    icon: <MdStar style={{ color: 'white', fontSize: '2rem' }} />,
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
    buttonColor: '#1a7f42',
  },
];

const includedFeatures = [
  {
    icon: <MdAccessTime style={{ color: '#0f3713', fontSize: '3rem' }} />,
    title: 'Free 7-Day Access',
    description: 'Start using the platform for free right after your business is approved. Enjoy full access to all features during the trial period.',
  },
  {
    icon: <MdSpeed style={{ color: '#1a7f42', fontSize: '3rem' }} />,
    title: 'Quick Approval Process',
    description: 'Register your business and get approved fast. No hidden steps, no long waiting times.',
  },
  {
    icon: <MdAllInclusive style={{ color: '#0f3713', fontSize: '3rem' }} />,
    title: 'Full Feature Experience',
    description: 'Access every feature without restrictions during your trial. Discover how the platform supports your business operations.',
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
  const [expandedFAQ, setExpandedFAQ] = useState(0); 

  const handleFAQToggle = (index) => {
    setExpandedFAQ(expandedFAQ === index ? -1 : index);
  };

  return (
    <Box className="pricing-page">
      {/* Header Section */}
      <Box className="pricing-header-section">
        <Container maxWidth="md" sx={{ py: 20, textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Box className="good-morning-bubble">
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
              Good morning
            </Typography>
          </Box>
           <Typography variant="h3" component="h1" className="pricing-main-title" gutterBottom>
             Choose Your <Box component="span" sx={{ color: '#197f43' }}>Package Duration</Box>
           </Typography>
          <Typography variant="h6" className="pricing-subtitle">
            All packages include the same comprehensive features. Choose the duration that
            works best for your business. Payment success automatically activates your
            business account - no admin approval needed.
          </Typography>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Box className="pricing-cards-section">
        <div className="pricing-cards-grid-container">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className="pricing-card" elevation={3}>
              <Box className="pricing-card-header" sx={{ bgcolor: plan.headerColor }}>
                {plan.icon}
              </Box>
              <CardContent className="pricing-card-content">
                <Typography variant="h5" component="h3" className="pricing-card-title">
                  {plan.title}
                </Typography>
                <Typography variant="h4" component="p" className="pricing-card-price">
                  {plan.price}
                </Typography>
                <Typography variant="body2" className="pricing-card-duration">
                  {plan.duration}
                </Typography>
                <Typography variant="body1" className="pricing-card-description">
                  {plan.description}
                </Typography>
                <List className="pricing-features-list">
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} className="pricing-feature-item">
                       <ListItemIcon className="pricing-feature-icon">
                         <MdCheckCircle style={{ color: '#0f3713', fontSize: '1.2rem' }} />
                       </ListItemIcon>
                      <ListItemText primary={feature} className="pricing-feature-text" />
                    </ListItem>
                  ))}
                  <ListItem className="pricing-feature-item">
                    <MuiLink href="#" underline="hover" className="pricing-more-features">
                      +5 more features
                    </MuiLink>
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  className="pricing-card-button"
                  sx={{
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
      </Box>

      {/* Everything Included Section */}
      <Box className="everything-included-section">
        <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" className="everything-included-title" gutterBottom>
            Everything Included
          </Typography>
          <Typography variant="h6" className="everything-included-subtitle">
            All packages include our complete sustainable packaging management
            platform with no feature restrictions.
          </Typography>
          <div className="included-features-grid-container">
            {includedFeatures.map((feature, index) => (
              <Card key={index} className="included-feature-card" elevation={0}>
                <CardContent className="included-feature-content">
                  <Box className="included-feature-icon-container">
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" className="included-feature-title">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" className="included-feature-description">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Box>

      {/* Frequently Asked Questions Section */}
      <Box className="faq-section">
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <div className="faq-container">
            {/* Left Column */}
            <div className="faq-left-column">
              <Box className="faq-category-label">
                <MdAnalytics style={{ color: '#0f3713', fontSize: '1.2rem' }} />
                <Typography variant="body2" className="faq-category-text">
                  Discovery Best SaaS analytics
                </Typography>
              </Box>
              <Typography variant="h3" component="h2" className="faq-main-title">
                Frequently asked questions
              </Typography>
              <Card className="faq-contact-card" elevation={0}>
                <CardContent className="faq-contact-content">
                  <Typography variant="h6" className="faq-contact-title">
                    Still have questions?
                  </Typography>
                  <Typography variant="body1" className="faq-contact-description">
                    Can't find the answer you're looking for? Please chat to our friendly team.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<MdEmail style={{ fontSize: '1.2rem' }} />}
                    className="faq-contact-button"
                    sx={{
                      bgcolor: '#0f3713',
                      '&:hover': {
                        bgcolor: '#1a7f42',
                      },
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: 8,
                      py: 1.5,
                      px: 3,
                    }}
                  >
                    Send email
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="faq-right-column">
              {faqs.map((faq, index) => {
                const isExpanded = expandedFAQ === index;
                return (
                  <Card 
                    key={index} 
                    className={`faq-item-card ${isExpanded ? 'expanded' : ''}`} 
                    elevation={0}
                    onClick={() => handleFAQToggle(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <CardContent className="faq-item-content">
                      <Box className="faq-question-container">
                        <Typography variant="h6" className="faq-question">
                          {faq.question}
                        </Typography>
                        <MdExpandMore className={`faq-expand-icon ${isExpanded ? 'expanded' : ''}`} />
                      </Box>
                      {isExpanded && (
                        <Typography variant="body1" className="faq-answer">
                          {faq.answer}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </Box>
    </Box>
  );
};

export default Pricing;
