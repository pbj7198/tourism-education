import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';

const About = () => {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          한국관광교육연구회 소개
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          <Typography variant="body1" paragraph>
            한국관광교육연구회는 특성화고등학교의 관광 교육 발전을 위해 설립된 교사 연구회입니다.
          </Typography>
          <Typography variant="body1" paragraph>
            우리 연구회는 관광 교육의 질적 향상과 교사들의 전문성 개발을 위해 다양한 활동을 진행하고 있습니다.
          </Typography>
          <Typography variant="body1" paragraph>
            주요 활동:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">교육과정 연구 및 개발</Typography>
            <Typography component="li" variant="body1">교수학습 자료 공유</Typography>
            <Typography component="li" variant="body1">교사 연수 및 워크샵 진행</Typography>
            <Typography component="li" variant="body1">관광 산업 현장과의 연계 활동</Typography>
          </ul>
        </Paper>
      </Box>
    </Container>
  );
};

export default About; 