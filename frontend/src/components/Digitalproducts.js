import React, { useState } from 'react';
import { Card, Col, Row, Typography, Space, Pagination } from 'antd';
import img1 from "../assets/michu.jpeg";
import img2 from "../assets/ebirr.jpeg";
import img3 from "../assets/coopapp.png";
import img4 from "../assets/crm.jpeg";

const { Title, Text } = Typography;

const products = [
  {
    title: 'Michu Digital Lending',
    description: 'AI-powered platform for seamless credit access.',
    imageUrl: img1,
  },
  {
    title: 'CoopPay eBIRR',
    description: 'Seamless mobile funds transfer and bill payments.',
    imageUrl: img2,
  },
  {
    title: 'ATM Banking Service',
    description: 'Easy access to funds, bill payments, and banking services.',
    imageUrl: img4,
  },
  {
    title: 'OMNI CHANNEL',
    description: 'Integrated mobile, web, and other channels into one service.',
    imageUrl: img3,
  },
  {
    title: 'Web Pay',
    description: 'E-commerce platform offering hosted and plugin solutions.',
    imageUrl: '/images/web-pay.png',
  },
  {
    title: 'POS (Point of Sale) Services',
    description: 'Seamless card payment processing at retail locations.',
    imageUrl: '/images/pos-services.png',
  },
  {
    title: 'Product 7',
    description: 'Description of product 7.',
    imageUrl: '/images/product7.png',
  },
  {
    title: 'Product 8',
    description: 'Description of product 8.',
    imageUrl: '/images/product8.png',
  },
  {
    title: 'Product 9',
    description: 'Description of product 9.',
    imageUrl: '/images/product9.png',
  },
  {
    title: 'Product 10',
    description: 'Description of product 10.',
    imageUrl: '/images/product10.png',
  },
  {
    title: 'Product 11',
    description: 'Description of product 11.',
    imageUrl: '/images/product11.png',
  },
];

const DigitalProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3; // Number of products to display per page

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      id="digital-products"
      style={{
        padding: '40px 16px',
        minHeight: '100vh',
        fontFamily: 'Roboto, sans-serif',
    
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title
          level={3}
          style={{
            color: '#00adef',
            fontWeight: 500,
            letterSpacing: '0.5px',
            marginBottom: '12px',
            fontSize: '24px', // Slightly larger title for prominence
          }}
        >
          Our Digital Products
        </Title>
        <Text style={{ fontSize: '16px', color: '#888' }}>
          Discover products designed to streamline services for businesses and individuals.
        </Text>
      </div>

      {/* Product Grid */}
      <Row gutter={[24, 24]} justify="center">
        {currentProducts.map((product, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                background: '#fff',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                padding: '20px',
                margin: '10px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              bodyStyle={{ padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Space
                direction="vertical"
                size="small"
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                {/* Image with hover effect */}
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                )}

                <Title
                  level={5}
                  style={{
                    marginTop: '16px',
                    color: '#333',
                    fontWeight: 600,
                    fontSize: '18px',
                   // Added text transform for modern touch
                  }}
                >
                  {product.title}
                </Title>
                <Text
                  style={{
                    color: '#555',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    maxWidth: '240px',
                    wordWrap: 'break-word',
                    fontStyle: 'italic',
                    textAlign: 'center', // Centered text for modern look
                  }}
                >
                  {product.description}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Pagination
          current={currentPage}
          total={products.length}
          pageSize={productsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          style={{ display: 'inline-block', marginTop: '20px' }}
        />
      </div>
    </div>
  );
};

export default DigitalProducts;
