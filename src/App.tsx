import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
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
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/board" element={<Board />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
