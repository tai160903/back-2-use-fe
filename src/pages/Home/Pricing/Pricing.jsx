import React, { useState, useEffect } from 'react';
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
  Link as MuiLink,
  CircularProgress,
  Alert
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
import { useDispatch, useSelector } from 'react-redux';
import { getALLSubscriptions } from '../../../store/slices/subscriptionSlice';
import './Pricing.css';

// Fallback features cho trường hợp không có dữ liệu từ API
const DEFAULT_FEATURES = [
  'Complete QR tracking system',
  'Customer mobile app',
  'Business dashboard',
  'Real-time analytics',
  'Return point network access',
  'POS system integration'
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
  const dispatch = useDispatch();
  const { subscription, isLoading, error } = useSelector(state => state.subscription);

  const dataSubscriptions = subscription?.data?.subscriptions || [];
  const featuresList = subscription?.data?.description || [];

  useEffect(() => {
    dispatch(getALLSubscriptions());
  }, [dispatch]);

  const handleFAQToggle = (index) => {
    setExpandedFAQ(expandedFAQ === index ? -1 : index);
  };

  // Hàm để lấy icon dựa trên loại subscription
  const getSubscriptionIcon = (subscription) => {
    if (subscription.isTrial) {
      return <MdCardGiftcard style={{ color: 'white', fontSize: '2rem' }} />;
    }
    
    const duration = subscription.durationInDays;
    if (duration <= 30) {
      return <MdArchive style={{ color: 'white', fontSize: '2rem' }} />;
    } else if (duration <= 180) {
      return <MdWorkspacePremium style={{ color: 'white', fontSize: '2rem' }} />;
    } else {
      return <MdStar style={{ color: 'white', fontSize: '2rem' }} />;
    }
  };

  // Hàm để lấy màu header dựa trên loại subscription
  const getHeaderColor = (subscription, index) => {
    if (subscription.isTrial) {
      return '#0f3713';
    }
    
    const colors = ['#0f3713', '#1a7f42', '#0f3713', '#1a7f42'];
    return colors[index % colors.length];
  };

  // Hàm để format giá tiền
  const formatPrice = (price) => {
    if (price === 0) {
      return 'FREE';
    }
    return `$${price}`;
  };

  // Hàm để format duration
  const formatDuration = (durationInDays) => {
    if (durationInDays === 7) {
      return '7 days';
    } else if (durationInDays === 30) {
      return '1 month';
    } else if (durationInDays === 90) {
      return '3 months';
    } else if (durationInDays === 180) {
      return '6 months';
    } else if (durationInDays === 365) {
      return '12 months';
    } else {
      return `${durationInDays} days`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box className="pricing-page" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#0f3713' }} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box className="pricing-page" sx={{ p: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          Có lỗi xảy ra khi tải dữ liệu gói subscription: {error.message || 'Unknown error'}
        </Alert>
      </Box>
    );
  }

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
          {dataSubscriptions.length > 0 ? (
            dataSubscriptions.map((subscription, index) => (
              <Card key={subscription._id} className="pricing-card" elevation={3}>
                <Box className="pricing-card-header" sx={{ bgcolor: getHeaderColor(subscription, index) }}>
                  {getSubscriptionIcon(subscription)}
                </Box>
                <CardContent className="pricing-card-content">
                  <Typography variant="h5" component="h3" className="pricing-card-title">
                    {subscription.name}
                  </Typography>
                  <Typography variant="h4" component="p" className="pricing-card-price">
                    {formatPrice(subscription.price)}
                  </Typography>
                  <Typography variant="body2" className="pricing-card-duration">
                    {formatDuration(subscription.durationInDays)}
                  </Typography>
                  <Typography variant="body1" className="pricing-card-description">
                    {subscription.description || 'Perfect for your business needs'}
                  </Typography>
                  <List className="pricing-features-list">
                    {/* Hiển thị features từ API */}
                    {featuresList.length > 0 ? (
                      featuresList.map((feature, idx) => (
                        <ListItem key={idx} className="pricing-feature-item">
                          <ListItemIcon className="pricing-feature-icon">
                            <MdCheckCircle style={{ color: '#0f3713', fontSize: '1.2rem' }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} className="pricing-feature-text" />
                        </ListItem>
                      ))
                    ) : (
                      // Fallback features nếu không có features từ API
                      DEFAULT_FEATURES.map((feature, idx) => (
                        <ListItem key={idx} className="pricing-feature-item">
                          <ListItemIcon className="pricing-feature-icon">
                            <MdCheckCircle style={{ color: '#0f3713', fontSize: '1.2rem' }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} className="pricing-feature-text" />
                        </ListItem>
                      ))
                    )}
                  </List>
                  <Button
                    variant="contained"
                    className="pricing-card-button"
                    sx={{
                      bgcolor: getHeaderColor(subscription, index),
                      '&:hover': {
                        bgcolor: getHeaderColor(subscription, index),
                        opacity: 0.9,
                      },
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: 8,
                      py: 1.5,
                    }}
                  >
                    {subscription.isTrial ? 'Start Free Trial' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Không có gói subscription nào được tìm thấy
              </Typography>
            </Box>
          )}
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
