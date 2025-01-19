import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { maskUserId } from '../utils/maskUserId';

interface BoardPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  views: number;
}

const Board = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'board_posts'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BoardPost[];
        setPosts(postsData);
      } catch (error) {
        console.error('게시글 로드 중 오류:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate('/board/new');
  };

  const handleRowClick = (postId: string) => {
    navigate(`/board/${postId}`);
  };

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            관광교사 게시판
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
          >
            새 글 작성
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!currentUser && (
          <Alert severity="info" sx={{ mb: 3 }}>
            글을 작성하려면 로그인이 필요합니다.
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="50%">제목</TableCell>
                <TableCell>작성자</TableCell>
                <TableCell>작성일</TableCell>
                <TableCell align="center">조회수</TableCell>
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

export default Board;
