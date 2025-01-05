<<<<<<< HEAD
import { Container, Typography, Box, useTheme, useMediaQuery } from '@mui/material';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: isMobile ? 2 : 4, 
        textAlign: 'center',
        px: isMobile ? 2 : 4
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            wordBreak: 'keep-all'
          }}
        >
          한국관광교육연구회
        </Typography>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          gutterBottom
          sx={{ 
            wordBreak: 'keep-all',
            lineHeight: 1.5
          }}
        >
          관광교육의 발전을 위한 연구와 교류의 장
        </Typography>
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            mt: 2,
            wordBreak: 'keep-all',
            lineHeight: 1.7
          }}
        >
=======
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
>>>>>>> e32b90c9f4a2588929d334edda250700502f2e00
          한국관광교육연구회는 관광교육의 질적 향상과 발전을 위해 노력하고 있습니다.
        </Typography>
      </Box>
    </Container>
  );
};

<<<<<<< HEAD
export default Home; 
=======
export default Home;
>>>>>>> e32b90c9f4a2588929d334edda250700502f2e00
