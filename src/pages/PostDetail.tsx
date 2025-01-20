import { Container, Box, Typography, Paper, Divider, IconButton, TextField, Button, Avatar } from '@mui/material';
import PageTransition from '../components/PageTransition';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot, query, orderBy, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  isNotice?: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  userId: string;
  postId: string;
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // 조회수 증가
          await updateDoc(docRef, {
            views: increment(1)
          });
          
          setPost({ ...docSnap.data() as Post });
        }
      } catch (error) {
        console.error('게시글 로드 중 오류:', error);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // 댓글 실시간 업데이트 구독
    const q = query(
      collection(db, 'posts', id, 'comments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleEdit = () => {
    navigate(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      await updateDoc(doc(db, 'posts', id), { deleted: true });
      navigate('/notice');
    } catch (error) {
      console.error('게시글 삭제 중 오류:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) {
      setError('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newCommentDoc = {
        content: newComment,
        author: currentUser.name,
        createdAt: new Date().toISOString(),
        userId: currentUser.id,
        postId: id || ''
      };

      if (!id) {
        throw new Error('게시글 ID가 없습니다.');
      }

      const commentsRef = collection(db, 'posts', id, 'comments');
      await addDoc(commentsRef, newCommentDoc);
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
      setError('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) return null;

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, 
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
          }}
        >
          {/* 게시글 헤더 */}
          <Box sx={{ mb: 4, borderBottom: '1px solid #e0e0e0', pb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 600,
                  color: '#333',
                }}
              >
                {post.title}
              </Typography>
              {currentUser?.role === 'admin' && (
                <Box>
                  <IconButton onClick={handleEdit}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                color: '#666',
                fontSize: '0.9rem'
              }}
            >
              <Box>작성자: {post.author}</Box>
              <Divider orientation="vertical" flexItem />
              <Box>작성일: {post.createdAt}</Box>
              <Divider orientation="vertical" flexItem />
              <Box>조회수: {post.views}</Box>
            </Box>
          </Box>

          {/* 게시글 본문 */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              sx={{ 
                fontSize: '1.1rem',
                color: '#444',
                lineHeight: 1.8,
                whiteSpace: 'pre-line'
              }}
            >
              {post.content}
            </Typography>
          </Box>

          {/* 댓글 섹션 */}
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              댓글 {comments.length}개
            </Typography>

            {/* 댓글 작성 폼 */}
            {currentUser && (
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="댓글을 작성해주세요"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? '등록 중...' : '댓글 등록'}
                  </Button>
                </Box>
              </Box>
            )}

            {/* 댓글 목록 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {comments.map((comment) => (
                <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {comment.author[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {comment.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default PostDetail; 