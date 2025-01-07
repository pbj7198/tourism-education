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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';

interface ResourcePost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  views: number;
  downloadUrl?: string;
}

const Resources = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ResourcePost[]>([
    {
      id: 1,
      title: '2024 관광교사 임용시험 기출문제 해설',
      content: '기출문제 해설 내용...',
      author: '관리자',
      date: '2024-03-15',
      category: '기출문제',
      views: 128,
      downloadUrl: '/files/2024_tourism_exam.pdf',
    },
    {
      id: 2,
      title: '관광 교과 지도안 예시',
      content: '지도안 내용...',
      author: '관리자',
      date: '2024-03-10',
      category: '교수학습자료',
      views: 95,
      downloadUrl: '/files/tourism_lesson_plan.pdf',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ResourcePost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDownloadUrl, setEditDownloadUrl] = useState('');

  const categories = [
    '기출문제',
    '교수학습자료',
    '연구자료',
    '수업자료',
    '기타자료',
  ];

  const handleCreateClick = () => {
    setSelectedPost(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
    setEditDownloadUrl('');
    setIsDialogOpen(true);
  };

  const handleEditClick = (post: ResourcePost) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setEditDownloadUrl(post.downloadUrl || '');
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
    setEditCategory('');
    setEditDownloadUrl('');
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setEditCategory(event.target.value);
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
              category: editCategory,
              downloadUrl: editDownloadUrl || undefined,
            }
          : post
      ));
    } else {
      // 새 글 작성
      const newPost: ResourcePost = {
        id: Math.max(...posts.map(p => p.id)) + 1,
        title: editTitle,
        content: editContent,
        author: user?.name || '관리자',
        date: new Date().toISOString().split('T')[0],
        category: editCategory,
        views: 0,
        downloadUrl: editDownloadUrl || undefined,
      };
      setPosts([newPost, ...posts]);
    }
    handleDialogClose();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          관광교사 임용자료
        </Typography>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            새 자료 등록
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="50%">제목</TableCell>
              <TableCell>분류</TableCell>
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
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
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
          {selectedPost ? '임용자료 수정' : '새 임용자료 등록'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="제목"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>분류</InputLabel>
            <Select
              value={editCategory}
              label="분류"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="내용"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            multiline
            rows={8}
            fullWidth
            margin="normal"
          />
          <TextField
            label="첨부파일 URL"
            value={editDownloadUrl}
            onChange={(e) => setEditDownloadUrl(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="파일 다운로드 URL을 입력하세요"
          />
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

export default Resources;
