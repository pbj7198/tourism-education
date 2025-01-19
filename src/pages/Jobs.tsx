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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { maskUserId } from '../utils/maskUserId';
import { Timestamp } from 'firebase/firestore';

interface JobPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    email: string | null;
    name: string;
  };
  createdAt: string | Timestamp;
  views: number;
  isNotice?: boolean; // 공지사항 여부
}

const Jobs = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'job_posts'),
      orderBy('isNotice', 'desc'), // 공지사항 우선 정렬
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

  const formatDate = (date: string | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('ko-KR');
    }
    return new Date(date).toLocaleDateString('ko-KR');
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
              onClick={() => navigate('/jobs/new')}
              startIcon={<AddIcon />}
            >
              새 글 작성
            </Button>
          )}
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell align="center" width={150}>작성자</TableCell>
                <TableCell align="center" width={150}>작성일</TableCell>
                <TableCell align="center" width={100}>조회수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow
                  key={post.id}
                  hover
                  onClick={() => navigate(`/jobs/${post.id}`)}
                  sx={{ 
                    cursor: 'pointer',
                    backgroundColor: post.isNotice ? '#f5f5f5' : 'inherit'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {post.isNotice && (
                        <Chip
                          label="공지"
                          size="small"
                          color="primary"
                          sx={{ minWidth: 60 }}
                        />
                      )}
                      {post.title}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{post.author?.name || '익명'}</TableCell>
                  <TableCell align="center">{formatDate(post.createdAt)}</TableCell>
                  <TableCell align="center">{post.views || 0}</TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    게시글이 없습니다.
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
