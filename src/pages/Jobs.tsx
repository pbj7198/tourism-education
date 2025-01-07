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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useAuth } from '../contexts/AuthContext';

interface JobPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  isNotice: boolean;
  views: number;
  school?: string;
  location?: string;
  position?: string;
  deadline?: string;
}

const Jobs = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<JobPost[]>([
    {
      id: 1,
      title: '2024학년도 관광과 교사 채용 공고',
      content: '채용 공고 내용...',
      author: '관리자',
      date: '2024-03-15',
      category: '채용공고',
      isNotice: true,
      views: 156,
      school: '한국관광고등학교',
      location: '서울특별시',
      position: '관광교사',
      deadline: '2024-04-15',
    },
    {
      id: 2,
      title: '2024학년도 2학기 기간제 교사 모집',
      content: '기간제 교사 모집 내용...',
      author: '관리자',
      date: '2024-03-10',
      category: '기간제',
      isNotice: false,
      views: 89,
      school: '부산관광고등학교',
      location: '부산광역시',
      position: '기간제교사',
      deadline: '2024-07-31',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<JobPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editSchool, setEditSchool] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [isNotice, setIsNotice] = useState(false);

  const categories = [
    '채용공고',
    '기간제',
    '시간강사',
    '강사모집',
    '기타',
  ];

  const handleCreateClick = () => {
    setSelectedPost(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
    setEditSchool('');
    setEditLocation('');
    setEditPosition('');
    setEditDeadline('');
    setIsNotice(false);
    setIsDialogOpen(true);
  };

  const handleEditClick = (post: JobPost) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setEditSchool(post.school || '');
    setEditLocation(post.location || '');
    setEditPosition(post.position || '');
    setEditDeadline(post.deadline || '');
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
    setEditCategory('');
    setEditSchool('');
    setEditLocation('');
    setEditPosition('');
    setEditDeadline('');
    setIsNotice(false);
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
              school: editSchool || undefined,
              location: editLocation || undefined,
              position: editPosition || undefined,
              deadline: editDeadline || undefined,
              isNotice,
            }
          : post
      ));
    } else {
      // 새 글 작성
      const newPost: JobPost = {
        id: Math.max(...posts.map(p => p.id)) + 1,
        title: editTitle,
        content: editContent,
        author: user?.name || '관리자',
        date: new Date().toISOString().split('T')[0],
        category: editCategory,
        isNotice,
        views: 0,
        school: editSchool || undefined,
        location: editLocation || undefined,
        position: editPosition || undefined,
        deadline: editDeadline || undefined,
      };
      setPosts([newPost, ...posts]);
    }
    handleDialogClose();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          관광교사 채용소식
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
              <TableCell width="40%">제목</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>학교</TableCell>
              <TableCell>지역</TableCell>
              <TableCell>마감일</TableCell>
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
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.school}</TableCell>
                <TableCell>{post.location}</TableCell>
                <TableCell>{post.deadline}</TableCell>
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
          {selectedPost ? '채용공고 수정' : '새 채용공고 작성'}
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
            label="학교명"
            value={editSchool}
            onChange={(e) => setEditSchool(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="지역"
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="모집분야"
            value={editPosition}
            onChange={(e) => setEditPosition(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="마감일"
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="내용"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            multiline
            rows={8}
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

export default Jobs;
