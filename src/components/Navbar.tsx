import { AppBar, Toolbar, Typography, Button, Container, IconButton, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: '소개', path: '/about' },
    { text: '공지사항', path: '/notice' },
    { text: '자료실', path: '/resources' },
    { text: '채용정보', path: '/jobs' },
    { text: '문의하기', path: '/board' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px' }}>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: '#fff', 
              fontSize: isMobile ? '1.1rem' : '1.3rem',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            한국관광교육연구회
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                sx={{ color: '#fff' }}
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item.path}
                    onClick={handleClose}
                    component={RouterLink}
                    to={item.path}
                  >
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <div>
              {menuItems.map((item) => (
                <Button 
                  key={item.path}
                  sx={{ 
                    color: '#fff',
                    mx: 1.5,
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                  component={RouterLink} 
                  to={item.path}
                >
                  {item.text}
                </Button>
              ))}
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
