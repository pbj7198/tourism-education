import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useAuth } from '../contexts/AuthContext';
import { JobPost } from '../types/job';

// 임시 데이터 (실제로는 API에서 가져와야 함)
const mockJobPost: JobPost = {
  id: 13,
  title: '한국문화영상고등학교 기간제 교사 모집',
  content: `1. 모집 분야
- 관광 교과 기간제 교사 1명

2. 자격 요건
- 중등학교 정교사(2급) 이상 자격증 소지자 (관광)
- 관련 분야 경력자 우대

3. 근무 조건
- 근무 기간: 2024년 3월 1일 ~ 2024년 8월 31일
- 근무 시간: 주 5일, 8:30 ~ 16:30
- 급여: 교육청 규정에 따름

4. 제출 서류
- 이력서, 자기소개서
- 교원자격증 사본
- 경력증명서 (해당자에 한함)

5. 전형 방법
- 1차: 서류 심사
- 2차: 면접 (서류 합격자에 한함)

6. 접수 방법
- 이메일 접수: school@example.com
- 방문 접수: 학교 교무실

7. 문의
- 교무실: 02-XXX-XXXX`,
  author: {
    id: 'user1',
    name: 'kang****'
  },
  date: '2024.10.30',
  isNotice: false,
  views: 45,
  status: 'active',
  school: '한국문화영상고등학교',
  location: '서울특별시',
  position: '관광 교과 기간제 교사',
  deadline: '2024.02.28',
  requirements: '중등학교 정교사(2급) 이상 자격증 소지자 (관광)'
};

const JobPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<JobPost | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // TODO: API 호출로 대체
    setPost(mockJobPost);
  }, [id]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/jobs/${post?.id}/edit`);
  };

  const handleDelete = () => {
    handleMenuClose();
    // TODO: 삭제 API 호출
    console.log('Delete post:', post);
  };

  const canManagePost = (post: JobPost) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.id === post.author.id;
  };

  if (!post) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button onClick={() => navigate('/jobs')}>
          목록으로
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {post.isNotice && <VolumeUpIcon sx={{ color: 'text.secondary' }} />}
              <Typography variant="h5" component="h1" gutterBottom>
                {post.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
              <Typography variant="body2">
                작성자: {post.author.name}
              </Typography>
              <Typography variant="body2">
                작성일: {post.date}
              </Typography>
              <Typography variant="body2">
                조회수: {post.views}
              </Typography>
            </Box>
          </Box>

          {canManagePost(post) && (
            <Box>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  수정
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  삭제
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              학교명
            </Typography>
            <Typography variant="body1">
              {post.school}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              지역
            </Typography>
            <Typography variant="body1">
              {post.location}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              모집 포지션
            </Typography>
            <Typography variant="body1">
              {post.position}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              지원 마감일
            </Typography>
            <Typography variant="body1">
              {post.deadline}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              자격요건
            </Typography>
            <Typography variant="body1">
              {post.requirements}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="body1"
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: 'inherit',
          }}
        >
          {post.content}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/jobs')}
          >
            목록
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobPostDetail; 