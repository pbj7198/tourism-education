import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          한국관광교육연구회
        </Typography>
        <Typography variant="h6" gutterBottom>
          관광교육의 발전을 위한 연구와 교류의 장
        </Typography>
        <Typography variant="body1" paragraph>
          한국관광교육연구회는 관광교육의 질적 향상과 발전을 위해 노력하고 있습니다.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;