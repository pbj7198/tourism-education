import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../../public/logo.png';

const pages = [
  { title: '소개', path: '/about' },
  { title: '공지사항', path: '/notice' },
  { title: '자료실', path: '/resources' },
  { title: '채용정보', path: '/jobs' },
  { title: '게시판', path: '/board' },
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box 
            component={RouterLink} 
            to="/"
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 2,
            }}
          >
            <img
              src={logoImage}
              alt="한국관광교육연구회 로고"
              style={{ height: '40px', width: 'auto' }}
            />
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="메뉴"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.path} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box 
            component={RouterLink} 
            to="/"
            sx={{ 
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' }, 
              justifyContent: 'center',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <img
              src={logoImage}
              alt="한국관광교육연구회 로고"
              style={{ height: '40px', width: 'auto' }}
            />
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.path}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  mx: 1,
                  color: 'text.primary', 
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Button
                    component={RouterLink}
                    to="/admin/users"
                    sx={{ color: 'text.primary' }}
                  >
                    관리자
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  sx={{ color: 'text.primary' }}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ color: 'text.primary' }}
                >
                  로그인
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  sx={{ color: 'text.primary' }}
                >
                  회원가입
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
