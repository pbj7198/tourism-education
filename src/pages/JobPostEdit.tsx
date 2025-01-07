import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { JobPost, JobPostFormData } from '../types/job';

// 임시 데이터 (실제로는 API에서 가져와야 함)
const mockJobPost: JobPost = {
  id: 13,
  title: '한국문화영상고등학교 기간제 교사 모집',
  content: `1. 모집 분야\n- 관광 교과 기간제 교사 1명\n\n2. 자격 요건\n- 중등학교 정교사(2급) 이상 자격증 소지자 (관광)\n- 관련 분야 경력자 우대\n\n3. 근무 조건\n- 근무 기간: 2024년 3월 1일 ~ 2024년 8월 31일\n- 근무 시간: 주 5일, 8:30 ~ 16:30\n- 급여: 교육청 규정에 따름\n\n4. 제출 서류\n- 이력서, 자기소개서\n- 교원자격증 사본\n- 경력증명서 (해당자에 한함)\n\n5. 전형 방법\n- 1차: 서류 심사\n- 2차: 면접 (서류 합격자에 한함)\n\n6. 접수 방법\n- 이메일 접수: school@example.com\n- 방문 접수: 학교 교무실\n\n7. 문의\n- 교무실: 02-XXX-XXXX`,
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

const JobPostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<JobPostFormData>({
    title: '',
    content: '',
    isNotice: false,
    school: '',
    location: '',
    position: '',
    deadline: '',
    requirements: '',
  });

  useEffect(() => {
    // TODO: API 호출로 대체
    if (mockJobPost) {
      setFormData({
        title: mockJobPost.title,
        content: mockJobPost.content,
        isNotice: mockJobPost.isNotice,
        school: mockJobPost.school || '',
        location: mockJobPost.location || '',
        position: mockJobPost.position || '',
        deadline: mockJobPost.deadline || '',
        requirements: mockJobPost.requirements || '',
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: API 호출로 대체
      console.log('Form submitted:', formData);
      navigate(`/jobs/${id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : '게시글 수정에 실패했습니다.');
    }
  };

  const canEditPost = () => {
    if (!user || !mockJobPost) return false;
    if (user.role === 'admin') return true;
    return user.id === mockJobPost.author.id;
  };

  if (!canEditPost()) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            게시글을 수정할 권한이 없습니다.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            채용공고 수정
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {user.role === 'admin' && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isNotice}
                        onChange={handleChange}
                        name="isNotice"
                      />
                    }
                    label="공지사항으로 등록"
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="제목"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="학교명"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="지역"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="모집 포지션"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="지원 마감일"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="자격요건"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="상세내용"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  multiline
                  rows={10}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/jobs/${id}`)}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    수정
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default JobPostEdit; 