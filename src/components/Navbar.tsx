import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
            한국관광교육연구회
          </Typography>
          <Button color="inherit" component={RouterLink} to="/about">소개</Button>
          <Button color="inherit" component={RouterLink} to="/notice">공지사항</Button>
          <Button color="inherit" component={RouterLink} to="/resources">자료실</Button>
          <Button color="inherit" component={RouterLink} to="/jobs">채용정보</Button>
          <Button color="inherit" component={RouterLink} to="/board">문의하기</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;