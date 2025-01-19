import { Container, Box, Paper } from '@mui/material';
import PageTransition from '../components/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4,
          backgroundColor: '#fff',
          '& .MuiPaper-root': {
            boxShadow: 'none',
            border: 'none',
            backgroundColor: '#fff'
          }
        }}
        disableGutters
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            backgroundColor: '#fff',
            borderRadius: 0
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
              backgroundColor: '#fff',
              width: '100%'
            }}
          >
            <img
              src="/two_members.jpeg"
              alt="한국관광교육연구회 회원"
              style={{
                maxWidth: '60%',
                height: 'auto',
                backgroundColor: '#fff',
                display: 'block'
              }}
            />
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default Home;
