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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { maskUserId } from '../utils/maskUserId';

interface MaterialPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    email: string | null;
    name: string;
  };
  createdAt: string;
  views: number;
  fileUrl?: string;
  fileName?: string;
}

const TeachingMaterials = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<MaterialPost[]>([]);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<MaterialPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'teaching_materials'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MaterialPost[];
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (post: MaterialPost) => {
    navigate(`/materials/${post.id}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      await deleteDoc(doc(db, 'teaching_materials', selectedPost.id));
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('게시글 삭제에 실패했습니다.');
    }
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            관광교사 임용자료
          </Typography>
          {currentUser && (
            <Button
              variant="contained"
              onClick={() => navigate('/materials/new')}
              startIcon={<AddIcon />}
            >
              새 글 작성
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell align="center" width={150}>작성자</TableCell>
                <TableCell align="center" width={150}>작성일</TableCell>
                <TableCell align="center" width={100}>조회수</TableCell>
                <TableCell align="center" width={100}>첨부파일</TableCell>
                {currentUser?.role === 'admin' && (
                  <TableCell align="center" width={120}>관리</TableCell>
                )}
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
                  <TableCell align="center">{maskUserId(post.author?.email || null)}</TableCell>
                  <TableCell align="center">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{post.views || 0}</TableCell>
                  <TableCell align="center">
                    {post.fileUrl && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(post.fileUrl!);
                        }}
                      >
                        <CloudDownloadIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  {currentUser?.role === 'admin' && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                          setDeleteDialogOpen(true);
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
                  <TableCell colSpan={currentUser?.role === 'admin' ? 6 : 5} align="center">
                    게시글이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>게시글 삭제</DialogTitle>
          <DialogContent>
            정말로 이 게시글을 삭제하시겠습니까?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleDelete} color="error">
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageTransition>
  );
};

export default TeachingMaterials; 