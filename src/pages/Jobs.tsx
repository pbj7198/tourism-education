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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { collection, query, orderBy, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
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
  fileUrl?: string;
  fileName?: string;
}

const Jobs = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<JobPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'job_posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JobPost[];
        
        // 클라이언트 측에서 정렬
        const sortedPosts = postsData.sort((a, b) => {
          if (a.isNotice && !b.isNotice) return -1;
          if (!a.isNotice && b.isNotice) return 1;
          
          // 같은 카테고리 내에서는 최신순 정렬
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (date: string | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('ko-KR');
    }
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const handleEdit = (post: JobPost) => {
    navigate(`/jobs/${post.id}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      await deleteDoc(doc(db, 'job_posts', selectedPost.id));
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('게시글 삭제에 실패했습니다.');
    }
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
                  onClick={() => navigate(`/jobs/${post.id}`)}
                  sx={{ 
                    cursor: 'pointer',
                    backgroundColor: post.isNotice ? '#f5f5f5' : 'inherit'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {post.isNotice && (
                        <Typography
                          component="span"
                          sx={{
                            color: 'error.main',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            mr: 1
                          }}
                        >
                          [공지]
                        </Typography>
                      )}
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
                  <TableCell colSpan={currentUser?.role === 'admin' ? 5 : 4} align="center">
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

export default Jobs;
