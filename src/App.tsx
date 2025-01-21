import { Box } from '@mui/material';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Routes from './Routes';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            <Box component="main" sx={{ flex: 1 }}>
              <Routes />
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
