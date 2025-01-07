import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useAuth } from '../contexts/AuthContext';

interface NoticePost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  isNotice: boolean;
  views: number;
}

const Notice = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<NoticePost[]>([
    {
      id: 1,
      title: '2024년 한국관광교육연구회 정기총회 개최 안내',
      content: '정기총회 내용...',
      author: '관리자',
      date: '2024-03-15',
      isNotice: true,
      views: 45,
    },
    {
      id: 2,
      title: '관광 교사 연수 프로그램 안내',
      content: '연수 프로그램 내용...',
      author: '관리자',
      date: '2024-03-10',
      isNotice: false,
      views: 32,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NoticePost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isNotice, setIsNotice] = useState(false);

  const handleCreateClick = () => {
    setSelectedPost(null);
    setEditTitle('');
    setEditContent('');
    setIsNotice(false);
    setIsDialogOpen(true);
  };

  const handleEditClick = (post: NoticePost) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsNotice(post.isNotice);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (postId: number) => {
    // TODO: API 호출로 대체
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPost(null);
    setEditTitle('');
    setEditContent('');
    setIsNotice(false);
  };

  const handleSave = () => {
    if (selectedPost) {
      // 수정
      setPosts(posts.map(post =>
        post.id === selectedPost.id
          ? {
              ...post,
              title: editTitle,
              content: editContent,
              isNotice,
            }
          : post
      ));
    } else {
      // 새 글 작성
      const newPost: NoticePost = {
        id: Math.max(...posts.map(p => p.id)) + 1,
        title: editTitle,
        content: editContent,
        author: user?.name || '관리자',
        date: new Date().toISOString().split('T')[0],
        isNotice,
        views: 0,
      };
      setPosts([newPost, ...posts]);
    }
    handleDialogClose();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          연구회 공지사항
        </Typography>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            새 글 작성
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="60%">제목</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell align="center">조회수</TableCell>
              {user?.role === 'admin' && (
                <TableCell align="center">관리</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {post.isNotice && (
                      <Chip
                        icon={<VolumeUpIcon />}
                        label="공지"
                        size="small"
                        color="primary"
                      />
                    )}
                    {post.title}
                  </Box>
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell align="center">{post.views}</TableCell>
                {user?.role === 'admin' && (
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(post)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(post.id)}
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

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPost ? '공지사항 수정' : '새 공지사항 작성'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="제목"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="내용"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            multiline
            rows={12}
            fullWidth
            margin="normal"
          />
          <Button
            variant={isNotice ? "contained" : "outlined"}
            startIcon={<VolumeUpIcon />}
            onClick={() => setIsNotice(!isNotice)}
            sx={{ mt: 2 }}
          >
            공지로 등록
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>취소</Button>
          <Button onClick={handleSave} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notice;
