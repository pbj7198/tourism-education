import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageTransition from '../components/PageTransition';
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { addTestPosts } from '../utils/addTestData';
import { useAuth } from '../contexts/AuthContext';
import { maskUserId } from '../utils/maskUserId';
import { Timestamp } from 'firebase/firestore';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Post {
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

const Posts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/posts/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/posts/${id}`);
  };

  const handleAddTestData = async () => {
    await addTestPosts();
    window.location.reload();
  };

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
            연구회 공지사항
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentUser?.role === 'admin' && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleAddTestData}
                >
                  테스트 데이터 추가
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/posts/new')}
                >
                  새 글 작성
                </Button>
              </>
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
                  onClick={() => handleRowClick(post.id)}
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
                  <TableCell align="center">{maskUserId(post.author?.email || null)}</TableCell>
                  <TableCell align="center">{formatDate(post.createdAt)}</TableCell>
                  <TableCell align="center">{post.views || 0}</TableCell>
                  {currentUser?.role === 'admin' && (
                    <TableCell align="center">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post.id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
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

export default Posts; 