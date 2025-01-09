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
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageTransition from '../components/PageTransition';
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { addTestPosts } from '../utils/addTestData';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
}

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
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
                <TableCell align="center">작성자</TableCell>
                <TableCell align="center">작성일</TableCell>
                <TableCell align="center">조회수</TableCell>
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
                  <TableCell>{post.title}</TableCell>
                  <TableCell align="center">{post.author}</TableCell>
                  <TableCell align="center">{post.createdAt}</TableCell>
                  <TableCell align="center">{post.views}</TableCell>
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
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </PageTransition>
  );
};

export default Posts; 