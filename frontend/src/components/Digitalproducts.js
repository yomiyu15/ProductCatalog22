import React from 'react';
import { Card, Col, Row, Typography, Space, Avatar } from 'antd';
import {
  DollarCircleOutlined,
  PhoneOutlined,
  AppstoreOutlined,
  ShopOutlined,
  CreditCardOutlined,
  MobileOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const products = [
  {
    icon: <DollarCircleOutlined />,
    title: 'Michu Digital Lending',
    description:
      'AI-powered platform for seamless credit access.',
  },
  {
    icon: <PhoneOutlined />,
    title: 'CoopPay eBIRR',
    description: 'Seamless mobile funds transfer and bill payments.',
  },
  {
    icon: <AppstoreOutlined />,
    title: 'ATM Banking Service',
    description:
      'Easy access to funds, bill payments, and banking services.',
  },
  {
    icon: <MobileOutlined />,
    title: 'OMNI CHANNEL',
    description:
      'Integrated mobile, web, and other channels into one service.',
  },
  {
    icon: <ShopOutlined />,
    title: 'Web Pay',
    description:
      'E-commerce platform offering hosted and plugin solutions.',
  },
  {
    icon: <CreditCardOutlined />,
    title: 'POS (Point of Sale) Services',
    description:
      'Seamless card payment processing at retail locations.',
  },
];

const DigitalProducts = () => {
  return (
    <div
      id="digital-products"
      style={{
        padding: '40px 16px', // Reduced padding
        background: '#f5f7fa',
        minHeight: '100vh',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title
          level={3} // Smaller title size
          style={{
            color: '#333',
            fontWeight: 600,
            letterSpacing: '0.5px',
            marginBottom: '12px', // Reduced margin
          }}
        >
          Our Digital Products
        </Title>
        <Text style={{ fontSize: '16px', color: '#888' }}>
          Discover products designed to streamline services for businesses and individuals.
        </Text>
      </div>

      {/* Product Grid */}
      <Row gutter={[16, 24]} justify="center">
        {products.map((product, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              style={{
                borderRadius: '12px', // Smaller border radius
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                background: '#fff',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                padding: '16px', // Reduced padding inside the card
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Space
                direction="vertical"
                size="small"
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Icon Avatar */}
                <Avatar
                  size={60} // Smaller avatar size
                  style={{
                    backgroundColor: '#0078d4',
                    color: '#fff',
                    fontSize: '28px', // Smaller icon size
                    padding: '12px',
                  }}
                  icon={product.icon}
                />
                <Title
                  level={5} // Smaller title size
                  style={{
                    marginTop: '8px', // Reduced margin
                    color: '#333',
                    fontWeight: 600,
                    fontSize: '16px', // Smaller title font size
                  }}
                >
                  {product.title}
                </Title>
                <Text
                  style={{
                    color: '#555',
                    fontSize: '12px', // Smaller description text
                    lineHeight: '1.4',
                    maxWidth: '220px',
                    wordWrap: 'break-word',
                  }}
                >
                  {product.description}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DigitalProducts;
