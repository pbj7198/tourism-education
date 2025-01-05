import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const About = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          연구회 소개
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            설립 목적
          </Typography>
          <Typography variant="body1" paragraph>
            한국관광교육연구회는 관광교육의 발전과 교사들의 전문성 향상을 위해 설립되었습니다.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            주요 활동
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>관광교육 관련 연구 및 세미나 개최</li>
              <li>교사 역량 강화를 위한 워크샵 진행</li>
              <li>관광교육 자료 개발 및 공유</li>
              <li>회원 간 정보 교류 및 네트워킹</li>
            </ul>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;