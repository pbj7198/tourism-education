import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import ChatIcon from '@mui/icons-material/Chat';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? 1 : 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Tel. 010-4118-2277
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Mail. msh9618@naver.com
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <InstagramIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Instagram. Mozzi_ssam
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ChatIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Kakao Talk. msh96180
            </Typography>
          </Box>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{ mt: 1 }}
        >
          Copyright (c) 한국관광교육연구회 All right Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 