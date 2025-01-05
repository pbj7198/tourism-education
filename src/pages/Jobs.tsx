import React from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Chip, Button } from '@mui/material';

interface Job {
  id: number;
  school: string;
  position: string;
  subject: string;
  period: string;
  status: string;
}

const Jobs = () => {
  const jobs: Job[] = [
    {
      id: 1,
      school: '서울관광고등학교',
      position: '관광 교과 교사',
      subject: '관광일반',
      period: '2024-02-15 ~ 2024-03-15',
      status: '접수중'
    },
    {
      id: 2,
      school: '부산관광고등학교',
      position: '관광 교과 교사',
      subject: '관광영어',
      period: '2024-02-01 ~ 2024-02-28',
      status: '마감'
    },
    {
      id: 3,
      school: '제주관광고등학교',
      position: '관광 교과 교사',
      subject: '호텔실무',
      period: '2024-03-01 ~ 2024-03-31',
      status: '예정'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수중':
        return 'success';
      case '마감':
        return 'error';
      case '예정':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          채용정보
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {job.school}
                    </Typography>
                    <Chip
                      label={job.status}
                      color={getStatusColor(job.status) as any}
                      size="small"
                    />
                  </Box>
                  <Typography gutterBottom>
                    {job.position} ({job.subject})
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    접수기간: {job.period}
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }}>
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