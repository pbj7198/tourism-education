import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const Resources = () => {
  const resources = [
    {
      id: 1,
      title: '2024 관광 교과 임용시험 기출문제',
      category: '기출문제',
      date: '2024.3.1',
    },
    {
      id: 2,
      title: '관광 교과 지도안 예시',
      category: '교수학습자료',
      date: '2024.2.15',
    },
    {
      id: 3,
      title: '관광 교육과정 분석자료',
      category: '교육과정',
      date: '2024.2.1',
    },
  ];

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          임용자료
        </Typography>
        <Grid container spacing={3}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {resource.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    등록일: {resource.date}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    자료 다운로드
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Resources; 