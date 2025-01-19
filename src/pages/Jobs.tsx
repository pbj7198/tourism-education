import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { maskUserId } from '../utils/maskUserId';

interface JobPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  views: number;
}

const Jobs = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'job_posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobPost[];
      setPosts(postsData);
    }, (error) => {
      console.error('게시글 로드 중 오류:', error);
      setError('게시글을 불러오는데 실패했습니다.');
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePost = () => {
    navigate('/jobs/new');
  };

  const handleRowClick = (postId: string) => {
    navigate(`/jobs/${postId}`);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            관광교사 채용소식
          </Typography>
          {currentUser && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePost}
            >
              채용공고 등록
            </Button>
          )}
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell align="center" width={150}>작성자</TableCell>
                <TableCell align="center" width={200}>작성일</TableCell>
                <TableCell align="center" width={100}>조회수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow
                  key={post.id}
                  hover
                  onClick={() => handleRowClick(post.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{post.title}</TableCell>
                  <TableCell align="center">{maskUserId(post.authorId)}</TableCell>
                  <TableCell align="center">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{post.views}</TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    등록된 채용공고가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </PageTransition>
  );
};

export default Jobs;
