import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Notice from './pages/Notice';
import Resources from './pages/Resources';
import Jobs from './pages/Jobs';
import JobPostForm from './pages/JobPostForm';
import JobPostDetail from './pages/JobPostDetail';
import JobPostEdit from './pages/JobPostEdit';
import Board from './pages/Board';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminUsers from './pages/AdminUsers';

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
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              backgroundImage: 'url(../public/background.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backgroundBlendMode: 'overlay',
            }}
          >
            <Navbar />
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1,
                minHeight: 'calc(100vh - 80px)',
                marginTop: 0,
                position: 'relative',
                top: '80px',
                zIndex: 1,
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/new" element={<JobPostForm />} />
                <Route path="/jobs/:id" element={<JobPostDetail />} />
                <Route path="/jobs/:id/edit" element={<JobPostEdit />} />
                <Route path="/board" element={<Board />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
