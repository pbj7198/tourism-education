import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const pages = [
  { title: '한국관광교육연구회 소개', path: '/about' },
  { title: '연구회 공지사항', path: '/notice' },
  { title: '연구회 활동사진', path: '/gallery' },
  { title: '관광교사 임용자료', path: '/materials' },
  { title: '관광교사 채용소식', path: '/jobs' },
  { title: '관광교사 게시판', path: '/board' },
  { title: '문의하기', path: '/contact' },
  { title: '회원관리', path: '/admin/users', adminOnly: true },
  { title: '로그아웃', path: '/login', authOnly: true },
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const filteredPages = pages.filter(page => {
    if (page.adminOnly) return currentUser?.role === 'admin';
    if (page.authOnly) return currentUser;
    return true;
  });

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* 로고 */}
          <Box
            component="img"
            src="/logo.png"
            alt="로고"
            sx={{
              height: 40,
              width: 40,
              cursor: 'pointer',
              mr: 2,
              display: { xs: 'none', md: 'flex' }
            }}
            onClick={() => navigate('/')}
          />

          {/* 모바일 메뉴 */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="메뉴"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'black' }}
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
              {filteredPages.map((page) => (
                <MenuItem
                  key={page.path}
                  onClick={() => {
                    if (page.authOnly) {
                      handleLogout();
                    } else {
                      handleNavigate(page.path);
                    }
                  }}
                  selected={location.pathname === page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
              {!currentUser && (
                <MenuItem onClick={() => handleNavigate('/login')}>
                  <Typography textAlign="center">로그인</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* 모바일 로고 */}
          <Box
            component="img"
            src="/logo.png"
            alt="로고"
            sx={{
              height: 40,
              width: 40,
              cursor: 'pointer',
              display: { xs: 'flex', md: 'none' },
              mr: 1
            }}
            onClick={() => navigate('/')}
          />

          {/* 데스크톱 메뉴 */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' }, 
            justifyContent: 'center',
            gap: 4
          }}>
            {filteredPages.map((page) => (
              <Button
                key={page.path}
                onClick={() => {
                  if (page.authOnly) {
                    handleLogout();
                  } else {
                    handleNavigate(page.path);
                  }
                }}
                sx={{
                  color: location.pathname === page.path ? 'primary.main' : 'black',
                  display: 'block',
                  fontWeight: location.pathname === page.path ? 700 : 400,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {page.title}
              </Button>
            ))}
            {!currentUser && (
              <Button
                onClick={() => navigate('/login')}
                sx={{
                  color: 'black',
                  display: 'block',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap'
                }}
              >
                로그인
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 