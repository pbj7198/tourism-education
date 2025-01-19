import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
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