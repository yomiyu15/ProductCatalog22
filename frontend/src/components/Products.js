import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Container } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Sample Product Data
const productCatalog = [
  {
    name: 'Banking Products and Services',
    subcategories: [
      {
        name: 'Conventional Banking Products',
        subcategories: [
          {
            name: 'Deposit Products',
            subcategories: [
              {
                name: 'Local Currency Deposit Products',
              },
              {
                name: 'Demand Deposit Accounts',
              },
              {
                name: 'Foreign Currency Deposit Products',
              },
            ],
          },
          {
            name: 'Credit/Loan Banking Products',
          },
        ],
      },
      {
        name: 'Interest Free Banking Products',
        subcategories: [
          {
            name: 'Saving/Deposit Banking Products',
            subcategories: [
              {
                name: 'Local Currency Deposit Products',
              },
              {
                name: 'Foreign Currency Deposit Products',
              },
            ],
          },
          {
            name: 'IFB Financing Products',
          },
        ],
      },
      {
        name: 'Digital Banking Products',
        subcategories: [
          {
            name: 'Mobile/Digital Banking Products',
          },
          {
            name: 'Card Banking Products',
          },
        ],
      },
    ],
  },
];

const TableOfContents = ({ data }) => {
  return data.map((category, index) => (
    <Accordion key={index} sx={{ mb: 1, borderRadius: 2, }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#00adef' }} />}
        sx={{
          backgroundColor: '#f1faff',
          '&:hover': { backgroundColor: '#e1f1fd' },
          borderLeft: `4px solid #00adef`,
          borderRadius: '8px 8px 0 0',
          padding: '10px 20px',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
          {category.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: '#fafafa', padding: '8px 24px' }}>
        <Box sx={{ pl: 2 }}>
          {category.subcategories && <TableOfContents data={category.subcategories} />}
        </Box>
      </AccordionDetails>
    </Accordion>
  ));
};

export default function ProductCatalog() {
  return (
    <Container
      id="products"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
       
      
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{
            color: '#00adef',
            fontWeight: 700,
           
          }}
        >
          Our Banking Products
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <TableOfContents data={productCatalog} />
      </Box>
    </Container>
  );
}
