<<<<<<< HEAD
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

=======
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
>>>>>>> e32b90c9f4a2588929d334edda250700502f2e00
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
<<<<<<< HEAD
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              color: 'white', 
              flexGrow: 1,
              fontSize: isMobile ? '1rem' : '1.25rem'
            }}
          >
            한국관광교육연구회
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
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
            <>
              {menuItems.map((item) => (
                <Button 
                  key={item.path}
                  color="inherit" 
                  component={RouterLink} 
                  to={item.path}
                >
                  {item.text}
                </Button>
              ))}
            </>
          )}
=======
          <Typography variant="h6" component={RouterLink} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
            한국관광교육연구회
          </Typography>
          <Button color="inherit" component={RouterLink} to="/about">소개</Button>
          <Button color="inherit" component={RouterLink} to="/notice">공지사항</Button>
          <Button color="inherit" component={RouterLink} to="/resources">자료실</Button>
          <Button color="inherit" component={RouterLink} to="/jobs">채용정보</Button>
          <Button color="inherit" component={RouterLink} to="/board">문의하기</Button>
>>>>>>> e32b90c9f4a2588929d334edda250700502f2e00
        </Toolbar>
      </Container>
    </AppBar>
  );
};

<<<<<<< HEAD
export default Navbar; 
=======
export default Navbar;
>>>>>>> e32b90c9f4a2588929d334edda250700502f2e00
