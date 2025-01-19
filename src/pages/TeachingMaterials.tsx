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
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../contexts/AuthContext';

interface MaterialPost {
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
  fileUrl?: string;
  fileName?: string;
}

const TeachingMaterials = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<MaterialPost[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'materials'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MaterialPost[];
        setPosts(newPosts);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    );

    return () => unsubscribe();
  }, []);

  const formatDate = (date: string | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('ko-KR');
    }
    return new Date(date).toLocaleDateString('ko-KR');
  };

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" component="h1">
              관광교사 임용자료
            </Typography>
            {currentUser && (
              <Button
                variant="contained"
                onClick={() => navigate('/materials/new')}
              >
                글쓰기
              </Button>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>제목</TableCell>
                  <TableCell>작성자</TableCell>
                  <TableCell>작성일</TableCell>
                  <TableCell>조회수</TableCell>
                  <TableCell>첨부파일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow
                    key={post.id}
                    hover
                    onClick={() => navigate(`/materials/${post.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.author.name}</TableCell>
                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                    <TableCell>{post.views}</TableCell>
                    <TableCell>
                      {post.fileName ? '있음' : '없음'}
                    </TableCell>
                  </TableRow>
                ))}
                {posts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      등록된 게시글이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default TeachingMaterials; 