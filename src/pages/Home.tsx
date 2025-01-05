import React from 'react';
import { Container, Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          textAlign: 'center',
          padding: isMobile ? '1rem' : '2rem',
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="한국관광교육연구회 로고"
          sx={{
            width: isMobile ? '150px' : '200px',
            height: 'auto',
            marginBottom: isMobile ? '1.5rem' : '2rem',
            objectFit: 'contain',
          }}
        />
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom
          sx={{
            wordBreak: 'keep-all',
            lineHeight: 1.4,
          }}
        >
          한국관광교육연구회
        </Typography>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          color="text.secondary"
          sx={{
            wordBreak: 'keep-all',
            lineHeight: 1.4,
          }}
        >
          특성화고등학교 관광교사 연구회
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 