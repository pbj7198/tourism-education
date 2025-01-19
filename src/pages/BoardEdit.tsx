import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';

interface BoardPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  views: number;
}

const BoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<BoardPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'board_posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const postData = { id: docSnap.id, ...docSnap.data() } as BoardPost;
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);

          // 작성자가 아닌 경우 접근 제한
          if (currentUser?.id !== postData.authorId) {
            navigate('/board');
          }
        } else {
          setError('게시글을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('게시글 로드 중 오류:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      }
    };

    fetchPost();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      if (!id) return;

      await updateDoc(doc(db, 'board_posts', id), {
        title,
        content,
        updatedAt: new Date().toISOString()
      });

      navigate(`/board/${id}`);
    } catch (error) {
      console.error('게시글 수정 중 오류:', error);
      setError('게시글 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          로그인이 필요한 서비스입니다.
        </Alert>
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
        <Paper elevation={0} sx={{ p: 5, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
            게시글 수정
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
            />

            <TextField
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={15}
              fullWidth
              required
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/board/${id}`)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default BoardEdit; 