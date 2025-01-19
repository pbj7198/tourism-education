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
import BoardDetail from './pages/BoardDetail';
import BoardForm from './pages/BoardForm';
import BoardEdit from './pages/BoardEdit';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminUsers from './pages/AdminUsers';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import PostEdit from './pages/PostEdit';
import Contact from './pages/Contact';
import TeachingMaterials from './pages/TeachingMaterials';
import MaterialForm from './pages/MaterialForm';
import MaterialDetail from './pages/MaterialDetail';
import MaterialEdit from './pages/MaterialEdit';

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
  palette: {
    background: {
      default: '#fff'
    }
  }
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
              backgroundColor: '#fff'
            }}
          >
            <Navbar />
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1,
                minHeight: 'calc(100vh - 64px)',
                paddingTop: '64px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff'
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/notice/new" element={<PostForm />} />
                <Route path="/notice/:id" element={<PostDetail />} />
                <Route path="/notice/:id/edit" element={<PostEdit />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/new" element={<JobPostForm />} />
                <Route path="/jobs/:id" element={<JobPostDetail />} />
                <Route path="/jobs/:id/edit" element={<JobPostEdit />} />
                <Route path="/board" element={<Board />} />
                <Route path="/board/new" element={<BoardForm />} />
                <Route path="/board/:id" element={<BoardDetail />} />
                <Route path="/board/:id/edit" element={<BoardEdit />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/posts/new" element={<PostForm />} />
                <Route path="/posts/:id/edit" element={<PostEdit />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/materials" element={<TeachingMaterials />} />
                <Route path="/materials/new" element={<MaterialForm />} />
                <Route path="/materials/:id" element={<MaterialDetail />} />
                <Route path="/materials/:id/edit" element={<MaterialEdit />} />
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
