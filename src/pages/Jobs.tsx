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
  isNotice?: boolean;
  fileUrl?: string;
  fileName?: string;
}

const ITEMS_PER_PAGE = 10;

const Jobs = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<JobPost | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'job_posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JobPost[];
        
        const sortedPosts = postsData.sort((a, b) => {
          if (a.isNotice && !b.isNotice) return -1;
          if (!a.isNotice && b.isNotice) return 1;
          
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

  // 공지사항을 먼저 보여주고, 나머지 게시글은 날짜순으로 정렬
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isNotice && !b.isNotice) return -1;
    if (!a.isNotice && b.isNotice) return 1;
    return b.createdAt.seconds - a.createdAt.seconds;
  });

  // 현재 페이지에 해당하는 게시글만 선택
  const currentPosts = sortedPosts.slice(
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
            onClick={() => navigate(`/jobs/${post.id}`)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  {post.isNotice && (
                    <Typography
                      component="span"
                      color="primary.main"
                      sx={{
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      [공지]
                    </Typography>
                  )}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '0.95rem',
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {post.title}
                  </Typography>
                  {post.fileUrl && <AttachFileIcon fontSize="small" color="action" sx={{ flexShrink: 0 }} />}
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
                  {currentUser?.role === 'admin' && (
                    <Box sx={{ mt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
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
            {currentUser?.role === 'admin' && (
              <TableCell align="center" width={120}>관리</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((post) => (
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
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  {post.isNotice && (
                    <Typography
                      component="span"
                      color="primary.main"
                      sx={{
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      [공지]
                    </Typography>
                  )}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '0.95rem',
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {post.title}
                  </Typography>
                  {post.fileUrl && (
                    <AttachFileIcon fontSize="small" color="action" sx={{ flexShrink: 0 }} />
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
  );

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            관광교사 채용소식
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {currentUser?.role === 'admin' && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/jobs/new')}
              >
                새 글 작성
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
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
