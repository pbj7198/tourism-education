import { AppBar, Toolbar, Typography, Button, Container, IconButton, Menu, MenuItem, useTheme, useMediaQuery, Box, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate('/');
  };

  const menuItems = [
    { text: '한국관광교육연구회 소개', path: '/about' },
    { text: '연구회 공지사항', path: '/notice' },
    { text: '관광교사 임용자료', path: '/resources' },
    { text: '관광교사 채용소식', path: '/jobs' },
    { text: '문의하기', path: '/board' },
  ];

  const adminMenuItems = [
    { text: '회원 관리', path: '/admin/users' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Container>
        <Toolbar sx={{ height: '80px', minHeight: '80px' }}>
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
              flexGrow: 1,
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
                    sx={{
                      fontSize: '0.9rem',
                      padding: '10px 20px',
                    }}
                  >
                    {item.text}
                  </MenuItem>
                ))}
                {user?.role === 'admin' && (
                  <>
                    <Divider />
                    {adminMenuItems.map((item) => (
                      <MenuItem 
                        key={item.path}
                        onClick={handleClose}
                        component={RouterLink}
                        to={item.path}
                        sx={{
                          fontSize: '0.9rem',
                          padding: '10px 20px',
                          color: theme.palette.primary.main,
                        }}
                      >
                        {item.text}
                      </MenuItem>
                    ))}
                  </>
                )}
                {!isAuthenticated ? (
                  <MenuItem
                    onClick={handleClose}
                    component={RouterLink}
                    to="/login"
                    sx={{
                      fontSize: '0.9rem',
                      padding: '10px 20px',
                    }}
                  >
                    로그인
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleLogout();
                    }}
                    sx={{
                      fontSize: '0.9rem',
                      padding: '10px 20px',
                    }}
                  >
                    로그아웃
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.path}
                  sx={{ 
                    color: '#fff',
                    mx: 1.5,
                    fontSize: '0.9rem',
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
              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleUserMenu}
                    sx={{ color: '#fff', ml: 2 }}
                  >
                    <PersonIcon />
                  </IconButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem disabled>
                      {user?.name} ({user?.role === 'admin' ? '관리자' : '회원'})
                    </MenuItem>
                    {user?.role === 'admin' && (
                      <>
                        <Divider />
                        {adminMenuItems.map((item) => (
                          <MenuItem
                            key={item.path}
                            onClick={handleUserMenuClose}
                            component={RouterLink}
                            to={item.path}
                          >
                            {item.text}
                          </MenuItem>
                        ))}
                      </>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    color: '#fff',
                    ml: 2,
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      border: '1px solid #fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  로그인
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
