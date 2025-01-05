import { Container, Typography, Box, Card, CardContent, Grid, Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

interface Resource {
  id: number;
  title: string;
  category: string;
  date: string;
}

const Resources = () => {
  const resources: Resource[] = [
    {
      id: 1,
      title: '2024 관광교육 교수학습 자료',
      category: '교수학습자료',
      date: '2024-02-15'
    },
    {
      id: 2,
      title: '관광 산업 동향 분석 보고서',
      category: '연구자료',
      date: '2024-02-01'
    },
    {
      id: 3,
      title: '관광교육 커리큘럼 가이드',
      category: '교육과정',
      date: '2024-01-15'
    }
  ];

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          자료실
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {resource.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {resource.date}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    다운로드
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