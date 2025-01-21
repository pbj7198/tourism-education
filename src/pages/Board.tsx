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
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
  Pagination,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { collection, query, orderBy, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { maskUserId } from '../utils/maskUserId';

interface BoardPost {
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

const ITEMS_PER_PAGE = 10;

const Board = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'board_posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BoardPost[];
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/board/${postId}/edit`);
  };

  const handleDelete = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPost(posts.find(post => post.id === postId) || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;

    try {
      await deleteDoc(doc(db, 'board_posts', selectedPost.id));
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('게시글 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string | Timestamp) => {
    if (dateString instanceof Timestamp) {
      const date = dateString.toDate();
      return date.toLocaleDateString('ko-KR');
    } else {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR');
    }
  };

  const currentPosts = posts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const pageCount = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const renderMobileList = () => (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {currentPosts.map((post) => (
        <Box key={post.id}>
          <ListItem
            alignItems="flex-start"
            onClick={() => navigate(`/board/${post.id}`)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '0.95rem',
                    }}
                  >
                    {post.title}
                  </Typography>
                  {post.fileUrl && <AttachFileIcon fontSize="small" color="action" />}
                </Box>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {maskUserId(post.author?.email || null)} | {formatDate(post.createdAt)} | 조회 {post.views || 0}
                  </Typography>
                  {(currentUser?.email === post.author?.email || currentUser?.role === 'admin') && (
                    <Box sx={{ mt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleEdit(post.id, e)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => handleDelete(post.id, e)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              }
            />
          </ListItem>
          <Divider component="li" />
        </Box>
      ))}
      {posts.length === 0 && (
        <ListItem>
          <ListItemText
            primary={
              <Typography align="center" color="text.secondary">
                게시글이 없습니다.
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  );

  const renderDesktopTable = () => (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>제목</TableCell>
            <TableCell align="center" width={150}>작성자</TableCell>
            <TableCell align="center" width={150}>작성일</TableCell>
            <TableCell align="center" width={100}>조회수</TableCell>
            {currentUser && <TableCell align="center" width={100}>관리</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((post) => (
            <TableRow
              key={post.id}
              hover
              onClick={() => navigate(`/board/${post.id}`)}
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
              {currentUser && (
                <TableCell align="center">
                  {(currentUser.email === post.author?.email || currentUser.role === 'admin') && (
                    <>
                      <IconButton
                        size="small"
                        onClick={(e) => handleEdit(post.id, e)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => handleDelete(post.id, e)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={currentUser ? 5 : 4} align="center">
                게시글이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            관광교사 게시판
          </Typography>
          {currentUser && (
            <Button
              variant="contained"
              onClick={() => navigate('/board/new')}
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

        {!currentUser && (
          <Alert severity="info" sx={{ mb: 3 }}>
            글을 작성하려면 로그인이 필요합니다.
          </Alert>
        )}

        <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          {isMobile ? renderMobileList() : renderDesktopTable()}
        </Paper>

        {posts.length > 0 && (
          <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
              showFirstButton 
              showLastButton
            />
          </Stack>
        )}

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
            <Button onClick={confirmDelete} color="error">
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageTransition>
  );
};

export default Board;
