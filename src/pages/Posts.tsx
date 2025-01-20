import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { collection, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { maskUserId } from '../utils/maskUserId';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    email: string;
  };
  createdAt: Timestamp;
  views: number;
  fileUrl?: string;
  fileName?: string;
}

const Posts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('게시글 삭제에 실패했습니다.');
    }
  };

  const formatDate = (date: Timestamp) => {
    return date.toDate().toLocaleDateString('ko-KR');
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
            연구회 공지사항
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentUser?.role === 'admin' && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/notice/new')}
              >
                새 글 작성
              </Button>
            )}
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell align="center" width={150}>작성자</TableCell>
                <TableCell align="center" width={150}>작성일</TableCell>
                <TableCell align="center" width={100}>조회수</TableCell>
                {currentUser?.role === 'admin' && (
                  <TableCell align="center">관리</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow
                  key={post.id}
                  hover
                  onClick={() => navigate(`/notice/${post.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {post.title}
                      {post.fileUrl && (
                        <AttachFileIcon fontSize="small" color="action" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{maskUserId(post.author.email)}</TableCell>
                  <TableCell align="center">{formatDate(post.createdAt)}</TableCell>
                  <TableCell align="center">{post.views}</TableCell>
                  {currentUser?.role === 'admin' && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/notice/${post.id}/edit`);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={currentUser?.role === 'admin' ? 5 : 4} 
                    align="center"
                  >
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

export default Posts; 