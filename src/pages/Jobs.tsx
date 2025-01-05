import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      school: '한국문화영상고등학교',
      position: '기간제 교사',
      subject: '관광',
      period: '2024.10.30',
      status: '모집중',
    },
    {
      id: 2,
      school: '송곡관광고등학교',
      position: '기간제 교사',
      subject: '관광',
      period: '2024.8.12',
      status: '모집중',
    },
    {
      id: 3,
      school: '중경고등학교',
      position: '기간제 교사',
      subject: '관광',
      period: '2024.2.2',
      status: '마감',
    },
  ];

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          채용소식
        </Typography>
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {job.school}
                    </Typography>
                    <Chip
                      label={job.status}
                      color={job.status === '모집중' ? 'primary' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    {job.position} ({job.subject})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    마감일: {job.period}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<WorkIcon />}
                    sx={{ mt: 2 }}
                    fullWidth
                    disabled={job.status === '마감'}
                  >
                    상세보기
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

export default Jobs; 