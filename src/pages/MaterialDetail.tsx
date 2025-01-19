import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Alert,
  IconButton,
  TextField,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { doc, getDoc, deleteDoc, updateDoc, increment, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';
import { maskUserId } from '../utils/maskUserId';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

interface MaterialPost {
  id: string;
  title: string;
  content: string;
  author: {
    uid: string;
    email: string;
    displayName: string | null;
  };
  fileUrl?: string;
  fileName?: string;
  createdAt: any;
  updatedAt: any;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

const MaterialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState<MaterialPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) {
          setError('게시글 ID가 유효하지 않습니다.');
          return;
        }

        const docRef = doc(db, 'materials', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({
            id: docSnap.id,
            ...docSnap.data(),
          } as MaterialPost);
        } else {
          setError('게시글을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, 'teaching_materials', id, 'comments'),
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

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      if (!id) {
        setError('게시글 ID가 유효하지 않습니다.');
        return;
      }

      await deleteDoc(doc(db, 'materials', id));
      navigate('/materials');
    } catch (err) {
      setError('게시글 삭제 중 오류가 발생했습니다.');
      console.error('Error deleting post:', err);
    }
  };

  const handleDownload = () => {
    if (post?.fileUrl) {
      const fileName = post.fileName || '다운로드파일';
      
      const link = document.createElement('a');
      link.href = post.fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const commentData = {
        content: newComment,
        author: currentUser.name,
        authorId: currentUser.id,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'teaching_materials', id!, 'comments'), commentData);
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
      setError('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentMenuOpen = (event: React.MouseEvent<HTMLElement>, commentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleCommentMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
    handleCommentMenuClose();
  };

  const handleSaveComment = async (commentId: string) => {
    if (!editedCommentContent.trim()) return;

    try {
      await updateDoc(doc(db, 'teaching_materials', id!, 'comments', commentId), {
        content: editedCommentContent,
      });
      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (error) {
      console.error('댓글 수정 중 오류:', error);
      setError('댓글 수정에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'teaching_materials', id!, 'comments', commentId));
      handleCommentMenuClose();
    } catch (error) {
      console.error('댓글 삭제 중 오류:', error);
      setError('댓글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!post) {
    return <Alert severity="info">게시글을 찾을 수 없습니다.</Alert>;
  }

  const isAuthor = currentUser && currentUser.email === post.author.email;

  return (
    <PageTransition>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              작성자: {post.author.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              작성일: {new Date(post.createdAt.toDate()).toLocaleString()}
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>

          {post.fileUrl && (
            <Button
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={handleDownload}
              sx={{ mt: 2 }}
            >
              {post.fileName || '파일 다운로드'} ({post.fileName?.split('.').pop()?.toUpperCase()})
            </Button>
          )}

          {isAuthor && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={() => navigate(`/materials/${id}/edit`)}>
                수정
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                삭제
              </Button>
            </Box>
          )}

          {/* 댓글 섹션 */}
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              댓글 {comments.length}개
            </Typography>

            {/* 댓글 작성 폼 */}
            {currentUser ? (
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
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                댓글을 작성하려면 로그인이 필요합니다.
              </Alert>
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
                        {maskUserId(comment.authorId)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                      {currentUser && currentUser.email === comment.authorId && (
                        <>
                          <IconButton
                            size="small"
                            onClick={(e) => handleCommentMenuOpen(e, comment.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && selectedCommentId === comment.id}
                            onClose={handleCommentMenuClose}
                          >
                            <MenuItem onClick={() => handleEditComment(comment)}>
                              수정
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteComment(comment.id)}>
                              삭제
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </Box>
                    {editingCommentId === comment.id ? (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            onClick={() => setEditingCommentId(null)}
                          >
                            취소
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleSaveComment(comment.id)}
                          >
                            저장
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {comment.content}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
              {comments.length === 0 && (
                <Typography color="text.secondary" align="center">
                  아직 댓글이 없습니다.
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/materials')}
            >
              목록으로
            </Button>
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default MaterialDetail; 