import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { JobPost } from '../types/job';

const JobPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
    status: 'active',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobPost = async () => {
      try {
        // TODO: Firestore에서 해당 ID의 채용공고 데이터 로드
        // const jobPostData = await getJobPost(id);
        // setJobPost(jobPostData);
        setLoading(false);
      } catch (error) {
        setError('채용공고를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    if (id) {
      loadJobPost();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/jobs/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 채용공고를 삭제하시겠습니까?')) {
      return;
    }

    try {
      // TODO: Firestore에서 채용공고 삭제
      // await deleteJobPost(id);
      navigate('/jobs');
    } catch (error) {
      setError('채용공고 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              {jobPost.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: 'text.secondary', mb: 2 }}>
              <Typography variant="body2">
                작성자: {jobPost.createdBy}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2">
                작성일: {new Date(jobPost.createdAt).toLocaleDateString('ko-KR')}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2">
                수정일: {new Date(jobPost.updatedAt).toLocaleDateString('ko-KR')}
              </Typography>
            </Box>
          </Box>
          {user?.role === 'admin' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEdit}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            기본 정보
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2, mb: 2 }}>
            <Typography variant="body1" color="text.secondary">회사명</Typography>
            <Typography variant="body1">{jobPost.company}</Typography>

            <Typography variant="body1" color="text.secondary">근무지</Typography>
            <Typography variant="body1">{jobPost.location}</Typography>

            <Typography variant="body1" color="text.secondary">급여</Typography>
            <Typography variant="body1">{jobPost.salary}</Typography>

            <Typography variant="body1" color="text.secondary">상태</Typography>
            <Chip
              size="small"
              label={jobPost.status === 'active' ? '모집중' : '마감'}
              color={jobPost.status === 'active' ? 'success' : 'default'}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            상세 내용
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {jobPost.description}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            자격 요건
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {jobPost.requirements}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            지원 방법
          </Typography>
          <Typography variant="body1">
            이메일: {jobPost.contactEmail}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobPostDetail; 