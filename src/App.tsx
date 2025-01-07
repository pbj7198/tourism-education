import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Notice from './pages/Notice';
import Resources from './pages/Resources';
import Jobs from './pages/Jobs';
import Board from './pages/Board';

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1,
              minHeight: 'calc(100vh - 80px)',
              marginTop: 0,
              position: 'relative',
              top: '80px'
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/board" element={<Board />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
