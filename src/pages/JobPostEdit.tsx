import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';

interface JobPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  views: number;
}

const JobPostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState<JobPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'job_posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = { id: docSnap.id, ...docSnap.data() } as JobPost;
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
        } else {
          setError('게시글을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('게시글 로드 중 오류:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post && (!currentUser || currentUser.id !== post.authorId)) {
      navigate(`/jobs/${id}`);
    }
  }, [post, currentUser, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Firestore 문서 업데이트
      await updateDoc(doc(db, 'job_posts', id!), {
        title,
        content,
      });

      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error('게시글 수정 중 오류:', error);
      setError('게시글 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          채용공고 수정
        </Typography>

        <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={15}
              margin="normal"
              required
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/jobs/${id}`)}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    수정 중...
                  </>
                ) : '수정'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default JobPostEdit; 