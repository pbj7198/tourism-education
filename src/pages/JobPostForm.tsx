import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';

const JobPostForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNotice, setIsNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser) {
    navigate('/jobs');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const postData = {
        title: title.trim(),
        content: content.trim(),
        author: {
          id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.email?.split('@')[0] || '익명'
        },
        createdAt: serverTimestamp(),
        views: 0,
        isNotice: isNotice && currentUser.role === 'admin'
      };

      const docRef = await addDoc(collection(db, 'job_posts'), postData);
      navigate(`/jobs/${docRef.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('게시글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4 }}>
            채용소식 등록
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
            />

            {currentUser?.role === 'admin' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isNotice}
                    onChange={(e) => setIsNotice(e.target.checked)}
                  />
                }
                label="공지사항으로 등록"
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              multiline
              rows={15}
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/jobs')}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? '등록 중...' : '등록'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default JobPostForm; 