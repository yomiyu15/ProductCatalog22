import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LocalAtmRoundedIcon from '@mui/icons-material/LocalAtmRounded'; // Example icon for financial services
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'; // Example for mobile app
import AgricultureIcon from '@mui/icons-material/Agriculture'; // Example for farming-related product
import AppSettingsAltRoundedIcon from '@mui/icons-material/AppSettingsAltRounded'; // Example for app-related icon
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded'; // Example for business-related product
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded'; // Example for a general product feature

// Replace the old items with your actual product data
const products = [
  {
    icon: <LocalAtmRoundedIcon />,
    title: 'Michu Digital Lending',
    description: 'Michu Digital Lending is an AI-powered platform that enables individuals and businesses to access credit seamlessly through an advanced credit scoring system.',
  },
  {
    icon: <PhoneIphoneRoundedIcon />,
    title: 'CoopPay eBIRR',
    description: 'A seamless mobile solution for transferring funds and paying bills with ease.',
  },
  {
    icon: <AgricultureIcon />,
    title: 'ATM Banking Service',
    description: 'ATM services provide easy access to funds, bill payments, and other banking services through automated teller machines.',
  },
  {
    icon: <AppSettingsAltRoundedIcon />,
    title: 'OMNI CHANNEL',
    description: 'AOmni Channel is a platform that integrates multiple channels (mobile, web, and others) into one seamless service for individuals and businesses..',
  },
  {
    icon: <BusinessCenterRoundedIcon />,
    title: 'Web Pay',
    description: 'Web Pay is an innovative e-commerce platform offering hosted and plugin solutions for both businesses and customers.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'POS (Point of Sale) Services',
    description: 'POS systems enable merchants to process card payments seamlessly at retail locations.',
  },
];

export default function DigitalProducts() {
  return (
    <Box
    id="digital-products"
    sx={{
      pt: { xs: 4, sm: 12 },
      pb: { xs: 8, sm: 16 },
      color: '#000',
      
      bgcolor: '#f4f4f4 ', // Updated background color
    }}
  >
  
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '30vh',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography sx={{color:"#00adef"}} component="h2" variant="h4" gutterBottom>
            Digital Products
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' ,fontWeight: 'medium'}}>
            Explore our range of innovative digital products designed to empower individuals and businesses with
            seamless, secure, and efficient solutions.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: '#f4f4f4 ',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{product.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>
                    {product.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
