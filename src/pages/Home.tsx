import { Container, Box, Typography } from '@mui/material';
import PageTransition from '../components/PageTransition';
import logoImage from '../../public/logo.png';

const Home = () => {
  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: 'calc(100vh - 200px)',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ mb: 4 }}>
            <img
              src={logoImage}
              alt="한국관광교육연구회 로고"
              style={{ maxWidth: '200px', height: 'auto', marginBottom: '2rem' }}
            />
          </Box>
          <Typography variant="h3" component="h1" gutterBottom>
            한국관광교육연구회
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            관광교육의 발전을 위한 연구와 교류의 장
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            특성화고등학교 관광과사 연구회
          </Typography>
        </Box>
      </Container>
    </PageTransition>
  );
};

export default Home;
