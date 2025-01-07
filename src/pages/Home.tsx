import { Container, Typography, Box, useTheme, useMediaQuery } from '@mui/material';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        height: '100%',
        backgroundImage: 'url(/tourism-education/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        top: '-80px',
        marginBottom: '-80px',
        paddingBottom: '80px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            pt: isMobile ? 10 : 12,
            pb: isMobile ? 10 : 12,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Box
            component="img"
            src="/tourism-education/logo.png"
            alt="한국관광교육연구회 로고"
            sx={{
              width: isMobile ? '120px' : '180px',
              height: 'auto',
              mb: 4,
              opacity: 0.9,
            }}
          />
          <Typography
            variant={isMobile ? "h5" : "h3"}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 400,
              wordBreak: 'keep-all',
              letterSpacing: '0.05em',
              mb: 3,
            }}
          >
            한국관광교육연구회
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            gutterBottom
            sx={{
              wordBreak: 'keep-all',
              lineHeight: 1.5,
              letterSpacing: '0.03em',
              opacity: 0.85,
              mb: 2,
              fontWeight: 300,
            }}
          >
            관광교육의 발전을 위한 연구와 교류의 장
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              wordBreak: 'keep-all',
              lineHeight: 1.7,
              maxWidth: '600px',
              opacity: 0.7,
              fontWeight: 300,
            }}
          >
            특성화고등학교 관광교사 연구회
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
