import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { JobPost } from '../types/job';

const JobPostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string>('');
  const [jobPost, setJobPost] = useState<JobPost>({
    id: '',
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    contactEmail: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
  });

  useEffect(() => {
    // 권한 체크
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    // 게시글 데이터 로드
    const loadJobPost = async () => {
      try {
        // TODO: Firestore에서 해당 ID의 채용공고 데이터 로드
        // const jobPostData = await getJobPost(id);
        // setJobPost(jobPostData);
      } catch (error) {
        setError('채용공고를 불러오는데 실패했습니다.');
      }
    };

    if (id) {
      loadJobPost();
    }
  }, [id, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobPost(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      // TODO: Firestore에 채용공고 데이터 업데이트
      // await updateJobPost(id, {
      //   ...jobPost,
      //   updatedAt: new Date().toISOString(),
      // });
      navigate(`/jobs/${id}`);
    } catch (error) {
      setError('채용공고 수정에 실패했습니다.');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          관리자만 접근할 수 있는 페이지입니다.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          <TextField
            fullWidth
            label="제목"
            name="title"
            value={jobPost.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="회사명"
            name="company"
            value={jobPost.company}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="설명"
            name="description"
            value={jobPost.description}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="자격요건"
            name="requirements"
            value={jobPost.requirements}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="근무지"
            name="location"
            value={jobPost.location}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="급여"
            name="salary"
            value={jobPost.salary}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="연락처 이메일"
            name="contactEmail"
            type="email"
            value={jobPost.contactEmail}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              수정하기
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/jobs/${id}`)}
            >
              취소
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default JobPostEdit; 