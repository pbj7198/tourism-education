import { Container, Box } from '@mui/material';
import PageTransition from '../components/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <Box 
        sx={{ 
          backgroundColor: '#fff',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: '64px' // Navbar 높이만큼 padding-top 추가
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4
            }}
          >
            <img
              src="/four_members.jpeg"
              alt="한국관광교육연구회 회원"
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </Box>
        </Container>
      </Box>
    </PageTransition>
  );
};

export default Home;
