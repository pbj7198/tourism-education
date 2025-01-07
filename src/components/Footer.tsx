import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Facebook, Phone, Chat } from '@mui/icons-material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: 2,
        zIndex: theme.zIndex.drawer + 2,
      }}
    >
      <IconButton
        component="a"
        href="https://blog.naver.com"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          width: isMobile ? 40 : 48,
          height: isMobile ? 40 : 48,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <Box
          component="img"
          src="/tourism-education/blog-icon.png"
          alt="Blog"
          sx={{ width: 24, height: 24 }}
        />
      </IconButton>
      <IconButton
        component="a"
        href="https://cafe.naver.com"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          width: isMobile ? 40 : 48,
          height: isMobile ? 40 : 48,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <Box
          component="img"
          src="/tourism-education/cafe-icon.png"
          alt="Cafe"
          sx={{ width: 24, height: 24 }}
        />
      </IconButton>
      <IconButton
        component="a"
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          width: isMobile ? 40 : 48,
          height: isMobile ? 40 : 48,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <Facebook />
      </IconButton>
      <IconButton
        component="a"
        href="https://band.us"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          width: isMobile ? 40 : 48,
          height: isMobile ? 40 : 48,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <Box
          component="img"
          src="/tourism-education/band-icon.png"
          alt="Band"
          sx={{ width: 24, height: 24 }}
        />
      </IconButton>
      <IconButton
        component="a"
        href="tel:+82-000-0000"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          width: isMobile ? 40 : 48,
          height: isMobile ? 40 : 48,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <Phone />
      </IconButton>
      <IconButton
        component="a"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          // 채팅 기능 구현
        }}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          width: isMobile ? 40 : 48,
          height: isMobile ? 40 : 48,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <Chat />
      </IconButton>
      <IconButton
        onClick={handleScrollToTop}
        sx={{
          backgroundColor: 'white',
          color: 'black',
          width: isMobile ? 40 : 48,
          height: isMobile ? 40 : 48,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      >
        <KeyboardArrowUpIcon />
      </IconButton>
    </Box>
  );
};

export default Footer; 